"use client";

import React from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Target,
} from "lucide-react";

const iconMap = {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Target,
};

interface MetricIconProps {
  icon: string;
  accentColor: string;
}

export default function MetricIcon({ icon, accentColor }: MetricIconProps) {
  const IconComponent = iconMap[icon as keyof typeof iconMap] || TrendingUp;

  return (
    <div
      className="rounded-full flex items-center justify-center absolute z-10 w-8 h-8 min-w-8 min-h-8 sm:w-10 sm:h-10 sm:min-w-10 sm:min-h-10
                 top-4 right-4 sm:top-3 sm:right-3 md:top-2 md:right-2"
      style={{
        background: accentColor,
        boxShadow: `0 0 0 4px var(--color-bg-card)`,
      }}
    >
      <IconComponent
        style={{ color: "#fff", width: 16, height: 16 }}
        className="sm:w-5 sm:h-5"
      />
    </div>
  );
}
