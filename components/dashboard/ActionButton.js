// Reusable button component for actions like toggling period or adding/updating notes in Dashboard.
import { Roboto } from "next/font/google";
const roboto = Roboto({ subsets: ["latin"], weight: ["700"] });

export default function ActionButton({ onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`p-4 px-1 rounded-2xl purpleShadow duration-200 bg-indigo-100 dark:bg-stone-100 text-center flex flex-col gap-2 flex-1 items-center`}
    >
      <div className="text-4xl sm:text-5xl md:text-6xl">{icon}</div>
      <p
        className={`text-stone-700 text-xs sm:text-sm md:text-base ${roboto.className}`}
      >
        {label}
      </p>
    </button>
  );
}
