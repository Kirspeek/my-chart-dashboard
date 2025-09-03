"use client";

import React from "react";
import { MousePointer } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import type { SelectionBannerProps } from "@/interfaces/components";

export default function SelectionBanner({
  label,
  value,
  onClear,
  className = "",
}: SelectionBannerProps) {
  const { colors } = useTheme();

  return (
    <div
      className={`mb-3 p-2 rounded-lg flex-shrink-0 ${className}`}
      style={{
        background: "var(--button-bg)",
        border: "1px solid var(--button-border)",
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <MousePointer
            className="w-4 h-4 mr-2"
            style={{ color: colors.accent.blue }}
          />
          <span
            className="text-sm font-bold primary-text"
            style={{ fontFamily: "var(--font-mono)", fontWeight: 700 }}
          >
            {label}: {value}
          </span>
        </div>
        <button
          onClick={onClear}
          className="text-xs px-2 py-1 rounded-full"
          style={{
            background: colors.accent.red + "20",
            color: colors.accent.red,
            fontFamily: "var(--font-mono)",
            fontWeight: 700,
          }}
        >
          Clear
        </button>
      </div>
    </div>
  );
}
