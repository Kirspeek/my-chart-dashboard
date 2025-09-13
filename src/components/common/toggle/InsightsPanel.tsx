"use client";

import React from "react";
import { Eye } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import type { InsightsPanelProps } from "@/interfaces/components";

export default function InsightsPanel({
  title,
  show,
  onToggle,
  className = "",
  children,
}: InsightsPanelProps) {
  const { colors } = useTheme();

  return (
    <div
      className={`mt-2 p-3 rounded-lg flex-shrink-0 transition-all duration-200 ${className}`}
      style={{
        background: "var(--button-bg)",
        border: "1px solid var(--button-border)",
        opacity: 0.9,
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <Eye
            className="w-3 h-3 mr-1.5 transition-all duration-200"
            style={{
              color: `${colors.accent.blue}70`,
            }}
          />
          <span
            className="text-xs font-medium secondary-text"
            style={{
              fontFamily: "var(--font-mono)",
            }}
          >
            {title}
          </span>
        </div>
        <button
          onClick={onToggle}
          className="text-xs px-3 py-1.5 rounded-md transition-all duration-200 hover:scale-105 font-medium"
          style={{
            background: show
              ? `${colors.accent.blue}15`
              : `${colors.accent.teal}15`,
            color: show ? `${colors.accent.blue}90` : `${colors.accent.teal}90`,
            fontFamily: "var(--font-mono)",
            fontWeight: 500,
            border: show
              ? `1px solid ${colors.accent.blue}30`
              : `1px solid ${colors.accent.teal}30`,
            boxShadow: "none",
          }}
        >
          {show ? "Hide" : "Show"}
        </button>
      </div>

      {show && <div className="space-y-2">{children}</div>}
    </div>
  );
}
