"use client";

import React, { useEffect, useState } from "react";
import Calendar from "./Calendar";
import { useAuth } from "@/contexts/AuthContext";
import { doc, setDoc } from "firebase/firestore";
import Loading from "../sharedUI/Loading";
import Login from "../core/Login";
import { db } from "@/firebase";
import NoteModal from "./NoteModal";
import Button from "../sharedUI/Button";
import ActionButton from "./ActionButton";

export default function Dashboard() {
  const { user, userDataObj, setUserDataObj, loading } = useAuth();
  const [data, setData] = useState({});
  const [showNoteModal, setShowNoteModal] = useState(false); // state to show/hide NoteModal
  const [selectedNote, setSelectedNote] = useState(null);
  const [isNoteVisible, setIsNoteVisible] = useState(false); // state to show/hide note when user clicks the note emoji in Calendar

  const now = new Date();

  const [selectedDay, setSelectedDay] = useState({
    year: now.getFullYear(),
    month: now.getMonth(),
    day: now.getDate(),
  }); // state for selected day, initial state is year, month and day from now

  useEffect(() => {
    if (!user || !userDataObj) {
      return;
    }
    setData(userDataObj);
  }, [user, userDataObj]);

  // Update period and note for the current calendar day both locally and in db
  async function handleSetData(
    updatedValue,
    targetYear,
    targetMonth,
    targetDay
  ) {
    console.log("TargetDay: ", targetDay);
    try {
      const newData = { ...userDataObj }; // create a copy of userDataObj

      // Ensure year and month are at least {} to assign updated day data with
      if (!newData?.[targetYear]) {
        newData[targetYear] = {};
      }
      if (!newData?.[targetYear]?.[targetMonth]) {
        newData[targetYear][targetMonth] = {};
      }

      const existingDayData =
        newData?.[targetYear]?.[targetMonth]?.[targetDay] || {};
      newData[targetYear][targetMonth][targetDay] = {
        ...existingDayData,
        ...updatedValue,
      }; // updatedValue is an Obj, thus need to spread to merge with the existingDayData correctly at the same level, without ..., it will add an nested obj inside the day's data.

      // update the local state
      setData(newData);
      // update the global state
      setUserDataObj(newData);
      // update firebase
      const docRef = doc(db, "users", user.uid);
      await setDoc(
        docRef,
        {
          [targetYear]: {
            [targetMonth]: {
              [targetDay]: updatedValue,
            },
          },
        },
        { merge: true }
      );
      console.log(" data saved successfully!");
    } catch (err) {
      console.error(`Failed to set data: ${err.message}`);
    }
  }

  // Fetch data for the selected day
  const selectedDayData =
    userDataObj?.[selectedDay?.year]?.[selectedDay?.month]?.[
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

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    return <Login />;
  }

  return (
    <div className="flex flex-col flex-1 gap-8 sm:gap-12 md:gap-16">
      <div className="flex items-center flex-wrap gap-8">
        {/* Period Button */}
        <ActionButton
          onClick={togglePeriod}
          icon={<i className="fa-solid fa-heart text-pink-400"></i>}
          label={period ? "Remove" : "Add"}
        />

        {/* Note Button */}
        <ActionButton
          onClick={openNoteModal}
          icon={<i className="fa-solid fa-pen-to-square text-stone-400"></i>}
          label={note ? "Update Note" : "Add Note"}
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
        completeData={data}
        onNoteClick={handleNoteClick}
        onDayClick={setSelectedDay} // Pass selected day handler
        selectedDay={selectedDay} // Pass selected day state
      />
    </div>
  );
}
