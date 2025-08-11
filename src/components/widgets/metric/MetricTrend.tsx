"use client";

import React from "react";
import { TrendingUp } from "lucide-react";

interface MetricTrendProps {
  change: number;
  accentColor: string;
}

export default function MetricTrend({ change, accentColor }: MetricTrendProps) {
  return (
    <div className="flex items-center mt-1 gap-1 w-full justify-start">
      <TrendingUp
        style={{ color: accentColor, width: 16, height: 16 }}
        className="sm:w-5 sm:h-5"
      />
      <span
        className="font-mono font-extrabold mono text-lg sm:text-2xl"
        style={{ color: "#888" }}
      >
        {Math.abs(change)}%
      </span>
      <span
        className="font-mono text-xs ml-1 truncate"
        style={{
          color: "#B0B0A8",
          opacity: 1,
          fontWeight: 700,
          letterSpacing: 1.5,
        }}
        title="from last month"
      >
        from last month
      </span>
    </div>
  );
}
