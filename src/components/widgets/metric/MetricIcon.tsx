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
      className="rounded-full flex items-center justify-center absolute top-2 right-2 z-10"
      style={{
        background: accentColor,
        width: 56,
        height: 56,
        minWidth: 56,
        minHeight: 56,
        boxShadow: `0 0 0 4px var(--color-bg-card)`,
      }}
    >
      <IconComponent style={{ color: "#fff", width: 30, height: 30 }} />
    </div>
  );
}
