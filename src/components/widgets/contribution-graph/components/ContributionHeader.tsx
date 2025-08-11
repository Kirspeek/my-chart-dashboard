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
}

export default function ContributionHeader({
  title,
  totalYearSpending,
  averageDailySpending,
}: ContributionHeaderProps) {
  // Create subtitle with financial data
  const subtitle = `Total: $${totalYearSpending.toLocaleString()} | Avg: $${averageDailySpending}/day`;

  return (
    <WidgetTitle
      title={title}
      subtitle={subtitle}
      variant="centered"
      size="md"
      className="ml-4"
    />
  );
}
