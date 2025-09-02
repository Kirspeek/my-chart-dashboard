"use client";

import React from "react";
import WeatherBackground from "./WeatherBackground";
import WeatherText from "./WeatherText";
import ForecastDay from "./ForecastDay";
import { WeatherWidgetProps } from "@/interfaces/widgets";
import WidgetBase from "../../common/WidgetBase";
import { useWeatherLogic } from "@/hooks/useWeatherLogic";
import WeatherAnimations from "./WeatherAnimations";
import WeatherStatus from "./WeatherStatus";
import type { ForecastDay as ForecastDayType } from "@/interfaces/widgets";
import { useTheme } from "@/hooks/useTheme";
import "../../../styles/weather.css";

function renderForecastBlock(
  forecast: ForecastDayType[],
  error: string | null,
  isPreloading: boolean,
  selectedDay: number,
  setSelectedDay: (i: number) => void,
  weatherColors: {
    loadingText: string;
    errorText: string;
    statusColors: {
      cached: string;
      preloading: string;
      stale: string;
      fallback: string;
    };
  }
) {
  if (forecast.length === 0 && !error) {
    return (
      <div style={{ color: weatherColors.loadingText, fontSize: 18 }}>
        {isPreloading ? "Preloading..." : "Loading..."}
      </div>
    );
  }
  if (forecast.length === 0 && error) {
    return (
      <div style={{ color: weatherColors.errorText, fontSize: 18 }}>
        {error}
      </div>
    );
  }
  return (
    <div className="weather-forecast-desktop">
      {forecast.map((f, i) => (
        <ForecastDay
          key={f.day}
          day={f.day}
          icon={f.icon}
          min={f.min}
          max={f.max}
          selected={selectedDay === i}
          desc={f.desc}
          onClick={() => setSelectedDay(i)}
        />
      ))}
    </div>
  );
}

export default function WeatherWidget({
  city = "Amsterdam",
}: WeatherWidgetProps) {
  const { colorsTheme } = useTheme();
  const weatherColors = colorsTheme.widgets.weather;
  const {
    forecast,
    error,
    isCached,
    isPreloading,
    stale,
    selectedDay,
    dateString,
    isCloudy,
    setSelectedDay,
  } = useWeatherLogic(city);

  return (
    <WidgetBase className="weather-widget-desktop" style={{ padding: 0 }}>
      {/* Left: Current weather */}
      <div
        className="weather-left-panel-desktop"
        style={{ overflow: isCloudy ? undefined : "hidden" }}
      >
        <WeatherBackground desc={forecast[selectedDay]?.desc || ""}>
          <WeatherAnimations weatherDesc={forecast[selectedDay]?.desc || ""} />
        </WeatherBackground>
        {forecast[selectedDay] && dateString && (
          <WeatherText
            desc={forecast[selectedDay].desc}
            temp={forecast[selectedDay].max}
            city={city}
            date={dateString}
            hot={/showers|hot|very hot|heat|accent-red|drizzle/i.test(
              forecast[selectedDay].desc
            )}
          />
        )}
      </div>
      {/* Right: Forecast */}
      <div className="weather-right-panel-desktop">
        {/* Always show the status label to avoid layout shift */}
        <WeatherStatus
          isCached={isCached}
          isPreloading={isPreloading}
          stale={stale}
        />
        {renderForecastBlock(
          forecast,
          error,
          isPreloading,
          selectedDay,
          setSelectedDay,
          weatherColors
        )}
      </div>
    </WidgetBase>
  );
}
