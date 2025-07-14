import React from "react";
import { ForecastDayProps } from "../../../interfaces/widgets";
import Button3D from "../common/3DButton";

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
  const weatherBackground = selected ? getSelectedBackground(desc) : undefined;

  return (
    <Button3D
      selected={selected}
      onClick={onClick}
      customBackground={weatherBackground}
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0.7rem 1.2rem",
        borderRadius: "1rem",
        minWidth: 140,
        minHeight: 56,
        gap: 16,
      }}
    >
      <span
        style={{
          fontWeight: 700,
          fontSize: 18,
          color: selected ? "#232323" : "var(--theme-text)",
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
          color: "#888",
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
          color: selected ? "#232323" : "var(--theme-text)",
          width: 32,
          textAlign: "right",
          fontFamily: "var(--font-mono)",
          letterSpacing: "0.01em",
        }}
      >
        {max}°
      </span>
      {children}
    </Button3D>
  );
}

function getSelectedBackground(desc: string): string {
  if (/thunderstorm/i.test(desc)) {
    return "linear-gradient(135deg, #23243a 0%, #ffe066 100%)"; // thunderstorm: dark blue to yellow
  } else if (/hot|very hot|heat|accent-red|showers|drizzle/i.test(desc)) {
    return "linear-gradient(165deg, #ff512f 0%, #ffb347 100%)"; // hot
  } else if (/rain/i.test(desc)) {
    return "linear-gradient(to bottom, #3a7ca5 0%, #4a90c2 100%)"; // rain
  } else if (/partly cloudy/i.test(desc)) {
    return "linear-gradient(135deg, #e3f0ff 0%, #b3d8f7 100%)"; // partly cloudy
  } else if (/clear sky|sunny/i.test(desc)) {
    return "linear-gradient(135deg, #ffe88a 0%, #ffd34d 100%)"; // sunny
  }
  return "rgba(35, 35, 35, 0.12)"; // default
}
