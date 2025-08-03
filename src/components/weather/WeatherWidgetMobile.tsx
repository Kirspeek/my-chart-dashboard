"use client";

import React from "react";
import WeatherBackgroundMobile from "./WeatherBackgroundMobile";
import WeatherText from "./WeatherText";
import ForecastDayMobile from "./ForecastDayMobile";
import { WeatherWidgetProps } from "../../../interfaces/widgets";
import WidgetBase from "../common/WidgetBase";
import { useWeatherLogic } from "@/hooks/useWeatherLogic";
import WeatherAnimations from "./WeatherAnimations";
import WeatherStatus from "./WeatherStatus";
import type { ForecastDay as ForecastDayType } from "../../../interfaces/widgets";
import "../../styles/weather.css";
import "../../styles/mobile.css";

function renderForecastBlock(
  forecast: ForecastDayType[],
  error: string | null,
  isPreloading: boolean,
  selectedDay: number,
  setSelectedDay: (i: number) => void
) {
  if (forecast.length === 0 && !error) {
    return (
      <div style={{ color: "var(--color-gray)", fontSize: 18 }}>
        {isPreloading ? "Preloading..." : "Loading..."}
      </div>
    );
  }
  if (forecast.length === 0 && error) {
    return <div style={{ color: "red", fontSize: 18 }}>{error}</div>;
  }
  return (
    <div className="weather-forecast-mobile">
      {forecast.map((f, i) => (
        <ForecastDayMobile
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

export default function WeatherWidgetMobile({
  city = "Amsterdam",
}: WeatherWidgetProps) {
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
    <WidgetBase className="weather-widget-mobile">
      {/* Top: Current weather */}
      <div
        className="weather-left-panel-mobile"
        style={{ overflow: isCloudy ? undefined : "hidden" }}
      >
        <WeatherBackgroundMobile desc={forecast[selectedDay]?.desc || ""}>
          <WeatherAnimations weatherDesc={forecast[selectedDay]?.desc || ""} />
        </WeatherBackgroundMobile>
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
      {/* Bottom: Forecast */}
      <div className="weather-right-panel-mobile">
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
          setSelectedDay
        )}
      </div>
    </WidgetBase>
  );
}
