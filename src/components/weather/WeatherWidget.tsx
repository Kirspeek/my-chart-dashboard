"use client";

import React, { useState, useEffect, CSSProperties } from "react";
import CloudAnimation from "../animations/CloudAnimation";
import RainAnimation from "../animations/RainAnimation";
import WeatherBackground from "./WeatherBackground";
import WeatherText from "./WeatherText";
import ForecastDay from "./ForecastDay";
import SunAnimation from "../animations/SunAnimation";
import HotAnimation from "../animations/HotAnimation";
import Lightning from "../animations/Lightning";
import { WeatherWidgetProps } from "../../../interfaces/widgets";
import WidgetBase from "../common/WidgetBase";
import { useWeather } from "../../hooks";

export default function WeatherWidget({
  city = "Amsterdam",
}: WeatherWidgetProps) {
  const { forecast, loading, error, isCached, isPreloading } = useWeather(city);
  const [selectedDay, setSelectedDay] = useState(0); // 0 = today by default
  const [dateString, setDateString] = useState("");

  useEffect(() => {
    if (forecast[selectedDay]) {
      const today = new Date();
      const date = new Date(today);
      date.setDate(today.getDate() + selectedDay);
      setDateString(
        date.toLocaleDateString("en-GB", {
          weekday: "long",
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      );
    }
  }, [forecast, selectedDay]);

  const isCloudy = /cloudy|partly cloudy/i.test(
    forecast[selectedDay]?.desc || ""
  );
  const leftPanelStyle: CSSProperties = {
    flex: 1,
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
    height: "100%",
    overflow: isCloudy ? undefined : "hidden",
  };

  return (
    <WidgetBase
      style={{
        maxWidth: 480,
        padding: 0,
        boxShadow: "none",
      }}
      className="flex flex-row"
    >
      {/* Left: Current weather */}
      <div style={leftPanelStyle}>
        <WeatherBackground desc={forecast[selectedDay]?.desc || ""}>
          {/* Weather-specific animations */}
          {forecast[selectedDay] &&
            /showers|hot|very hot|heat|accent-red|drizzle/i.test(
              forecast[selectedDay].desc
            ) && (
              <div
                style={{
                  position: "absolute",
                  right: 24,
                  top: 12,
                  zIndex: 2,
                  width: 90,
                  height: 140,
                  pointerEvents: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <HotAnimation />
              </div>
            )}
          {forecast[selectedDay] &&
            /clear sky|sunny/i.test(forecast[selectedDay].desc) && (
              <SunAnimation />
            )}
          {forecast[selectedDay] &&
            /partly cloudy/i.test(forecast[selectedDay].desc) && (
              <CloudAnimation />
            )}
          {forecast[selectedDay] &&
            /rain/i.test(forecast[selectedDay].desc) && <RainAnimation />}
          {forecast[selectedDay] &&
            /thunderstorm/i.test(forecast[selectedDay].desc) && <Lightning />}
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
          flex: 2,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          borderTopRightRadius: "2rem",
          borderBottomRightRadius: "2rem",
          padding: "1.5rem 1.2rem 1.5rem 1.2rem",
        }}
      >
        {forecast.length === 0 && loading ? (
          <div style={{ color: "var(--color-gray)", fontSize: 18 }}>
            {isPreloading ? "Preloading..." : "Loading..."}
          </div>
        ) : forecast.length === 0 && error ? (
          <div style={{ color: "red", fontSize: 18 }}>{error}</div>
        ) : (
          <div className="flex flex-col gap-3 w-full items-center justify-center">
            {/* Cache indicator */}
            {isCached && (
              <div
                style={{
                  fontSize: 12,
                  color: "var(--color-gray)",
                  opacity: 0.7,
                  marginBottom: 4,
                }}
              >
                ⚡ Instant
              </div>
            )}
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
