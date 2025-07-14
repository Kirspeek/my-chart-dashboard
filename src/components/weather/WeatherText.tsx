import React from "react";
import { WeatherTextProps } from "../../../interfaces/widgets";

export default function WeatherText({
  desc,
  temp,
  city,
  date,
  hot = false,
  children,
}: WeatherTextProps) {
  let mainColor = "#232323"; // light theme black
  let secondaryColor = "#b0b0a8"; // light theme gray-light

  if (hot) {
    mainColor = "#fff"; // white for hot weather
    secondaryColor = "#fff"; // white for hot weather
  } else if (/clear sky/i.test(desc)) {
    mainColor = "#ea7a00"; // light theme orange
    secondaryColor = "#ea7a00"; // light theme orange
  } else if (/sunny/i.test(desc)) {
    mainColor = "#ea7a00"; // light theme orange
    secondaryColor = "#ea7a00"; // light theme orange
  } else if (/partly cloudy/i.test(desc)) {
    mainColor = "#23405c"; // light theme blue
    secondaryColor = "#23405c"; // light theme blue
  } else if (/cloudy/i.test(desc)) {
    mainColor = "#425b59"; // light theme teal
    secondaryColor = "#425b59"; // light theme teal
  } else if (/rain/i.test(desc)) {
    mainColor = "#23405c"; // light theme blue
    secondaryColor = "#23405c"; // light theme blue
  } else if (/showers/i.test(desc)) {
    mainColor = "#23405c"; // light theme blue
    secondaryColor = "#23405c"; // light theme blue
  } else if (/drizzle/i.test(desc)) {
    mainColor = "#23405c"; // light theme blue
    secondaryColor = "#23405c"; // light theme blue
  } else if (/snow/i.test(desc)) {
    mainColor = "#425b59"; // light theme teal
    secondaryColor = "#425b59"; // light theme teal
  } else if (/fog/i.test(desc)) {
    mainColor = "#888"; // light theme gray
    secondaryColor = "#888"; // light theme gray
  } else if (/thunderstorm/i.test(desc)) {
    mainColor = "#fffbe7"; // white-barely yellow for thunderstorm
    secondaryColor = "#fffbe7"; // white-barely yellow for thunderstorm
  } else if (/cold/i.test(desc)) {
    mainColor = "#23405c"; // light theme blue
    secondaryColor = "#23405c"; // light theme blue
  }

  return (
    <div style={{ position: "relative", zIndex: 1, width: "100%" }}>
      <span
        style={{
          fontWeight: 700,
          fontSize: 44,
          fontFamily: "var(--font-mono)",
          color: mainColor,
          margin: "12px 0 0 0",
          display: "block",
          marginLeft: 0,
        }}
      >
        {temp}°
      </span>
      <span
        style={{
          fontStyle: "italic",
          fontWeight: 400,
          fontSize: 16,
          fontFamily: "var(--font-mono)",
          color: secondaryColor,
          margin: "8px 0 0 0",
          display: "block",
          marginLeft: 0,
        }}
      >
        {desc}
      </span>
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontWeight: 700,
          fontSize: 24,
          color: mainColor,
          margin: "18px 0 0 0",
          display: "block",
          marginLeft: 0,
        }}
      >
        {city}
      </span>
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontWeight: 700,
          fontSize: 18,
          color: secondaryColor,
          letterSpacing: "0.01em",
          margin: "10px 0 0 0",
          display: "block",
          lineHeight: 1.2,
          marginLeft: 0,
        }}
      >
        {date}
      </span>
      {children}
    </div>
  );
}
