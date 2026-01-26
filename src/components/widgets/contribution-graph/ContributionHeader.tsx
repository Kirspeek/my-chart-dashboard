import React from "react";
import { WidgetTitle } from "../../common";
import { useTheme } from "../../../hooks/useTheme";
import { ContributionHeaderProps } from "@/interfaces/charts";

export default function ContributionHeader({
  title,
  totalYearSpending,
  averageDailySpending,
  isRealTime = true,
  setIsRealTime,
}: ContributionHeaderProps) {
  const { colorsTheme } = useTheme();
  const contributionGraphColors = colorsTheme.widgets.contributionGraph;

  // Create subtitle with financial data
  const subtitle = `Total: $${totalYearSpending.toLocaleString()} | Avg: $${averageDailySpending}/day`;

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between sm:gap-0 mb-4">
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
            background: contributionGraphColors.header.background,
            border: `2px solid ${contributionGraphColors.header.border}`,
            boxShadow: contributionGraphColors.header.shadow,
          }}
        >
          <div className="flex items-center space-x-2">
            <div className="relative">
              <div
                className="w-2.5 h-2.5 rounded-full animate-pulse"
                style={{ background: contributionGraphColors.header.text }}
              />
              <div
                className="absolute inset-0 w-2.5 h-2.5 rounded-full animate-ping"
                style={{
                  background: contributionGraphColors.header.text,
                  opacity: 0.3,
                }}
              />
            </div>
            <span
              className="text-xs font-bold"
              style={{
                color: contributionGraphColors.header.text,
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
            style={{
              background: contributionGraphColors.header.text,
              opacity: 0.3,
            }}
          />
          <button
            onClick={() => setIsRealTime(!isRealTime)}
            className="text-xs px-2 py-0.5 rounded-full transition-all duration-200 font-bold"
            style={{
              background: isRealTime
                ? contributionGraphColors.header.buttonBackground
                : "transparent",
              color: isRealTime
                ? contributionGraphColors.header.buttonText
                : contributionGraphColors.header.text,
              border: `1px solid ${contributionGraphColors.header.buttonBorder}`,
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
