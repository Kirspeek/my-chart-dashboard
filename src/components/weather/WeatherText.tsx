import React from "react";
import { WeatherTextProps } from "../../../interfaces/widgets";
import { getWeatherColors, parseDate } from "../../utils/weatherUtils";
import "../../styles/weather.css";

export default function WeatherText({
  desc,
  temp,
  city,
  date,
  hot = false,
  children,
}: WeatherTextProps) {
  const colors = getWeatherColors(desc, hot);
  const { dayOfWeek, restOfDate } = parseDate(date);

  return (
    <div className="weather-text-container-desktop weather-text-container-mobile">
      <span
        className="weather-temperature-desktop weather-temperature-mobile"
        style={{ color: colors.mainColor }}
      >
        {temp}°
      </span>
      <span
        className="weather-description-desktop weather-description-mobile"
        style={{ color: colors.secondaryColor }}
      >
        {desc}
      </span>
      <span
        className="weather-city-desktop weather-city-mobile"
        style={{ color: colors.mainColor }}
      >
        {city}
      </span>
      <span
        className="weather-date-desktop weather-date-mobile"
        style={{ color: colors.secondaryColor }}
      >
        {dayOfWeek} {restOfDate}
      </span>
      {children}
    </div>
  );
}
