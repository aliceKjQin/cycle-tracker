"use client";

import { Roboto } from "next/font/google";
import React, { useState } from "react";
import Button from "@/components/sharedUI/Button";
import { validateNoteInput } from "@/utils";

const roboto = Roboto({ subsets: ["latin"], weight: ["700"] });

export default function NoteModal({ onSave, onClose, initialNote }) {
  const [noteInputValue, setNoteInputValue] = useState(initialNote);
  const [error, setError] = useState("");

  const handleNoteChange = (e) => {
    const input = e.target.value;
    setNoteInputValue(input);

    const { valid, message } = validateNoteInput(input);
    if (valid) {
      setError("");
    } else {
      setError(message);
    }
  };

  const handleSubmit = () => {
    // Check if any error before submission
    if (error) {
      setError(error);
      return; // Stop submission if error exists
    }
    onSave(noteInputValue); // Call onSave with the valid input
  };

  return (
    <div className="relative flex flex-col bg-indigo-100 text-stone-700 p-4 gap-4 rounded-lg">
      <h2 className={`${roboto.className}`}>
        ✏️ {initialNote ? "Update" : "Add"} Note{" "}
      </h2>
      {error && <p className="text-red-500">{error}</p>}
      <textarea
        value={noteInputValue}
        onChange={handleNoteChange}
        placeholder="Type any observation on your cycle day ..."
        className="bg-indigo-50 border-2 border-pink-200 p-2 rounded-md focus:outline-none focus:ring-1 focus:ring-pink-300"
        rows={8}
        autoFocus
      />
      <div className="flex gap-4 mx-auto max-w-[400px]">
        <Button
          clickHandler={handleSubmit}
          text={initialNote ? "Update" : "Save"}
          full
          dark
        />
        <Button clickHandler={onClose} text="Cancel" full dark />
      </div>
    </div>
  );
}
