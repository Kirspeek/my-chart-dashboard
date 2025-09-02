import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

export default function WavesTrend({
  trend,
  colorUp,
  colorDown,
  label,
}: {
  trend: { direction: "up" | "down"; percentage: number };
  colorUp: string;
  colorDown: string;
  label: string;
}) {
  const isUp = trend.direction === "up";
  const Icon = isUp ? TrendingUp : TrendingDown;
  const color = isUp ? colorUp : colorDown;

  return (
    <div className="flex items-center justify-center space-x-1 mb-3">
      <Icon className="w-4 h-4" style={{ color }} />
      <span className="text-xs font-medium" style={{ color }}>
        {trend.percentage}% {label}
      </span>
    </div>
  );
}
