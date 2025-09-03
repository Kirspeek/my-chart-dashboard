"use client";

import React from "react";
import { Sparkles } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import type { AnalyticsHeaderProps } from "@/interfaces/components";

export default function AnalyticsHeader({
  leftTitle,
  leftSubtitle,
  rightValue,
  rightValueLabel,
  className = "",
}: AnalyticsHeaderProps) {
  const { colors } = useTheme();

  return (
    <div
      className={`flex items-center justify-between mb-3 p-3 rounded-lg flex-shrink-0 relative overflow-hidden ${className}`}
      style={{
        background: "var(--button-bg)",
        border: "1px solid var(--button-border)",
      }}
    >
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-20 h-20 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 animate-pulse" />
        <div
          className="absolute bottom-0 right-0 w-16 h-16 rounded-full bg-gradient-to-r from-green-400 to-blue-500 animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </div>

      <div className="relative z-10">
        <div
          className="text-sm font-bold primary-text flex items-center"
          style={{ fontFamily: "var(--font-mono)", fontWeight: 700 }}
        >
          <Sparkles
            className="w-4 h-4 mr-2"
            style={{ color: colors.accent.blue }}
          />
          {leftTitle}
        </div>
        {leftSubtitle && (
          <div className="text-xs secondary-text">{leftSubtitle}</div>
        )}
      </div>

      <div className="text-right relative z-10">
        <div
          className="text-lg font-bold"
          style={{
            color: colors.accent.teal,
            fontFamily: "var(--font-mono)",
            fontWeight: 700,
          }}
        >
          {rightValue}
        </div>
        {rightValueLabel && (
          <div className="text-xs secondary-text">{rightValueLabel}</div>
        )}
      </div>
    </div>
  );
}
