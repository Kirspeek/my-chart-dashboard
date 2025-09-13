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
      className={`p-2 rounded-lg relative overflow-hidden group hover:scale-[1.01] transition-all duration-200 min-h-[70px] ${className}`}
      style={{
        background: "var(--button-bg)",
        border: "1px solid var(--button-border)",
        opacity: 0.9,
      }}
    >
      <div
        className="absolute top-0 left-0 w-full h-0.5 opacity-10 group-hover:opacity-20 transition-opacity duration-200"
        style={{ background: color }}
      />

      <div className="relative z-10 h-full flex flex-col justify-between">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center space-x-1.5">
            <Icon className="w-3 h-3" style={{ color: color + "70" }} />
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
            className="text-xs px-1.5 py-0.5 rounded-full"
            style={{
              fontFamily: "var(--font-mono)",
              fontWeight: 500,
              background:
                growth > 0
                  ? "rgba(34, 197, 94, 0.1)"
                  : growth < 0
                    ? "rgba(239, 68, 68, 0.1)"
                    : "rgba(107, 114, 128, 0.1)",
              color:
                growth > 0
                  ? "rgba(34, 197, 94, 0.8)"
                  : growth < 0
                    ? "rgba(239, 68, 68, 0.8)"
                    : "rgba(107, 114, 128, 0.8)",
            }}
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
          <div
            className="w-full rounded-full h-1 mb-1"
            style={{ background: "rgba(107, 114, 128, 0.1)" }}
          >
            <div
              className="h-1 rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(Math.max(progress, 0), 100)}%`,
                background:
                  growth > 0
                    ? "rgba(20, 184, 166, 0.6)"
                    : growth < 0
                      ? "rgba(239, 68, 68, 0.6)"
                      : "rgba(107, 114, 128, 0.6)",
              }}
            />
          </div>
        )}

        {badge && (
          <div
            className="text-xs px-1.5 py-0.5 rounded-full self-end"
            style={{
              background: color + "10",
              color: color + "80",
              fontFamily: "var(--font-mono)",
              fontWeight: 500,
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
