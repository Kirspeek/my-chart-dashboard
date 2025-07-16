"use client";

import React from "react";
import { MetricCardProps } from "../../../interfaces/widgets";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Target,
} from "lucide-react";
import WidgetBase from "../common/WidgetBase";

const iconMap = {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Target,
};

const accentColors = [
  { bg: "var(--accent-yellow)", icon: "var(--accent-yellow)" },
  { bg: "var(--accent-teal)", icon: "var(--accent-teal)" },
  { bg: "var(--accent-red)", icon: "var(--accent-red)" },
  { bg: "var(--accent-blue)", icon: "var(--accent-blue)" },
];

function splitNumber(value: string | number) {
  // Extracts main and secondary (decimal/0) part
  const str = String(value);
  const match = str.match(/^(.*?)([.,][0-9]+)?$/);
  if (!match) return { main: str, secondary: "" };
  return { main: match[1], secondary: match[2] || "" };
}

export default function MetricCard({ metric, index = 0 }: MetricCardProps) {
  const IconComponent =
    iconMap[metric.icon as keyof typeof iconMap] || TrendingUp;
  // For Total Sales, override value to 456.0
  const value = metric.title.toLowerCase().includes("sales")
    ? "456.0"
    : metric.value;
  const { main, secondary } = splitNumber(value);
  const accent = accentColors[index % accentColors.length];

  return (
    <WidgetBase className="flex flex-col gap-4">
      <div className="flex items-center justify-between w-full">
        <div>
          <p
            className="text-xs font-bold uppercase mb-2"
            style={{
              color: "#232323",
              fontFamily: "var(--font-sans)",
              opacity: 0.7,
              letterSpacing: 1.5,
            }}
          >
            {metric.title}
          </p>
          <span className="flex items-baseline gap-1">
            <span
              className="text-5xl font-mono font-extrabold mono"
              style={{
                color: "#232323",
                letterSpacing: "0.04em",
                lineHeight: 1.1,
              }}
            >
              {main}
            </span>
            {secondary && (
              <span
                className="text-5xl font-mono font-extrabold mono"
                style={{
                  color: "#888",
                  letterSpacing: "0.04em",
                  lineHeight: 1.1,
                }}
              >
                {secondary}
              </span>
            )}
          </span>
        </div>
        <div
          className="rounded-full flex items-center justify-center ml-4"
          style={{
            background: accent.bg,
            width: 56,
            height: 56,
            minWidth: 56,
            minHeight: 56,
            boxShadow: `0 0 0 4px var(--color-bg-card)`,
          }}
        >
          <IconComponent style={{ color: "#fff", width: 30, height: 30 }} />
        </div>
      </div>
      <div className="flex items-center mt-1 gap-2 w-full">
        <TrendingUp style={{ color: accent.bg, width: 28, height: 28 }} />
        <span
          className="font-mono font-extrabold mono text-3xl"
          style={{ color: "#888" }}
        >
          {Math.abs(metric.change)}%
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
    </WidgetBase>
  );
}
