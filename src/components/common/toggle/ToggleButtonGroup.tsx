"use client";

import React from "react";
import { useTheme } from "@/hooks/useTheme";
import type { ToggleButtonGroupProps } from "@/interfaces/components";
import { useMobileDetection } from "../useMobileDetection";

export default function ToggleButtonGroup({
  options,
  selectedKey,
  onChange,
  size = "md",
  className = "",
  hideLabelsOnMobile = true,
}: ToggleButtonGroupProps) {
  const { colors } = useTheme();
  const isMobile = useMobileDetection();

  const basePadding = size === "sm" ? "px-3 py-1.5" : "px-3 py-1.5";
  const iconSize = size === "sm" ? "w-3 h-3" : "w-4 h-4";

  return (
    <div className={`flex items-center justify-center space-x-1 ${className}`}>
      {options.map(({ key, icon: Icon, label }) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          className={`flex items-center space-x-1.5 ${basePadding} rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 ${
            selectedKey === key ? "scale-105" : ""
          }`}
          style={{
            background:
              selectedKey === key
                ? colors.accent.blue + "20"
                : "var(--button-bg)",
            border: `1px solid ${selectedKey === key ? colors.accent.blue : "var(--button-border)"}`,
            color: selectedKey === key ? colors.accent.blue : colors.secondary,
            fontFamily: "var(--font-mono)",
            fontWeight: 700,
          }}
        >
          <Icon className={iconSize} />
          {!(hideLabelsOnMobile && isMobile) && <span>{label}</span>}
        </button>
      ))}
    </div>
  );
}
