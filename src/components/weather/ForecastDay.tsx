import React from "react";
import { ForecastDayProps } from "../../../interfaces/widgets";

export default function ForecastDay({
  day,
  icon,
  min,
  max,
  selected,
  desc,
  onClick,
  children,
}: ForecastDayProps) {
  let background = "rgba(35, 35, 35, 0.07)"; // light theme card background
  if (!selected) {
    background = "rgba(255,255,255,0.04)"; // slightly lighter transparent bg for dark theme
  }
  if (selected) {
    if (/thunderstorm/i.test(desc)) {
      background = "linear-gradient(135deg, #23243a 0%, #ffe066 100%)"; // thunderstorm: dark blue to yellow
    } else if (/hot|very hot|heat|accent-red|showers|drizzle/i.test(desc)) {
      background = "linear-gradient(165deg, #ff512f 0%, #ffb347 100%)"; // hot
    } else if (/rain/i.test(desc)) {
      background = "linear-gradient(to bottom, #3a7ca5 0%, #4a90c2 100%)"; // rain
    } else if (/partly cloudy/i.test(desc)) {
      background = "linear-gradient(135deg, #e3f0ff 0%, #b3d8f7 100%)"; // partly cloudy
    } else if (/clear sky|sunny/i.test(desc)) {
      background = "linear-gradient(135deg, #ffe88a 0%, #ffd34d 100%)"; // sunny
    }
  }

  return (
    <div
      className="flex flex-row items-center justify-between"
      style={{
        background,
        borderRadius: "1rem",
        minWidth: 140,
        minHeight: 56,
        padding: "0.7rem 1.2rem",
        boxShadow: "none",
        border: selected ? undefined : "none",
        gap: 16,
        cursor: "pointer",
        transition: "background 0.2s",
      }}
      onClick={onClick}
    >
      <span
        style={{
          fontWeight: 700,
          fontSize: 18,
          color: "#232323", // light theme black
          width: 40,
          fontFamily: "var(--font-mono)",
          letterSpacing: "0.01em",
        }}
      >
        {day}
      </span>
      <span
        style={{
          fontSize: 24,
          margin: "0 8px",
          width: 32,
          textAlign: "center",
        }}
      >
        {icon}
      </span>
      <span
        style={{
          fontWeight: 500,
          fontSize: 16,
          color: "#888", // light theme gray
          width: 32,
          textAlign: "right",
          fontFamily: "var(--font-mono)",
          letterSpacing: "0.01em",
        }}
      >
        {min}°
      </span>
      <span
        style={{
          fontWeight: 500,
          fontSize: 16,
          color: "#232323", // light theme black
          width: 32,
          textAlign: "right",
          fontFamily: "var(--font-mono)",
          letterSpacing: "0.01em",
        }}
      >
        {max}°
      </span>
      {children}
    </div>
  );
}
