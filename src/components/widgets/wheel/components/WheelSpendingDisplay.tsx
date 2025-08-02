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
      <div className="text-sm text-[#888] mb-1">{title}</div>
      <div className="text-2xl font-bold text-[#232323] font-mono">
        {totalSpending}
      </div>
    </div>
  );
}
