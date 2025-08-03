import React from "react";
import { WeatherBackgroundProps } from "../../../interfaces/widgets";
import { getWeatherBackground } from "../../utils/weatherUtils";
import "../../styles/weather.css";

export default function WeatherBackgroundMobile({
  desc,
  children,
}: WeatherBackgroundProps) {
  const backgroundStyle = getWeatherBackground(desc);

  return (
    <div className="weather-background-mobile" style={backgroundStyle}>
      {children}
    </div>
  );
}
