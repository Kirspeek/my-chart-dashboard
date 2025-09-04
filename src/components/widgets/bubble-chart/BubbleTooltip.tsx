"use client";

import React from "react";
import type { BubbleTooltipProps } from "@/interfaces/charts";

export default function BubbleTooltip({
  tooltip,
  getCategoryHex,
}: BubbleTooltipProps) {
  if (!tooltip) return null;
  const colorHex = getCategoryHex(tooltip.data.category);
  return (
    <div
      style={{
        position: "absolute",
        left: tooltip.x + 10,
        top: tooltip.y - 10,
        background: "var(--button-bg)",
        color: "var(--primary-text)",
        borderRadius: 12,
        boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
        padding: "16px 20px",
        fontFamily: "var(--font-mono)",
        fontWeight: 700,
        fontSize: 14,
        pointerEvents: "none",
        zIndex: 10,
        minWidth: 250,
        border: `3px solid #${colorHex}`,
        backgroundColor: `#${colorHex}20`,
        transform: "translate(-50%, -100%)",
        backdropFilter: "blur(10px)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 8,
        }}
      >
        <span
          style={{
            display: "inline-block",
            width: 20,
            height: 20,
            background: `#${colorHex}`,
            borderRadius: "50%",
            marginRight: 8,
            boxShadow: `0 0 10px #${colorHex}`,
          }}
        />
        <span style={{ fontSize: 16, fontWeight: 800 }}>
          {tooltip.data.label || tooltip.data.category}
        </span>
      </div>
      <div style={{ marginBottom: 4, fontWeight: 600, fontSize: 13 }}>
        💰 Market Cap: ${tooltip.data.x}B
      </div>
      <div style={{ marginBottom: 4, fontWeight: 600, fontSize: 13 }}>
        📈 Growth: {tooltip.data.y}%
      </div>
      <div style={{ marginBottom: 4, fontWeight: 600, fontSize: 13 }}>
        👥 Employees: {tooltip.data.size}K
      </div>
      <div
        style={{
          fontWeight: 600,
          fontSize: 13,
          color: "var(--secondary-text)",
        }}
      >
        🎯 XYZ: ({Math.round(tooltip.data.x)}, {Math.round(tooltip.data.y)},{" "}
        {Math.round(tooltip.data.z)})
      </div>
    </div>
  );
}
