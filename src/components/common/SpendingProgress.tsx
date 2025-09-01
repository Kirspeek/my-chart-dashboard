import React from "react";
import { SpendingProgressProps } from "../../../interfaces/widgets";
import { useTheme } from "../../hooks/useTheme";

export default function SpendingProgress({
  selectedIndex,
  totalCards,
}: SpendingProgressProps) {
  const { colorsTheme } = useTheme();
  const spendingProgressColors = colorsTheme.widgets.spendingProgress;
  return (
    <div className="flex justify-center gap-2">
      {Array.from({ length: totalCards }, (_, i) => (
        <div
          key={i}
          className="rounded-full transition-all duration-300"
          style={{
            width: "8px",
            height: "8px",
            backgroundColor:
              i === selectedIndex ? spendingProgressColors.active : spendingProgressColors.inactive,
          }}
        />
      ))}
    </div>
  );
}
