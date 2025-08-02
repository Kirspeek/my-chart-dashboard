import React from "react";
import { TimePeriod } from "../../../../../interfaces/widgets";

interface WheelHeaderProps {
  showCardNumber: boolean;
  cardNumber?: string;
  selectedPeriod: TimePeriod;
  onPeriodChange: (period: TimePeriod) => void;
}

export default function WheelHeader({
  showCardNumber,
  cardNumber,
  selectedPeriod,
  onPeriodChange,
}: WheelHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-2">
      <div className="text-[#232323] text-lg font-mono">
        {showCardNumber ? cardNumber || "**** ****" : "All Cards"}
      </div>
      <div className="flex gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPeriodChange("Monthly");
          }}
          className={`text-xs font-medium transition-colors px-2 py-1 rounded`}
          style={{
            fontFamily: "var(--font-sans)",
            color: selectedPeriod === "Monthly" ? "#232323" : "#888",
            backgroundColor:
              selectedPeriod === "Monthly" ? "rgba(0,0,0,0.05)" : "transparent",
          }}
        >
          Monthly
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPeriodChange("Annual");
          }}
          className={`text-xs font-medium transition-colors px-2 py-1 rounded`}
          style={{
            fontFamily: "var(--font-sans)",
            color: selectedPeriod === "Annual" ? "#232323" : "#888",
            backgroundColor:
              selectedPeriod === "Annual" ? "rgba(0,0,0,0.05)" : "transparent",
          }}
        >
          Annual
        </button>
      </div>
    </div>
  );
}
