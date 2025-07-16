"use client";

import React, { CSSProperties } from "react";
import WeatherBackground from "./WeatherBackground";
import WeatherText from "./WeatherText";
import ForecastDay from "./ForecastDay";
import { WeatherWidgetProps } from "../../../interfaces/widgets";
import WidgetBase from "../common/WidgetBase";
import { useWeatherLogic } from "../../hooks/useWeatherLogic";
import WeatherAnimations from "./WeatherAnimations";
import WeatherStatus from "./WeatherStatus";

export default function WeatherWidget({
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

  const leftPanelStyle: CSSProperties = {
    flex: 1.3,
    minWidth: 220,
    maxWidth: 320,
    display: "flex",
    flexDirection: "column" as CSSProperties["flexDirection"],
    justifyContent: "center" as CSSProperties["justifyContent"],
    alignItems: "flex-start" as CSSProperties["alignItems"],
    borderTopLeftRadius: "2rem",
    borderBottomLeftRadius: "2rem",
    padding: "2.2rem 2.2rem 2.2rem 3.2rem",
    position: "relative",
    textAlign: "left",
    background: "transparent",
    width: "100%",
    minHeight: 0,
    height: "100%",
    alignSelf: "stretch",
    overflow: isCloudy ? undefined : "hidden",
  };

  return (
    <WidgetBase
      style={{
        width: "100%",
        padding: 0,
        display: "flex",
        flexDirection: "row",
        alignItems: "stretch",
        minHeight: 0,
        height: "100%",
      }}
    >
      {/* Left: Current weather */}
      <div style={leftPanelStyle}>
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
      <div
        style={{
          flex: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          borderTopRightRadius: "2rem",
          borderBottomRightRadius: "2rem",
          padding: "1.5rem 1.2rem 1.5rem 1.2rem",
          minHeight: 0,
          height: "100%",
        }}
      >
        {/* Always show the status label to avoid layout shift */}
        <WeatherStatus
          isCached={isCached}
          isPreloading={isPreloading}
          stale={stale}
        />
        {forecast.length === 0 && !error ? (
          <div style={{ color: "var(--color-gray)", fontSize: 18 }}>
            {isPreloading ? "Preloading..." : "Loading..."}
          </div>
        ) : forecast.length === 0 && error ? (
          <div style={{ color: "red", fontSize: 18 }}>{error}</div>
        ) : (
          <div className="flex flex-col gap-3 w-full items-center justify-center">
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
        )}
      </div>
    </WidgetBase>
  );
}
