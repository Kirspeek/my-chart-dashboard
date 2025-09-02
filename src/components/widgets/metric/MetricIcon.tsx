"use client";

import React from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Target,
} from "lucide-react";
import { useTheme } from "../../../hooks/useTheme";
import { MetricIconProps } from "@/interfaces/widgets";

const iconMap = {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Target,
};

export default function MetricIcon({
  icon,
  accentColor,
  isHovered = false,
}: MetricIconProps) {
  const { colorsTheme } = useTheme();
  const metricColors = colorsTheme.widgets.metric;

  const IconComponent = iconMap[icon as keyof typeof iconMap] || TrendingUp;

  return (
    <div
      className={`rounded-full flex items-center justify-center absolute z-10 w-8 h-8 min-w-8 min-h-8 sm:w-10 sm:h-10 sm:min-w-10 sm:min-h-10
                 top-4 right-4 sm:top-3 sm:right-3 md:top-2 md:right-2 transition-all duration-300 ${
                   isHovered ? "scale-110" : "scale-100"
                 }`}
      style={{
        background: accentColor,
        boxShadow: `0 0 0 4px var(--color-bg-card)`,
      }}
    >
      <IconComponent
        style={{ color: metricColors.icon.text, width: 16, height: 16 }}
        className="sm:w-5 sm:h-5"
      />
    </div>
  );
}
