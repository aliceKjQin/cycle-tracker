import { Roboto } from "next/font/google";
import React from "react";

const roboto = Roboto({ subsets: ["latin"], weight: ["700"] });

export default function Button(props) {
  const { text, dark, full, clickHandler, ariaLabel } = props;
  return (
    <button
      onClick={clickHandler}
      className={`rounded-full overflow-hidden duration-200 hover:opacity-60 border-2 border-solid border-pink-400 ${
        dark ? "text-white bg-pink-400" : "text-pink-400"
      } ${full ? "grid place-items-center w-full" : ""} `}
      aria-label={ariaLabel}
    >
      <p
        className={`px-6 sm:px-10 whitespace-nowrap py-2 sm:py-3 ${roboto.className}`}
      >
        {text}
      </p>
    </button>
  );
}
