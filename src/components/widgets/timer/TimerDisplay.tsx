"use client";

import React from "react";

export default function TimerDisplay({
  isMobile,
  isComplete,
  color,
  timeText,
  name,
}: {
  isMobile: boolean;
  isComplete: boolean;
  color: string;
  timeText: string;
  name: string;
}) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
      <div
        className={`font-mono font-bold mb-0.5 ${isMobile ? "text-4xl" : "text-2xl"}`}
        style={{ color: isComplete ? color : "var(--primary-text)" }}
      >
        {timeText}
      </div>
      <div className="text-sm font-medium" style={{ color }}>
        {name}
      </div>
    </div>
  );
}

