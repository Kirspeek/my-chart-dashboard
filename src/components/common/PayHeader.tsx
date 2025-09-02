"use client";

import React from "react";

type TimePeriod = "Monthly" | "Annual";

interface PayHeaderProps {
  isMobile?: boolean;
  compact?: boolean;
  className?: string;
  leftTitle: React.ReactNode;
  leftIcons?: React.ReactNode;
  leftButtons?: React.ReactNode;
  rightIcons?: React.ReactNode;
  selectedPeriod?: TimePeriod;
  setSelectedPeriod?: (p: TimePeriod) => void;
}

export default function PayHeader({
  isMobile = false,
  compact = false,
  className = "",
  leftTitle,
  leftIcons,
  leftButtons,
  rightIcons,
  selectedPeriod,
  setSelectedPeriod,
}: PayHeaderProps) {
  return (
    <div
      className={`flex items-center justify-between ${className}`}
      style={{
        marginTop: compact
          ? isMobile
            ? "0.75rem"
            : "0.5rem"
          : isMobile
            ? "2rem"
            : undefined,
        marginBottom: compact
          ? isMobile
            ? "0.75rem"
            : "0.5rem"
          : isMobile
            ? "1.5rem"
            : undefined,
      }}
    >
      <div className="flex items-center space-x-3">
        {leftIcons && (
          <div className="flex items-center gap-2">{leftIcons}</div>
        )}
        <div
          className="primary-text font-mono text-xs sm:text-sm"
          style={{ letterSpacing: "0.08em", opacity: 0.9 }}
        >
          {leftTitle}
        </div>
        {leftButtons && <div className="flex gap-1">{leftButtons}</div>}
      </div>

      {(rightIcons || (selectedPeriod && setSelectedPeriod)) && (
        <div className="flex items-center gap-2">
          {rightIcons}
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (setSelectedPeriod) {
                setSelectedPeriod("Monthly");
              }
            }}
            className={`text-xs font-medium transition-colors px-2 py-1 rounded`}
            style={{
              backgroundColor:
                selectedPeriod === "Monthly"
                  ? "var(--button-hover-bg)"
                  : "transparent",
              color:
                selectedPeriod === "Monthly"
                  ? "var(--primary-text)"
                  : "var(--secondary-text)",
            }}
          >
            Monthly
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (setSelectedPeriod) {
                setSelectedPeriod("Annual");
              }
            }}
            className={`text-xs font-medium transition-colors px-2 py-1 rounded`}
            style={{
              backgroundColor:
                selectedPeriod === "Annual"
                  ? "var(--button-hover-bg)"
                  : "transparent",
              color:
                selectedPeriod === "Annual"
                  ? "var(--primary-text)"
                  : "var(--secondary-text)",
            }}
          >
            Annual
          </button>
        </div>
      )}
    </div>
  );
}
