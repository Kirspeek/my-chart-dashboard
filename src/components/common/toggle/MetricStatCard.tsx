"use client";

import React from "react";
import type { MetricStatCardProps } from "@/interfaces/components";

export default function MetricStatCard({
  icon: Icon,
  label,
  subtitle,
  value,
  growth = 0,
  color,
  badge,
  progress,
  className = "",
}: MetricStatCardProps) {
  return (
    <div
      className={`p-2 rounded-lg relative overflow-hidden group hover:scale-[1.01] transition-all duration-300 min-h-[70px] ${className}`}
      style={{
        background: "var(--button-bg)",
        border: "1px solid var(--button-border)",
      }}
    >
      <div
        className="absolute top-0 left-0 w-full h-0.5 opacity-20 group-hover:opacity-40 transition-opacity duration-300"
        style={{ background: color }}
      />

      <div className="relative z-10 h-full flex flex-col justify-between">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center space-x-1.5">
            <Icon className="w-3 h-3" style={{ color }} />
            <div>
              <div
                className="text-xs font-bold primary-text"
                style={{ fontFamily: "var(--font-mono)", fontWeight: 700 }}
              >
                {label}
              </div>
              {subtitle && (
                <div className="text-xs secondary-text">{subtitle}</div>
              )}
            </div>
          </div>
          <div
            className={`text-xs px-1.5 py-0.5 rounded-full ${
              growth > 0
                ? "bg-green-100 text-green-800"
                : growth < 0
                  ? "bg-red-100 text-red-800"
                  : "bg-gray-100 text-gray-800"
            }`}
            style={{ fontFamily: "var(--font-mono)", fontWeight: 700 }}
          >
            {growth > 0 ? "+" : ""}
            {growth.toFixed(1)}%
          </div>
        </div>

        <div
          className="text-sm font-bold primary-text mb-1"
          style={{ fontFamily: "var(--font-mono)", fontWeight: 700 }}
        >
          {value}
        </div>

        {typeof progress === "number" && (
          <div className="w-full bg-gray-200 rounded-full h-1 mb-1">
            <div
              className="h-1 rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(Math.max(progress, 0), 100)}%`,
                background:
                  growth > 0
                    ? "var(--accent-teal)"
                    : growth < 0
                      ? "var(--accent-red)"
                      : "var(--secondary-color)",
              }}
            />
          </div>
        )}

        {badge && (
          <div
            className="text-xs px-1.5 py-0.5 rounded-full self-end"
            style={{
              background: color + "15",
              color,
              fontFamily: "var(--font-mono)",
              fontWeight: 700,
              fontSize: "0.6rem",
            }}
          >
            {badge}
          </div>
        )}
      </div>
    </div>
  );
}
