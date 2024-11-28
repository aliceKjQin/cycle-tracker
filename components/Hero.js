import { Roboto } from "next/font/google";
import React from "react";
import Calendar from "./dashboard/Calendar";
import CallToAction from "./CallToAction";

const roboto = Roboto({ subsets: ["latin"], weight: ["700"] });

export default function Hero() {
  return (
    <div className="py-4 md:py-10 flex flex-col gap-8 sm:gap-10">
      <h1
        className={`text-5xl sm:text-6xl md:text-7xl text-center ${roboto.className}`}
      >
        <span className="textGradient">bYou</span> helps you track{" "}
        <span className="textGradient">cycle & mood</span> !
      </h1>
      <p className="text-lg sm:text-xl md:text-2xl text-center w-full mx-auto max-w-[600px]">
        Track your pattern and be more productive{" "}
        <span className="font-semibold">the self-care way</span>
      </p>
      <CallToAction />
      <Calendar demo />
    </div>
  );
}

// w-fit: It makes the width of the container just large enough to fit its content, preventing it from stretching to full width.
