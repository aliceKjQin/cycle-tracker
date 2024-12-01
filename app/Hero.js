"use client";

import { Roboto } from "next/font/google";
import { useEffect, useState } from "react";
import Calendar from "./dashboard/Calendar";
import CallToAction from "./CallToAction";
import Button from "../components/shared/Button";
import { demoData } from "@/utils";
import ReviewNotes from "@/components/shared/ReviewNotes";
import DeviationLineChart from "./dashboard/DeviationLineChart";

const roboto = Roboto({ subsets: ["latin"], weight: ["700"] });

export default function Hero() {
  const [selectedDay, setSelectedDay] = useState({});
  const [selectedNote, setSelectedNote] = useState(null);
  const [isNoteVisible, setIsNoteVisible] = useState(false); // state to show/hide note when user clicks the note emoji in Calendar
  const [demoMonthNotes, setDemoMonthNotes] = useState([]);

  // initialize selectedDay after the component mounts to avoid SSR mismatches (i.e. can't read day:undefined, during prerendering):
  useEffect(() => {
    const now = new Date();
    setSelectedDay({
      year: now.getFullYear(),
      month: now.getMonth(),
      day: now.getDate(),
    });
  }, []);

  useEffect(() => {
    const { year, month } = selectedDay;

    if (year && month !== undefined) {
      const notesForDemoMonth = Object.entries(demoData)
        .map(([day, dayData]) => ({
          date: `${year}-${month}-${day}`,
          displayedDate: `${year}-${Number(month) + 1}-${day}`, // month is 0-11, thus needs to + 1
          note: dayData.note,
        }))
        .filter((entry) => entry.note); // Filter out the entry that has no note

      setDemoMonthNotes(notesForDemoMonth);
    }
  }, [selectedDay]); // Run only when selectedDay changes

  // Handle when click the note icon in Calendar, selectedDatNote will be passed from Calendar to Dashboard
  const handleNoteClick = (selectedDayNote) => {
    setSelectedNote(selectedDayNote);
    setIsNoteVisible(true);
  };

  return (
    <div className="py-2 md:py-4 flex flex-col gap-6 sm:gap-8">
      <h1
        className={`text-4xl sm:text-5xl md:text-6xl text-center ${roboto.className}`}
      >
        Track your
        <span className="textGradient"> cycle</span>
      </h1>
      <p className="text-lg sm:text-xl md:text-2xl text-center w-full mx-auto max-w-[600px]">
        with <strong>data visualization</strong> and <strong>notes</strong> in
        one place
      </p>

      <CallToAction />

      {/* Display note when user clicks the note emoji in calendar */}
      {selectedNote && isNoteVisible && (
        <div className="relative flex flex-col ring-2 ring-pink-300 bg-indigo-50 text-stone-700 p-4 gap-4 rounded-lg">
          <p>{selectedNote}</p>
          <div className="flex justify-end mt-auto">
            <Button
              clickHandler={() => setIsNoteVisible(!isNoteVisible)}
              text="Close"
              dark
            />
          </div>
        </div>
      )}

      <Calendar
        demo
        onNoteClick={handleNoteClick}
        selectedDay={selectedDay}
        onDayClick={setSelectedDay}
      />

      <ReviewNotes targetMonthNotes={demoMonthNotes} isDemo />

      <DeviationLineChart isDemo />
    </div>
  );
}
