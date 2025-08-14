import React, { useState } from "react";
import { WeatherTextProps } from "../../../interfaces/widgets";
import { getWeatherColors } from "../../utils/weatherUtils";
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
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="weather-text-container-desktop weather-text-container-mobile"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        transition: "all 0.3s ease",
        transform: isHovered ? "scale(1.02)" : "scale(1)",
        minWidth: 0,
        width: "100%",
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
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .weather-city:hover {
          transform: translateX(2px);
        }
        .weather-date {
          transition: all 0.3s ease;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .weather-date:hover {
          transform: translateY(-1px);
        }
      `}</style>

      <div className="flex items-center gap-1 mb-1" style={{ minWidth: 0 }}>
        <Thermometer
          className="w-4 h-4 flex-shrink-0"
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
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {desc}
      </span>

      <div className="flex items-center gap-1 mt-1" style={{ minWidth: 0 }}>
        <MapPin
          className="w-3 h-3 flex-shrink-0"
          style={{
            color: colors.mainColor,
            opacity: isHovered ? 1 : 0.7,
            transition: "opacity 0.3s ease",
          }}
        />
        <span
          className="weather-city-desktop weather-city-mobile weather-city"
          style={{
            color: colors.mainColor,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            flex: 1,
            minWidth: 0,
          }}
        >
          {city}
        </span>
      </div>

      <div className="flex items-center gap-1 mt-1" style={{ minWidth: 0 }}>
        <Calendar
          className="w-3 h-3 flex-shrink-0"
          style={{
            color: colors.secondaryColor,
            opacity: isHovered ? 1 : 0.7,
            transition: "opacity 0.3s ease",
          }}
        />
        <span
          className="weather-date-desktop weather-date-mobile weather-date"
          style={{
            color: colors.secondaryColor,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            flex: 1,
            minWidth: 0,
          }}
        >
          {date}
        </span>
      </div>
      {children}
    </div>
  );
}
