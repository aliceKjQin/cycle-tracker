"use client";

import { useTheme } from "@/contexts/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button onClick={toggleTheme}>
      { theme === "light" ? <i className="fa-solid fa-cloud fa-lg text-indigo-400"></i> : <i className="fa-solid fa-cloud fa-lg text-white"></i>}
    </button>
  );
}
