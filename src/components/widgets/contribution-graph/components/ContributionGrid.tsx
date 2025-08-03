import React from "react";
import { ContributionData } from "../../../../../interfaces/charts";

interface ContributionGridProps {
  weeks: ContributionData[][];
  monthPositions: { month: string; x: number }[];
  getColorForValue: (value: number) => string;
  colors: {
    secondary: string;
  };
  onDayClick?: (date: string, value: number) => void;
  selectedDate?: string;
}

export default function ContributionGrid({
  weeks,
  monthPositions,
  getColorForValue,
  colors,
}: ContributionGridProps) {
  return (
    <div className="relative">
      <div className="flex mb-4" style={{ marginLeft: "24px" }}>
        {monthPositions.map((pos, index) => (
          <div
            key={index}
            className="text-xs font-medium"
            style={{
              position: "absolute",
              left: `${pos.x}px`,
              transform: "translateX(-50%)",
              width: "56px",
              textAlign: "center",
              color: colors.secondary,
              fontFamily: "var(--font-sans)",
              letterSpacing: "0.01em",
            }}
          >
            {pos.month}
          </div>
        ))}
      </div>

      <div className="flex">
        <div
          className="flex flex-col justify-between mr-2 text-xs font-medium"
          style={{
            height: "96px",
            color: colors.secondary,
            fontFamily: "var(--font-sans)",
            letterSpacing: "0.01em",
          }}
        >
          <span>Mon</span>
          <span>Wed</span>
          <span>Fri</span>
        </div>

        <div className="flex gap-1">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-1">
              {week.map((day, dayIndex) => (
                <div
                  key={dayIndex}
                  className="w-3 h-3 rounded-sm"
                  style={{
                    backgroundColor: getColorForValue(day.value),
                    border: `1px solid ${getColorForValue(day.value)}`,
                    cursor: "pointer",
                  }}
                  title={`${day.date}: Activity level ${day.value}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
