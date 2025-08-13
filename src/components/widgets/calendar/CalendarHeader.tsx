"use client";

import React from "react";
import Button3D from "../../common/3DButton";

interface CalendarHeaderProps {
  currentDate: Date;
  viewMode: "month" | "week" | "day";
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
  onViewModeChange: (mode: "month" | "week" | "day") => void;
}

export default function CalendarHeader({
  currentDate,
  viewMode,
  onPrevious,
  onNext,
  onToday,
  onViewModeChange,
}: CalendarHeaderProps) {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const formatDate = (date: Date) => {
    return `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
  };

  return (
    <div className="flex items-center justify-between mb-2">
      {/* Navigation */}
      <div className="flex items-center gap-1">
        <Button3D
          onClick={onPrevious}
          style={{
            padding: "0.125rem 0.25rem",
            minWidth: "auto",
            minHeight: "auto",
            fontSize: "0.625rem",
          }}
        >
          ‹
        </Button3D>
        <Button3D
          onClick={onNext}
          style={{
            padding: "0.125rem 0.25rem",
            minWidth: "auto",
            minHeight: "auto",
            fontSize: "0.625rem",
          }}
        >
          ›
        </Button3D>
        <Button3D
          onClick={onToday}
          style={{
            padding: "0.125rem 0.25rem",
            minWidth: "auto",
            minHeight: "auto",
            fontSize: "0.625rem",
          }}
        >
          Today
        </Button3D>
      </div>

      {/* Month/Year Display */}
      <div className="text-center">
        <h3 className="text-sm font-bold calendar-header">
          {formatDate(currentDate)}
        </h3>
      </div>

      {/* View Mode Toggle */}
      <div className="flex items-center gap-1">
        {(["month", "week", "day"] as const).map((mode) => (
          <Button3D
            key={mode}
            selected={viewMode === mode}
            onClick={() => onViewModeChange(mode)}
            style={{
              padding: "0.125rem 0.25rem",
              minWidth: "auto",
              minHeight: "auto",
              fontSize: "0.625rem",
            }}
          >
            {mode.charAt(0).toUpperCase() + mode.slice(1)}
          </Button3D>
        ))}
      </div>
    </div>
  );
}
