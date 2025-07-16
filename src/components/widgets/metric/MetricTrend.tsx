"use client";

import React from "react";
import { TrendingUp } from "lucide-react";

interface MetricTrendProps {
  change: number;
  accentColor: string;
}

export default function MetricTrend({ change, accentColor }: MetricTrendProps) {
  return (
    <div className="flex items-center mt-1 gap-2 w-full">
      <TrendingUp style={{ color: accentColor, width: 28, height: 28 }} />
      <span
        className="font-mono font-extrabold mono text-3xl"
        style={{ color: "#888" }}
      >
        {Math.abs(change)}%
      </span>
      <span
        className="font-mono text-xs ml-2"
        style={{
          color: "#B0B0A8",
          opacity: 1,
          fontWeight: 700,
          letterSpacing: 1.5,
        }}
      >
        from last month
      </span>
    </div>
  );
}
