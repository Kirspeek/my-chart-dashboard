"use client";

import React, { useState, useEffect, CSSProperties } from "react";
import CloudAnimation from "./CloudAnimation";
import RainAnimation from "./RainAnimation";

// Import new subcomponents
import WeatherBackground from "./WeatherBackground";
import WeatherText from "./WeatherText";
import ForecastDay from "./ForecastDay";
import SunAnimation from "./SunAnimation";
import HotAnimation from "./HotAnimation";
import Lightning from "./Lightning";
import {
  WeatherWidgetProps,
  ForecastDay as ForecastDayType,
} from "../../../interfaces/widgets";

function getWeatherIcon(desc: string): string {
  if (/clear/i.test(desc)) return "☀️";
  if (/cloud/i.test(desc)) return "🌤️";
  if (/rain/i.test(desc)) return "🌧️";
  if (/storm|thunder/i.test(desc)) return "⛈️";
  if (/snow/i.test(desc)) return "❄️";
  return "🌡️";
}

async function geocodeCity(
  city: string
): Promise<{ lat: number; lon: number } | null> {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;
  const res = await fetch(url);
  const data = await res.json();
  if (data && data.results && data.results.length > 0) {
    return { lat: data.results[0].latitude, lon: data.results[0].longitude };
  }
  return null;
}

export default function WeatherWidget({
  city = "Amsterdam",
}: WeatherWidgetProps) {
  const [forecast, setForecast] = useState<ForecastDayType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState(0); // 0 = today by default
  const [dateString, setDateString] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function fetchWeather() {
      setLoading(true);
      setError(null);
      setForecast([]);
      // 1. Geocode city
      const coords = await geocodeCity(city);
      if (!coords) {
        if (!cancelled) {
          setError("City not found");
          setLoading(false);
        }
        return;
      }
      const { lat, lon } = coords;
      // 2. Fetch current weather and forecast from Open-Meteo
      try {
        // Current weather
        const weatherRes = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto`
        );
        const weatherData = await weatherRes.json();
        // No need to process current_weather for main box, handled by forecast
        // Parse 5-day forecast
        if (weatherData.daily) {
          const days: ForecastDayType[] = [];
          for (let i = 0; i < Math.min(5, weatherData.daily.time.length); i++) {
            const date = new Date(weatherData.daily.time[i]);
            const day = date.toLocaleDateString(undefined, {
              weekday: "short",
            });
            const min = Math.round(weatherData.daily.temperature_2m_min[i]);
            const max = Math.round(weatherData.daily.temperature_2m_max[i]);
            const code = weatherData.daily.weathercode[i];
            const desc = getOpenMeteoDesc(code);
            days.push({
              day,
              icon: getWeatherIcon(desc),
              min,
              max,
              desc,
            });
          }
          setForecast(days);
        }
        setLoading(false);
      } catch {
        if (!cancelled) {
          setError("Weather fetch error");
          setLoading(false);
        }
      }
    }
    fetchWeather();
    return () => {
      cancelled = true;
    };
  }, [city]);

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

  function getOpenMeteoDesc(code: number): string {
    // See https://open-meteo.com/en/docs#api_form for weathercode meanings
    if (code === 0) return "Clear sky";
    if (code === 1 || code === 2 || code === 3) return "Partly cloudy";
    if (code === 45 || code === 48) return "Fog";
    if (code === 51 || code === 53 || code === 55) return "Drizzle";
    if (code === 61 || code === 63 || code === 65) return "Rain";
    if (code === 71 || code === 73 || code === 75) return "Snow";
    if (code === 80 || code === 81 || code === 82) return "Showers";
    if (code === 95) return "Thunderstorm";
    if (code === 96 || code === 99) return "Thunderstorm with hail";
    return "Unknown";
  }

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
  };

  return (
    <div
      className="flex flex-row"
      style={{
        maxWidth: 480,
        color: "var(--color-black)",
        overflow: "hidden",
      }}
    >
      {/* Left: Current weather */}
      <div
        style={{
          ...leftPanelStyle,
          background: "transparent",
          position: "relative",
          overflow: "hidden",
        }}
      >
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
          background: "var(--color-bg-card)",
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
            Loading...
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
    </div>
  );
}
