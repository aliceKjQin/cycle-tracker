import { updateDayData } from "@/app/dashboard/Dashboard";

describe("updateDayData", () => {
    it("should update day data with the updatedValue passed in", () => {
      const userDataObj = {
        years: {
          2023: {
            December: {
              10: { note: "Old Note", period: true },
            },
          },
        },
      };
  
      const updatedValue = { period: false };
      const result = updateDayData(userDataObj, updatedValue, 2023, "December", 10);
  
      // Expect period is updated to false, other existing day data remains the same
      expect(result.years[2023].December[10]).toEqual({
        note: "Old Note",
        period: false,
      });
    });
  
    it("should handle empty data structures without running into err, when there is no existing day data", () => {
      const userDataObj = {};
      const updatedValue = { period: true };
      const result = updateDayData(userDataObj, updatedValue, 2024, "January", 20);
  
      expect(result.years[2024].January[20]).toEqual({ period: true });
    });
  });