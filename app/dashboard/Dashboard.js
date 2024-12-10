"use client";

import React, { useEffect, useState } from "react";
import Calendar from "./Calendar";
import { useAuth } from "@/contexts/AuthContext";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import Loading from "../../components/shared/Loading";
import Login from "../Login";
import { db } from "@/firebase";
import NoteModal from "./NoteModal";
import Button from "../../components/shared/Button";
import ActionButton from "./ActionButton";
import ReviewNotes from "../../components/shared/ReviewNotes";
import TooltipMain from "./TooltipMain";
import TooltipForReviewNotes from "./TooltipForReviewNotes";
import DeviationLineChart from "./DeviationLineChart";
import TooltipDeviationChart from "./TooltipDeviationChart";

// Utility function to update local data
export function updateDayData(
  userDataObj,
  updatedValue,
  targetYear,
  targetMonth,
  targetDay
) {
  const newData = { ...userDataObj };

  if (!newData.years) newData.years = {};
  if (!newData.years[targetYear]) newData.years[targetYear] = {};
  if (!newData.years[targetYear][targetMonth])
    newData.years[targetYear][targetMonth] = {};

  const existingDayData =
    newData.years[targetYear][targetMonth][targetDay] || {};
  newData.years[targetYear][targetMonth][targetDay] = {
    ...existingDayData,
    ...updatedValue,
  };

  return newData;
}

