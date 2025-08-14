import React, { useState } from "react";
import { WeatherTextProps } from "../../../interfaces/widgets";
import { getWeatherColors, parseDate } from "../../utils/weatherUtils";
import { MapPin, Calendar, Thermometer } from "lucide-react";
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
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="weather-text-container-desktop weather-text-container-mobile"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        transition: "all 0.3s ease",
        transform: isHovered ? "scale(1.02)" : "scale(1)",
      }}
    >
      <style jsx>{`
        .weather-temperature {
          transition: all 0.3s ease;
        }
        .weather-temperature:hover {
          transform: scale(1.1);
          text-shadow: 0 0 10px ${colors.mainColor}40;
        }
        .weather-city {
          transition: all 0.3s ease;
        }
        .weather-city:hover {
          transform: translateX(2px);
        }
        .weather-date {
          transition: all 0.3s ease;
        }
        .weather-date:hover {
          transform: translateY(-1px);
        }
      `}</style>

      <div className="flex items-center gap-1 mb-1">
        <Thermometer
          className="w-4 h-4"
          style={{
            color: colors.mainColor,
            opacity: isHovered ? 1 : 0.7,
            transition: "opacity 0.3s ease",
          }}
        />
        <span
          className="weather-temperature-desktop weather-temperature-mobile weather-temperature"
          style={{ color: colors.mainColor }}
        >
          {temp}°
        </span>
      </div>

      <span
        className="weather-description-desktop weather-description-mobile"
        style={{
          color: colors.secondaryColor,
          opacity: isHovered ? 1 : 0.9,
          transition: "opacity 0.3s ease",
        }}
      >
        {desc}
      </span>

      <div className="flex items-center gap-1 mt-1">
        <MapPin
          className="w-3 h-3"
          style={{
            color: colors.mainColor,
            opacity: isHovered ? 1 : 0.7,
            transition: "opacity 0.3s ease",
          }}
        />
        <span
          className="weather-city-desktop weather-city-mobile weather-city"
          style={{ color: colors.mainColor }}
        >
          {city}
        </span>
      </div>

      <div className="flex items-center gap-1 mt-1">
        <Calendar
          className="w-3 h-3"
          style={{
            color: colors.secondaryColor,
            opacity: isHovered ? 1 : 0.7,
            transition: "opacity 0.3s ease",
          }}
        />
        <span
          className="weather-date-desktop weather-date-mobile weather-date"
          style={{ color: colors.secondaryColor }}
        >
          {dayOfWeek} {restOfDate}
        </span>
      </div>
      {children}
    </div>
  );
}
