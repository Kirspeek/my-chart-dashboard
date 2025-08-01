import React from "react";

interface ExpenseData {
  name: string;
  value: number;
  color: string;
  percentage: number;
}

interface BottomSegmentInfoProps {
  segment: ExpenseData | null;
}

export default function BottomSegmentInfo({ segment }: BottomSegmentInfoProps) {
  if (!segment) return null;

  return (
    <div className="mb-2 flex items-center justify-center">
      <div className="flex items-center gap-2">
        <div
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: segment.color }}
        />
        <span className="text-[#232323] text-sm font-medium">
          {segment.name} {segment.percentage}%
        </span>
      </div>
    </div>
  );
}
