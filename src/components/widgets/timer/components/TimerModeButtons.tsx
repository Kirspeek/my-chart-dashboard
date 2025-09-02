"use client";

import React from "react";
import type { TimerMode } from "../../../../../interfaces/widgets";

export default function TimerModeButtons({
  modes,
  selectedMode,
  startIndex = 0,
  count,
  isMobile,
  onSelect,
  onReset,
}: {
  modes: TimerMode[];
  selectedMode: number;
  startIndex?: number;
  count: number;
  isMobile: boolean;
  onSelect: (index: number) => void;
  onReset: () => void;
}) {
  const slice = modes.slice(startIndex, startIndex + count);

  return (
    <div
      className={`flex gap-1 justify-center ${isMobile ? "flex-wrap" : "flex-col"}`}
    >
      {slice.map((mode, idx) => {
        const index = startIndex + idx;
        const isSelected = selectedMode === index;
        return (
          <button
            key={mode.id}
            onClick={() => {
              onSelect(index);
              onReset();
            }}
            className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-all duration-200 hover:scale-105 ${
              isSelected ? "scale-105" : ""
            }`}
            style={{
              background: isSelected ? mode.color + "20" : "var(--button-bg)",
              border: `1px solid ${isSelected ? mode.color : "var(--button-border)"}`,
              color: isSelected ? mode.color : "var(--secondary-text)",
            }}
          >
            <mode.icon className="w-3 h-3" />
            <span>{mode.name}</span>
          </button>
        );
      })}
    </div>
  );
}

