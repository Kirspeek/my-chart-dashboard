import React from "react";
import { ContributionData } from "@/interfaces";

interface ContributionGridProps {
  weeks: ContributionData[][];
  monthPositions: { month: string; x: number }[];
  getColorForValue: (value: number) => string;
  colors: {
    primary: string;
    secondary: string;
    muted: string;
    cardBackground: string;
    borderSecondary: string;
    accent: {
      blue: string;
      yellow: string;
      red: string;
      teal: string;
    };
  };
  isMobile?: boolean;
  onDayClick?: (day: { date: string; value: number }) => void;
  selectedDay?: { date: string; value: number } | null;
}

export default function ContributionGrid({
  weeks,
  monthPositions,
  getColorForValue,
  colors,
  isMobile = false,
}: ContributionGridProps) {
  if (isMobile) {
    // Mobile layout: horizontal scrollable arrangement with months on the right
    return (
      <div className="relative">
        {/* Horizontal scrollable grid layout */}
        <div
          className="flex gap-1 px-4 overflow-x-auto mobile-scroll justify-center"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {monthPositions.map((pos, monthIndex) => {
            // Get weeks for this month (approximately 4-5 weeks per month)
            const startWeek = monthIndex * 4;
            const endWeek = Math.min(startWeek + 4, weeks.length);
            const monthWeeks = weeks.slice(startWeek, endWeek);

            return (
              <div key={monthIndex} className="flex flex-col items-center">
                {/* Month name at the top */}
                <div
                  className="text-xs font-medium text-center mb-0.1"
                  style={{
                    color: colors.secondary,
                    fontSize: isMobile ? "0.5rem" : "",
                    fontFamily: "var(--font-sans)",
                    letterSpacing: "0.01em",
                    writingMode: "vertical-rl",
                    textOrientation: "mixed",
                    transform: "rotate(180deg)",
                    height: "40px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {pos.month}
                </div>

                {/* Vertical grid for this month */}
                <div className="flex flex-col gap-1">
                  {monthWeeks.map((week, weekIndex) => (
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
            );
          })}
        </div>
      </div>
    );
  }

  // Desktop layout: original horizontal arrangement
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
          className="flex flex-col justify-between mr-4 text-xs font-medium"
          style={{
            height: "96px",
            color: colors.secondary,
            fontFamily: "var(--font-sans)",
            letterSpacing: "0.01em",
            minWidth: "32px",
            paddingLeft: "8px",
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
