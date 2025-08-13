import React from "react";

interface WheelSpendingDisplayProps {
  title: string;
  totalSpending: string;
}

export default function WheelSpendingDisplay({
  title,
  totalSpending,
}: WheelSpendingDisplayProps) {
  return (
    <div className="text-center mb-2">
      <div className="text-sm secondary-text mb-1">{title}</div>
      <div className="text-2xl font-bold primary-text font-mono">
        {totalSpending}
      </div>
    </div>
  );
}
