import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Dashboard from "@/app/dashboard/Dashboard";
import { useAuth } from "@/contexts/AuthContext";
import "@testing-library/jest-dom";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import React from "react";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/contexts/AuthContext", () => ({
  useAuth: jest.fn(),
}));

jest.mock("firebase/firestore", () => ({
  getFirestore: jest.fn(() => ({})),
  doc: jest.fn(),
  getDoc: jest.fn(),
  setDoc: jest.fn(),
  updateDoc: jest.fn(),
}));

jest.mock("@/app/dashboard/DeviationLineChart", () => () => (
  <div>Mock DeviationLineChart</div>
));

describe("Dashboard Component", () => {
  beforeEach(() => {
    // Mock the `doc` function to return a fake document reference
    doc.mockReturnValue("mockedUserRef");

    useAuth.mockReturnValue({
      user: { uid: "mockUserId" },
      userDataObj: {
        metadata: { expectedCycleStartDay: 25 },
        years: {},
      },
      setUserDataObj: jest.fn(),
      loading: false,
    });
  });

  test("should render loading state when auth is still loading", () => {
    useAuth.mockReturnValue({
      user: null,
      userDataObj: null,
      loading: true,
    });

    render(<Dashboard />);

    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  test("should render Login when no user is authenticated", () => {
    useAuth.mockReturnValue({
      user: null,
      userDataObj: null,
      loading: false,
    });

    render(<Dashboard />);

    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
  });

  test("should render core elements like calendar, tooltip, and display a number in the expectedCycleStartDay input field if existed(in this case it's 25) when user is authenticated", async () => {
    render(<Dashboard />);

    expect(screen.getByLabelText("tooltip")).toBeInTheDocument();
    expect(
      screen.getByLabelText("tooltip-for-review-notes")
    ).toBeInTheDocument();
    expect(screen.getByLabelText("calendar-grid")).toBeInTheDocument();
    // Expect Note button and Period button are rendered
    expect(screen.getByLabelText("period-button")).toBeInTheDocument();
    expect(screen.getByLabelText("note-button")).toBeInTheDocument();
    expect(screen.getByText("Cycle Pattern")).toBeInTheDocument();
    expect(
      screen.getByText("Set Expected Cycle Start Day")
    ).toBeInTheDocument();
    // Expect expectedCycleStarDay input to reflect the value of 25
    expect(screen.getByDisplayValue("25")).toBeInTheDocument();
  });

  test("should call setDoc, update period button text to Remove, add period icon in Calendar when click period button", async () => {
    // The default selected day is from current date when no selected date picked by user, and default period button text is "Add", when click "Add" it should switch to "Remove"
    // Mock the current date
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth(); // Zero-indexed
    const day = now.getDate();
    render(<Dashboard />);

    // Expect "period-icon" to not be in the Calendar initially
    expect(screen.queryByLabelText("period-icon")).not.toBeInTheDocument(); // ***To check if an element is absent from the DOM, use queryByLabelText NOT getByLabelText, as queryByLabelText will return null if no matching element exists, and the test will pass the assertion. getByLabelText on the other hand will throw an error when it cannot find the element, leading to test failure

    const periodButton = screen.getByLabelText("period-button");
    fireEvent.click(periodButton);

    expect(setDoc).toHaveBeenCalledWith(
      "mockedUserRef",
      expect.objectContaining({
        years: {
          [year]: {
            [month]: {
              [day]: { period: true },
            },
          },
        },
      }),
      { merge: true }
    );
    // Expect period button with "Remove" text
    expect(screen.getByText("Remove")).toBeInTheDocument();
    // Expect period icon rendered in Calendar
    expect(screen.getByLabelText("period-icon")).toBeInTheDocument();
  });

  test("show NoteModal when click note button, save note and display the note in ReviewNotes", async () => {
    // Mock the current date
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth(); // Zero-indexed
    const day = now.getDate();

    // Mock user and initial notes
    const mockUser = { uid: "mockedUserId" };
    const mockInitialNotes = [];

    // Mock the Dashboard component with props
    render(<Dashboard user={mockUser} targetMonthNotes={mockInitialNotes} />);

    // Expect no note-icon initially
    expect(screen.queryByLabelText("note-icon")).not.toBeInTheDocument();
    // Expect the review-notes section to be initially empty
    expect(screen.getByLabelText("review-notes")).toBeInTheDocument();
    expect(screen.queryByText("example note")).not.toBeInTheDocument();

    // Get note button and click it, expect to display NoteModal
    const noteButton = screen.getByLabelText("note-button");
    fireEvent.click(noteButton);
    expect(screen.getByLabelText("note-modal")).toBeInTheDocument();

    // Type note and click save, expect to call setDoc in function handleNoteSave
    fireEvent.change(screen.getByLabelText("note-input"), {
      target: { value: "example note" },
    });
    const saveButton = screen.getByRole("button", { name: "Save" });
    fireEvent.click(saveButton);
    expect(setDoc).toHaveBeenCalledWith(
      "mockedUserRef",
      expect.objectContaining({
        years: {
          [year]: {
            [month]: {
              [day]: { note: "example note" },
            },
          },
        },
      }),
      { merge: true }
    );
    // Expect note-icon to show in Calendar
    expect(screen.getByLabelText("note-icon")).toBeInTheDocument();

    // Mock the update of targetMonthNotes to include the saved note and rerender the Dashboard
    const updatedNotes = [
      { displayedDate: `${month + 1}/${day}/${year}`, note: "example note" },
    ];
    render(<Dashboard user={mockUser} targetMonthNotes={updatedNotes} />);

    // Verify that the note is displayed in ReviewNotes
    expect(await screen.findByText("example note")).toBeInTheDocument();
  });

  test("should handle expectedCycleStartDay input change and validation", async () => {
    render(<Dashboard />);

    const inputField = screen.getByLabelText("expected cycle start day");

    // Expect an error message when enter an invalid input
    fireEvent.change(inputField, { target: { value: "invalid" } });
    expect(
      screen.getByText("Please enter a valid whole number.")
    ).toBeInTheDocument();

    // Expect input field to reflect the valid value on change
    fireEvent.change(inputField, { target: { value: "15" } });
    expect(screen.getByDisplayValue("15")).toBeInTheDocument();
  });

  test("should update the cycle start day successfully with valid input", async () => {
    render(<Dashboard />);

    // Get expectedCycleStartDay input and save button
    const inputField = screen.getByLabelText("expected cycle start day");
    const saveButton = screen.getByRole("button", {
      name: "save cycle start day button",
    });

    // Simulate entering a valid cycle start day and save it
    fireEvent.change(inputField, { target: { value: "10" } });
    fireEvent.click(saveButton);

    // Expect updatedDoc in function saveExpectedCycleStartDay is called and display success message after saved
    await waitFor(() => {
      expect(updateDoc).toHaveBeenCalledWith(
        "mockedUserRef",
        expect.objectContaining({
          "metadata.expectedCycleStartDay": 10,
        })
      );

      expect(screen.getByText("Successfully saved!")).toBeInTheDocument();
    });
  });
});
