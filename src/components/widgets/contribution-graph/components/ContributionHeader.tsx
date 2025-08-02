import React from "react";

interface ContributionHeaderProps {
  title: string;
  totalYearSpending: number;
  averageDailySpending: number;
  colors: {
    primary: string;
    secondary: string;
  };
}

export default function ContributionHeader({
  title,
  totalYearSpending,
  averageDailySpending,
  colors,
}: ContributionHeaderProps) {
  return (
    <div className="text-center mb-4">
      <h3
        className="text-lg font-semibold mb-2"
        style={{
          color: colors.primary,
          fontFamily: "var(--font-mono)",
          fontWeight: 900,
          letterSpacing: "0.01em",
        }}
      >
        {title}
      </h3>
      <p
        className="text-sm mt-1"
        style={{
          color: colors.secondary,
          fontFamily: "var(--font-sans)",
          opacity: 0.8,
          letterSpacing: "0.01em",
        }}
      >
        Total: ${totalYearSpending.toLocaleString()} | Avg: $
        {averageDailySpending}/day
      </p>
    </div>
  );
}
