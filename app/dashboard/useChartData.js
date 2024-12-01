"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";

export default function useChartData() {
  const [deviations, setDeviations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userDataObj } = useAuth();

  useEffect(() => {
    // Fetch recent 12 months data for line chart
    const fetchChartData = async () => {
      if (!userDataObj) return;

      try {
        const yearsData = userDataObj.years;
        console.log("Years data: ", yearsData);

        // Get the current month and year
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth(); // Current month (0-11)
        const currentYear = currentDate.getFullYear(); // Current year (yyyy)

        // Use a temporary array to store deviations
        const tempDeviations = [];

        Object.entries(yearsData).forEach(([year, months]) => {
          Object.entries(months).forEach(([month, days]) => {
            const cycleStartDay = Object.keys(days)
              .map(Number) // Convert day string to number so it can be calculated for deviation later
              .find((day) => days[day]?.period);

            if (cycleStartDay !== undefined) {
              // Check if the current month is within the last 12 months
              const monthDifference =
                currentYear * 12 +
                currentMonth -
                (parseInt(year) * 12 + parseInt(month));

              if (monthDifference < 12 && monthDifference >= 0) {
                tempDeviations.push({
                  month: new Date(year, month).toLocaleString("default", {
                    month: "long",
                  }),
                  deviation:
                    cycleStartDay - userDataObj.metadata?.expectedCycleStartDay,
                });
              }
            }
          });
        });
        setDeviations(tempDeviations);
      } catch (error) {
        console.error("Failed to fetch chart data: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, [userDataObj]);

  return { deviations, loading };
}
