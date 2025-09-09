import React, { useState } from "react";
import { ForecastDayProps } from "@/interfaces/widgets";
import Button3D from "../../common/3DButton";
import { getSelectedButtonBackground } from "../../../utils/weatherUtils";
import { Calendar, Thermometer } from "lucide-react";
import "../../../styles/weather.css";

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
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        transition: "all 0.3s ease",
        transform: isHovered ? "scale(1.05)" : "scale(1)",
      }}
    >
      <Button3D
        selected={selected}
        onClick={onClick}
        customBackground={weatherBackground}
        className="forecast-day-desktop"
      >
        <div className="forecast-day-content-desktop">
          <style jsx>{`
            .forecast-day-name {
              transition: all 0.3s ease;
            }
            .forecast-day-name:hover {
              transform: translateY(-1px);
            }
            .forecast-day-icon {
              transition: all 0.3s ease;
            }
            .forecast-day-icon:hover {
              transform: scale(1.2);
            }
            .forecast-day-temp {
              transition: all 0.3s ease;
            }
            .forecast-day-temp:hover {
              transform: scale(1.1);
            }
          `}</style>

          <div className="flex items-center gap-1 mb-1">
            <Calendar
              className="w-3 h-3"
              style={{
                color: selected ? "#fff" : "var(--secondary-text)",
                opacity: isHovered ? 1 : 0.7,
                transition: "opacity 0.3s ease",
              }}
            />
            <span
              className="forecast-day-name-desktop forecast-day-name"
              style={{ color: selected ? "inherit" : "var(--secondary-text)" }}
            >
              {day}
            </span>
          </div>

          <span
            className="forecast-day-icon-desktop forecast-day-icon"
            style={{
              transform: isHovered ? "scale(1.1)" : "scale(1)",
              transition: "transform 0.3s ease",
            }}
          >
            {icon}
          </span>

          <div className="flex items-center gap-1 mt-1">
            <Thermometer
              className="w-3 h-3"
              style={{
                color: selected ? "#fff" : "var(--secondary-text)",
                opacity: isHovered ? 1 : 0.7,
                transition: "opacity 0.3s ease",
              }}
            />
            <span
              className="forecast-day-temp-desktop forecast-day-temp"
              style={{
                color: "var(--weather-text-muted)",
                transform: isHovered ? "scale(1.05)" : "scale(1)",
                transition: "transform 0.3s ease",
              }}
            >
              {min}°
            </span>
            <span
              className="forecast-day-temp-desktop forecast-day-temp"
              style={{
                color: selected ? "inherit" : "var(--secondary-text)",
                transform: isHovered ? "scale(1.05)" : "scale(1)",
                transition: "transform 0.3s ease",
              }}
            >
              {max}°
            </span>
          </div>
          {children}
        </div>
      </Button3D>
    </div>
  );
}
