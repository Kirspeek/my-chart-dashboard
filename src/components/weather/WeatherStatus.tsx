"use client";

import React from "react";

interface WeatherStatusProps {
  isCached: boolean;
  isPreloading: boolean;
  stale: boolean;
}

export default function WeatherStatus({
  isCached,
  isPreloading,
  stale,
}: WeatherStatusProps) {
  return (
    <div
      style={{
        fontSize: 12,
        color: isCached
          ? "var(--color-gray)"
          : isPreloading
            ? "#eab308" // yellow for preloading
            : stale
              ? "#f87171" // red for stale
              : "#b0b0a8", // fallback gray
        opacity: 0.7,
        marginBottom: 4,
        minHeight: 18,
        minWidth: 70,
        textAlign: "center",
        transition: "color 0.2s",
        fontWeight: 500,
        letterSpacing: "0.01em",
      }}
    >
      {isCached
        ? "⚡ Instant"
        : isPreloading
          ? "⟳ Updating..."
          : stale
            ? "⚠️ Outdated"
            : ""}
    </div>
  );
}
