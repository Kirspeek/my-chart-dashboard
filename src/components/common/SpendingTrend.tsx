"use client";

import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { useTheme } from "../../hooks/useTheme";

interface SpendingTrendProps {
  direction: "up" | "down";
  percentage: number;
  label?: string;
  className?: string;
}

export default function SpendingTrend({
  direction,
  percentage,
  label = "from last month",
  className = "",
}: SpendingTrendProps) {
  const { accent } = useTheme();
  const isUp = direction === "up";
  const color = isUp ? accent.teal : accent.red;
  const Icon = isUp ? TrendingUp : TrendingDown;

  return (
    <div className={`flex items-center justify-center space-x-1 ${className}`}>
      <Icon className="w-4 h-4" style={{ color }} />
      <span className="text-xs font-medium" style={{ color }}>
        {percentage}% {label}
      </span>
    </div>
  );
}
