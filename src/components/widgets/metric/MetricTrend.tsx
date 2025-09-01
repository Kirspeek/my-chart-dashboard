"use client";

import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { useTheme } from "../../../hooks/useTheme";

interface MetricTrendProps {
  change: number;
  accentColor: string;
  isHovered?: boolean;
}

export default function MetricTrend({
  change,
  accentColor,
  isHovered = false,
}: MetricTrendProps) {
  const { colorsTheme } = useTheme();
  const metricColors = colorsTheme.widgets.metric;

  const isPositive = change >= 0;
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;
  const trendColor = isPositive ? accentColor : metricColors.trend.negative;

  return (
    <div
      className={`flex items-center mt-1 gap-1 w-full justify-start transition-all duration-300 ${
        isHovered ? "scale-105" : "scale-100"
      }`}
    >
      <TrendIcon
        style={{ color: trendColor, width: 16, height: 16 }}
        className="sm:w-4 sm:h-4"
      />
      <span className="font-mono font-bold text-sm sm:text-base secondary-text">
        {Math.abs(change)}%
      </span>
      <span
        className="font-mono text-xs ml-1 truncate secondary-text"
        style={{
          opacity: 0.8,
          fontWeight: 600,
          letterSpacing: 0.5,
        }}
        title="from last month"
      >
        from last month
      </span>
    </div>
  );
}
