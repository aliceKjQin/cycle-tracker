// Reusable button component for actions like toggling period or adding/updating notes in Dashboard.
import { Roboto } from "next/font/google";
const roboto = Roboto({ subsets: ["latin"], weight: ["700"] });

export default function ActionButton({ onClick, icon, label, ariaLabel }) {
  return (
    <button
      onClick={onClick}
      className={`p-4 px-1 w-32 h-24 sm:w-64 sm:h-32 rounded-2xl purpleShadow duration-200 bg-indigo-100 dark:bg-stone-100 text-center flex flex-col gap-2 items-center justify-center`}
      aria-label={ariaLabel}
    >
      <div className="text-4xl sm:text-6xl ">{icon}</div>
      <p
        className={`text-stone-700 text-sm sm:text-base ${roboto.className}`}
      >
        {label}
      </p>
    </button>
  );
}
