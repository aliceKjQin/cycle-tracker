import React, { useState } from 'react'

export default function TooltipForReviewNotes() {
  const [showTooltip, setShowTooltip] = useState(false)

  // For mobile, tap to toggle
  const handleTooltipToggle = () => {
    setShowTooltip(!showTooltip)
  }

  return (
    <>
      {/* info icon with tooltip */}
      <div aria-label='tooltip-for-review-notes' className="relative flex flex-col items-center sm:text-xl mt-6" onClick={handleTooltipToggle} > 
          <i
            className="fa-solid fa-circle-info cursor-pointer textGradient"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          ></i>

          {/* Tooltip content */}
          {showTooltip && (
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 p-2 w-80 bg-yellow-100 ring-2 ring-pink-300 text-xs sm:text-sm rounded shadow-lg z-10">
              Click on any day in the calendar to view all available notes for that month.
            </div>
          )}
        </div>
        
    </>
  )
}
