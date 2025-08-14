import React from "react";
import { WidgetTitle } from "../../../common";

interface ContributionHeaderProps {
  title: string;
  totalYearSpending: number;
  averageDailySpending: number;
  colors: {
    primary: string;
    secondary: string;
  };
  isRealTime?: boolean;
  setIsRealTime?: (value: boolean) => void;
}

export default function ContributionHeader({
  title,
  totalYearSpending,
  averageDailySpending,
  isRealTime = true,
  setIsRealTime,
}: ContributionHeaderProps) {
  // Create subtitle with financial data
  const subtitle = `Total: $${totalYearSpending.toLocaleString()} | Avg: $${averageDailySpending}/day`;

  return (
    <div className="flex items-center justify-between mb-4">
      <WidgetTitle
        title={title}
        subtitle={subtitle}
        variant="centered"
        size="md"
        className="ml-4"
      />

      {/* Real-time indicator */}
      {setIsRealTime && (
        <div
          className="flex items-center space-x-2 px-3 py-1.5 rounded-full"
          style={{
            background: "linear-gradient(135deg, #FFE9EF 0%, #FFC9D7 100%)",
            border: "2px solid #FC809F",
            boxShadow: "0 2px 8px rgba(252, 128, 159, 0.15)",
          }}
        >
          <div className="flex items-center space-x-2">
            <div className="relative">
              <div
                className="w-2.5 h-2.5 rounded-full animate-pulse"
                style={{ background: "#FC809F" }}
              />
              <div
                className="absolute inset-0 w-2.5 h-2.5 rounded-full animate-ping"
                style={{
                  background: "#FC809F",
                  opacity: 0.3,
                }}
              />
            </div>
            <span
              className="text-xs font-bold"
              style={{
                color: "#FC809F",
                fontFamily: "var(--font-mono)",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
              }}
            >
              Live
            </span>
          </div>
          <div
            className="w-px h-3 mx-1.5"
            style={{ background: "#FC809F", opacity: 0.3 }}
          />
          <button
            onClick={() => setIsRealTime(!isRealTime)}
            className="text-xs px-2 py-0.5 rounded-full transition-all duration-200 font-bold"
            style={{
              background: isRealTime ? "#FC809F" : "transparent",
              color: isRealTime ? "white" : "#FC809F",
              border: `1px solid ${isRealTime ? "#FC809F" : "#FC809F"}`,
              fontFamily: "var(--font-mono)",
              fontWeight: 700,
            }}
          >
            {isRealTime ? "Pause" : "Resume"}
          </button>
        </div>
      )}
    </div>
  );
}
