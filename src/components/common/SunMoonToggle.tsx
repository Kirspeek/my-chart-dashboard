"use client";

import React, { useId, useMemo } from "react";
import { useTheme } from "@/hooks/useTheme";
import type { SunMoonToggleProps } from "@/interfaces/sunMoonToggle";

export default function SunMoonToggle({
  size = 28,
  className = "",
}: SunMoonToggleProps) {
  const { isDark, toggleTheme, accent } = useTheme();

  const clipId = useId();
  const filterId = useId();

  const sunColor = "#FFCE54";
  const accentBlue = accent?.blue ?? "#7BC2E8";
  const moonColor = isDark ? accentBlue : "#FFF3D8";
  const ringColor = isDark ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.1)";

  const containerStyle: React.CSSProperties = useMemo(
    () => ({
      position: "relative",
      width: size,
      height: size,
      borderRadius: "50%",
      overflow: "hidden",
      transition: "transform 0.2s ease",
      boxShadow: `inset 0 0 0 2px ${ringColor}`,
      cursor: "pointer",
    }),
    [size, ringColor]
  );

  const beforeStyle: React.CSSProperties = useMemo(
    () => ({
      content: "''",
      position: "absolute" as const,
      top: isDark ? "-20%" : "-72%",
      left: isDark ? "-30%" : "-72%",
      width: "172%",
      height: "172%",
      background: isDark ? moonColor : sunColor,
      transition: ".75s ease",
      WebkitClipPath: `url(#${clipId})`,
      clipPath: `url(#${clipId})`,
      zIndex: 1,
      boxShadow: isDark
        ? "0 0 8px 2px rgba(96,165,250,0.75)"
        : "0 0 4px 1px rgba(255,206,84,0.6)",
      pointerEvents: "none",
      willChange: "top, left, background",
    }),
    [isDark, clipId, moonColor, sunColor]
  );

  return (
    <button
      onClick={toggleTheme}
      title={isDark ? "Switch to light" : "Switch to dark"}
      aria-label={isDark ? "Switch to light" : "Switch to dark"}
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        background: "transparent",
        border: 0,
        padding: 0,
        width: size,
        height: size,
      }}
    >
      <svg width={0} height={0} style={{ position: "fixed" }} aria-hidden>
        <defs>
          <clipPath id={clipId} clipPathUnits="objectBoundingBox">
            <path d="M.29 0A.29.29 0 1 1 0 .29V1h1V0H.29z" />
          </clipPath>
        </defs>
        <defs>
          <filter id={filterId}>
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation="10"
              result="blur"
            />
            <feColorMatrix
              in="blur"
              type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 30 -12"
              result="blob"
            />
          </filter>
        </defs>
      </svg>

      <div
        role="switch"
        aria-checked={!isDark}
        style={containerStyle}
        onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.97)")}
        onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        <div style={beforeStyle} />
      </div>
    </button>
  );
}
