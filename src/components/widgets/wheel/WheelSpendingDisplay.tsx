import React from "react";
import SpendingTrend from "../../common/SpendingTrend";

interface WheelSpendingDisplayProps {
  title: string;
  totalSpending: string;
  trend?: { direction: "up" | "down"; percentage: number };
}

export default function WheelSpendingDisplay({
  title,
  totalSpending,
  trend,
}: WheelSpendingDisplayProps) {
  return (
    <div className="text-center mb-3">
      <div className="text-sm secondary-text mb-1">{title}</div>
      <div className="text-2xl font-bold primary-text font-mono">
        {totalSpending}
      </div>
      {trend && (
        <SpendingTrend
          direction={trend.direction}
          percentage={trend.percentage}
          className="mt-2"
        />
      )}
    </div>
  );
}
