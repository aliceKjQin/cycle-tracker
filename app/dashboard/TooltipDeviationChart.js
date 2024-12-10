import React, { useState } from "react";

export default function TooltipDeviationChart() {
  const [showTooltip, setShowTooltip] = useState(false);

  // For mobile, tap to toggle
  const handleTooltipToggle = () => {
    setShowTooltip(!showTooltip);
  };

  return (
    <>
      {/* info icon with tooltip */}
      <div
        aria-label="tooltip-for-review-notes"
        className="relative flex flex-col items-center sm:text-xl mt-6"
        onClick={handleTooltipToggle}
      >
        <i
          className="fa-solid fa-circle-info cursor-pointer textGradient"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        ></i>

        {/* Tooltip content */}
        {showTooltip && (
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 p-2 w-[300px] bg-yellow-100 ring-2 ring-pink-300 text-xs rounded shadow-lg z-10">
            <p>
              <strong>Deviation</strong> = Actual Start Day - Expected Start day
            </p>
            <p><mark>Deviation &lt; 0</mark>: cycle start early than usual. For example, -2 means start 2 days early </p>
            <p><mark>Deviation &gt; 0</mark>: cycle start late than usual. For example, 2 means start 2 days late</p>
            <p><mark>Deviation = 0</mark>: cycle start right on time.</p>
          </div>
        )}
      </div>
    </>
  );
}
