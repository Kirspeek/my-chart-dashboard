import React from "react";
import { ForecastDayProps } from "../../../interfaces/widgets";
import Button3D from "../common/3DButton";
import { getSelectedButtonBackground } from "../../utils/weatherUtils";
import "../../styles/weather.css";

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
  const weatherBackground = selected
    ? getSelectedButtonBackground(desc).background
    : undefined;

  return (
    <Button3D
      selected={selected}
      onClick={onClick}
      customBackground={weatherBackground}
      className="forecast-day-desktop"
    >
      <div className="forecast-day-content-desktop">
        <span className="forecast-day-name-desktop">{day}</span>
        <span className="forecast-day-icon-desktop">{icon}</span>
        <span
          className="forecast-day-temp-desktop"
          style={{ color: "var(--weather-text-muted)" }}
        >
          {min}°
        </span>
        <span className="forecast-day-temp-desktop">{max}°</span>
        {children}
      </div>
    </Button3D>
  );
}