export default function Dashboard() {
  const { user, userDataObj, setUserDataObj, loading: loadingAuth } = useAuth();
  const [data, setData] = useState({});
  // Initialize the custom hook with userDataObj
  // const { data, setData } = useDashboardData(userDataObj);
  const [showNoteModal, setShowNoteModal] = useState(false); // state to show/hide NoteModal
  const [selectedNote, setSelectedNote] = useState(null);
  const [isNoteVisible, setIsNoteVisible] = useState(false); // state to show/hide note when user clicks the note emoji in Calendar
  const [selectedDay, setSelectedDay] = useState({});
  const [targetMonthNotes, setTargetMonthNotes] = useState([]);
  const [expectedCycleStartDay, setExpectedCycleStartDay] = useState("");
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // initialize selectedDay after the component mounts to avoid SSR mismatches (i.e. can't read day:undefined during prerendering):
  useEffect(() => {
    const now = new Date();
    setSelectedDay({
      year: now.getFullYear(),
      month: now.getMonth(),
      day: now.getDate(),
    });
  }, []);

  useEffect(() => {
    if (!user || !userDataObj) {
      return;
    }
    setData(userDataObj);
    // Only update if `expectedCycleStartDay` isn't already set locally
    if (!expectedCycleStartDay && userDataObj.metadata?.expectedCycleStartDay) {
      setExpectedCycleStartDay(userDataObj.metadata.expectedCycleStartDay);
    }
  }, [user, userDataObj]);

  // Update targetMonthNotes whenever userDataObj or selectedDay changes
  useEffect(() => {
    if (!selectedDay || !userDataObj) return;

    const { year, month } = selectedDay;
    const monthData = userDataObj.years?.[year]?.[month] || {};

    const notesForMonth = Object.entries(monthData)
      .map(([day, dayData]) => ({
        date: `${year}-${month}-${day}`,
        displayedDate: `${year}-${Number(month) + 1}-${day}`, // month is 0-11, thus needs to + 1
        note: dayData.note,
      }))
      .filter((entry) => entry.note); // Filter out the entry that has note

    setTargetMonthNotes(notesForMonth);
  }, [selectedDay, userDataObj]);

  const { year, month } = selectedDay;
  const displayedMonth = new Date(year, month).toLocaleString("default", {
    month: "long",
  }); // Get month in readable long format, i.e. month 0 is January

  // handle input change for expectedCycleStartDay
  const handleInputChange = (e) => {
    const input = e.target.value;

    // Allow only whole numbers and empty string; *** Ensure input type is "text" not "number", as it won't trigger regex check
    if (!/^\d*$/.test(input)) {
      setErr("Please enter a valid whole number.");
      return;
    }

    // Convert input to a number for range validation, and allow empty string for deletion
    const numberInput = input ? Number(input) : "";

    // Validate range if the input is not empty
    if (numberInput !== "" && (numberInput < 1 || numberInput > 31)) {
      setErr("Please enter a number between 1 and 31.");
      return;
    }

    setErr(""); // Clear error
    setExpectedCycleStartDay(numberInput);
  };

  const saveExpectedCycleStartDay = async () => {
    setLoading(true);
    const userRef = doc(db, "users", user.uid);
    try {
      await updateDoc(userRef, {
        "metadata.expectedCycleStartDay": expectedCycleStartDay,
      });
      // Update global context userDataObj
      setUserDataObj((prevUserData) => ({
        ...prevUserData,
        metadata: {
          ...prevUserData.metadata,
          expectedCycleStartDay,
        },
      }));

      setSuccess("Successfully saved!");
      setTimeout(() => setSuccess(""), 2000);
    } catch (error) {
      console.error("Failed to save cycleStartDay: ", error);
      setErr("Failed to save cycleStartDay, please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Update period and note for the current calendar day both locally and in db
  async function handleSetData(
    updatedValue,
    targetYear,
    targetMonth,
    targetDay
  ) {
    try {
      // Update local data using the utility function
      const newData = updateDayData(
        userDataObj,
        updatedValue,
        targetYear,
        targetMonth,
        targetDay
      );

      // Update local and global state
      setData(newData);
      setUserDataObj(newData);

      // Update Firebase
      const docRef = doc(db, "users", user.uid);
      await setDoc(
        docRef,
        {
          years: {
            [targetYear]: {
              [targetMonth]: {
                [targetDay]: updatedValue,
              },
            },
          },
        },
        { merge: true }
      );
    } catch (err) {
      console.error(`Failed to set data: ${err.message}`);
    }
  }

  // Fetch data for the selected day
  const selectedDayData =
    userDataObj?.years?.[selectedDay?.year]?.[selectedDay?.month]?.[
      selectedDay?.day
    ] || {};
  const { note, period } = selectedDayData; // extract note and period value from selectedDayData

  const togglePeriod = () => {
    const { year, month, day } = selectedDay;
    handleSetData({ period: !selectedDayData.period }, year, month, day);
  };

  const openNoteModal = () => setShowNoteModal(true);

  const closeNoteModal = () => setShowNoteModal(false);

  // Handle save note in NoteModal
  const handleNoteSave = (noteInput) => {
    const { year, month, day } = selectedDay;
    handleSetData({ note: noteInput }, year, month, day);
    closeNoteModal();
  };

  // Handle when click the note icon in Calendar, selectedDatNote will be passed from Calendar to Dashboard
  const handleNoteClick = (selectedDayNote) => {
    setSelectedNote(selectedDayNote);
    setIsNoteVisible(true);
  };

  const toggleNoteVisibility = () => {
    setIsNoteVisible(!isNoteVisible);
  };

  if (loadingAuth || !selectedDay) {
    return <Loading />;
  }

  if (!user) {
    return <Login />;
  }

  return (
    <div className="flex flex-col flex-1 gap-8 sm:gap-12">
      <TooltipMain />

      <div className="flex items-center justify-center flex-wrap gap-4 sm:gap-6">
        {/* Period Button */}
        <ActionButton
          onClick={togglePeriod}
          icon={<i className="fa-solid fa-heart text-pink-400"></i>}
          label={period ? "Remove" : "Add"}
          ariaLabel="period-button"
        />

        {/* Note Button */}
        <ActionButton
          onClick={openNoteModal}
          icon={<i className="fa-solid fa-pen-to-square text-indigo-400"></i>}
          label={note ? "Update Note" : "Add Note"}
          ariaLabel="note-button"
        />
      </div>

      {/* Note Modal */}
      {showNoteModal && (
        <NoteModal
          onSave={handleNoteSave}
          onClose={() => setShowNoteModal(false)}
          initialNote={selectedDayData?.note || ""}
        />
      )}
      {/* Display note when user clicks the note emoji in calendar */}
      {selectedNote && isNoteVisible && (
        <div className="relative flex flex-col ring-2 ring-pink-300 bg-indigo-50 text-stone-700 p-4 gap-4 rounded-lg">
          <p>{selectedNote}</p>
          <div className="flex justify-end mt-auto">
            <Button clickHandler={toggleNoteVisibility} text="Close" dark />
          </div>
        </div>
      )}

      <Calendar
        completeData={data?.years}
        onNoteClick={handleNoteClick}
        onDayClick={setSelectedDay} // Pass selected day handler
        selectedDay={selectedDay} // Pass selected day state
      />

      {/* Review Notes for the selected month section*/}
      <div className="flex flex-col gap-2">
        <TooltipForReviewNotes />
        <h3 className="font-bold text-base sm:text-lg ">
          <i className="fa-regular fa-note-sticky mr-2"></i>
          {displayedMonth} Notes
        </h3>
        <ReviewNotes user={user} targetMonthNotes={targetMonthNotes} />
      </div>

      {/* Cycle Pattern Section */}
      <div className="flex flex-col gap-2">
        <h3 className="font-bold text-base sm:text-lg ">
          <i className="fa-solid fa-chart-line mr-2"></i>Cycle Pattern
        </h3>

        <div className="w-full p-4 bg-indigo-200 rounded-lg flex flex-col gap-6 items-center">
          {/* ExpectedCycleStartDay input field */}
          <div className="flex flex-col gap-2 p-2 bg-indigo-400 rounded-lg w-[280px] items-center">
            <h4 className="font-semibold text-white">
              Set Expected Cycle Start Day
            </h4>
            <div className="relative w-[160px]">
              <input
                type="text"
                value={expectedCycleStartDay}
                onChange={handleInputChange}
                className="w-full px-3 duration-200 hover:border-indigo-400 py-1 sm:py-2 border border-solid focus:border-pink-400 focus:outline focus:outline-pink-200 rounded-full text-black"
                aria-label="expected cycle start day"
              />

              <button
                onClick={saveExpectedCycleStartDay}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-indigo-400 font-bold"
                aria-label="save cycle start day button"
              >
                {expectedCycleStartDay ? "Update" : "Save"}
              </button>
            </div>
            
            <div>
            {loading && <Loading />}
            {err && <p className="text-sm text-red-200">{err}</p>}
            {success && <p className="text-sm text-emerald-200">{success}</p>}
            </div>
            
          </div>

          <TooltipDeviationChart />

          {/* Deviation line chart for cycle start day */}
          <DeviationLineChart />
        </div>
      </div>
    </div>
  );
}
