"use client";

import { useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { useAuth } from "@/contexts/AuthContext";

export const useNote = (userId) => {
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const { userDataObj, setUserDataObj } = useAuth();

  const deleteNote = async (noteDate) => {
    if (!userId || !noteDate) return;

    try {
      const [year, month, day] = noteDate.split("-");

      const userRef = doc(db, "users", userId);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();

        // Locate the specific date's note and remove the note from the dayData
        const updatedDayData = { ...userData.years?.[year]?.[month]?.[day] };

        delete updatedDayData.note; // Remove the note

        // Update userData in db
        await updateDoc(userRef, {
          [`years.${year}.${month}.${day}`]: updatedDayData,
        });

        // Update global context `userDataObj` to remove the note
        const updatedUserData = { ...userDataObj };
        if (
          updatedUserData.years?.[year] &&
          updatedUserData.years?.[year]?.[month] &&
          updatedUserData.years?.[year]?.[month]?.[day]
        ) {
          delete updatedUserData.years[year][month][day].note;
        }
        setUserDataObj(updatedUserData);

        setSuccess("Deleted note.");
        setTimeout(() => setSuccess(""), 2000);
      }
    } catch (error) {
      console.error("Error deleting note:", error);
      setError("Failed to delete note, please try again.");
    } finally {
      setLoading(false);
    }
  };

  return { deleteNote, loading, success, error };
};
