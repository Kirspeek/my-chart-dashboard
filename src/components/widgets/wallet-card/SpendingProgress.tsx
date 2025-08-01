import React from "react";

interface SpendingProgressProps {
  selectedIndex: number;
  totalCards: number;
}

export default function SpendingProgress({
  selectedIndex,
  totalCards,
}: SpendingProgressProps) {
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
              i === selectedIndex ? "#232323" : "rgba(35, 35, 35, 0.2)",
          }}
        />
      ))}
    </div>
  );
}
