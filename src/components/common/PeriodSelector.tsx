import React from "react";
import { TimePeriod } from "@/interfaces/widgets";

interface PeriodSelectorProps {
  selectedPeriod: TimePeriod;
  onPeriodChange: (period: TimePeriod) => void;
  periods?: TimePeriod[];
  className?: string;
}

export default function PeriodSelector({
  selectedPeriod,
  onPeriodChange,
  periods = ["Monthly", "Annual"],
  className = "",
}: PeriodSelectorProps) {
  return (
    <div className={`flex gap-2 ${className}`}>
      {periods.map((period) => (
        <button
          key={period}
          onClick={(e) => {
            e.stopPropagation();
            onPeriodChange(period);
          }}
          className={`text-xs font-medium transition-colors px-2 py-1 rounded`}
          style={{
            fontFamily: "var(--font-sans)",
            color:
              selectedPeriod === period
                ? "var(--primary-text)"
                : "var(--secondary-text)",
            backgroundColor:
              selectedPeriod === period
                ? "var(--button-hover-bg)"
                : "transparent",
          }}
        >
          {period}
        </button>
      ))}
    </div>
  );
}
