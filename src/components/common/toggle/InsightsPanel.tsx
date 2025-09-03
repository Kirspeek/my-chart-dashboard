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
      className={`mt-2 p-3 rounded-lg flex-shrink-0 ${className}`}
      style={{
        background: "var(--button-bg)",
        border: "1px solid var(--button-border)",
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <Eye
            className="w-3 h-3 mr-1.5"
            style={{ color: colors.accent.blue }}
          />
          <span className="text-xs font-bold primary-text">{title}</span>
        </div>
        <button
          onClick={onToggle}
          className="text-xs px-2 py-1 rounded-full transition-all duration-200 hover:scale-105"
          style={{
            background: show ? colors.accent.blue + "20" : "var(--button-bg)",
            color: show ? colors.accent.blue : colors.secondary,
            fontFamily: "var(--font-mono)",
            fontWeight: 700,
          }}
        >
          {show ? "Hide" : "Show"}
        </button>
      </div>

      {show && <div className="space-y-2">{children}</div>}
    </div>
  );
}
