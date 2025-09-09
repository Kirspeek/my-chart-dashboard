import React from "react";
import { ForecastDayProps } from "@/interfaces/widgets";
import Button3D from "../../common/3DButton";
import { getSelectedButtonBackground } from "../../../utils/weatherUtils";
import "../../../styles/weather.css";

export default function ForecastDayMobile({
  day,
  icon,
  min,
  max,
  selected,
  desc,
  onClick,
  children,
}: ForecastDayProps) {
  const weatherBackground = selected
    ? getSelectedButtonBackground(desc).background
    : undefined;

  return (
    <Button3D
      selected={selected}
      onClick={onClick}
      customBackground={weatherBackground}
      className="forecast-day-mobile"
    >
      <span
        className="forecast-day-name-mobile"
        style={{ color: selected ? "inherit" : "var(--secondary-text)" }}
      >
        {day}
      </span>
      <span
        className="forecast-day-icon-mobile"
        style={{ color: selected ? "inherit" : "var(--secondary-text)" }}
      >
        {icon}
      </span>
      <span
        className="forecast-day-temp-mobile"
        style={{ color: "var(--weather-text-muted)" }}
      >
        {min}°
      </span>
      <span
        className="forecast-day-temp-mobile"
        style={{ color: selected ? "inherit" : "var(--secondary-text)" }}
      >
        {max}°
      </span>
      {children}
    </Button3D>
  );
}
