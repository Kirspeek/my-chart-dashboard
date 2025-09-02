import React from "react";
import { WeatherBackgroundProps } from "@/interfaces/widgets";
import { getWeatherBackground } from "../../../utils/weatherUtils";
import "../../../styles/weather.css";

export default function WeatherBackground({
  desc,
  children,
}: WeatherBackgroundProps) {
  const backgroundStyle = getWeatherBackground(desc);

  return (
    <div className="weather-background-desktop" style={backgroundStyle}>
      {children}
    </div>
  );
}
