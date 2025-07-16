import React from "react";
import { WeatherBackgroundProps } from "../../../interfaces/widgets";

export default function WeatherBackground({
  desc,
  children,
}: WeatherBackgroundProps) {
  // Always use the blue gradient for partly cloudy and cloudy
  if (/partly cloudy|cloudy/i.test(desc)) {
    return (
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(135deg, #e3f0ff 0%, #b3d8f7 100%)",
          borderTopLeftRadius: "2.5rem",
          borderBottomLeftRadius: "2.5rem",
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0,
          zIndex: 0,
        }}
      >
        {children}
      </div>
    );
  }
  // Thunderstorm uses the rain gradient
  if (/thunderstorm/i.test(desc)) {
    return (
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to bottom, #3a7ca5 0%, #4a90c2 100%)",
          borderTopLeftRadius: "2.5rem",
          borderBottomLeftRadius: "2.5rem",
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0,
          zIndex: 0,
        }}
      >
        {children}
      </div>
    );
  }

  let background = "linear-gradient(135deg, #e0e0e0 0%, #b0b0a8 100%)"; // default
  if (/clear sky/i.test(desc)) {
    background = "linear-gradient(135deg, #ffe88a 0%, #ffd34d 100%)"; // clear
  } else if (/sunny/i.test(desc)) {
    background = "linear-gradient(135deg, #ffe88a 0%, #ffd34d 100%)"; // sunny
  } else if (/rain/i.test(desc)) {
    background = "linear-gradient(to bottom, #3a7ca5 0%, #4a90c2 100%)"; // rain
  } else if (/showers/i.test(desc)) {
    background = "linear-gradient(165deg, #ff512f 0%, #ffb347 100%)"; // showers
  } else if (/drizzle/i.test(desc)) {
    background = "linear-gradient(165deg, #ff512f 0%, #ffb347 100%)"; // drizzle
  } else if (/snow/i.test(desc)) {
    background = "linear-gradient(135deg, #f8fafc 0%, #e0e0e0 100%)"; // snow
  } else if (/fog/i.test(desc)) {
    background = "linear-gradient(135deg, #dbe6ef 0%, #b0b0a8 100%)"; // fog
  } else if (/hot|very hot|heat|accent-red/i.test(desc)) {
    background = "linear-gradient(165deg, #ff512f 0%, #ffb347 100%)"; // hot
  } else if (/cold/i.test(desc)) {
    background = "linear-gradient(135deg, #b3d8f7 0%, #425b59 100%)"; // cold
  }
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background,
        borderTopLeftRadius: "2.5rem",
        borderBottomLeftRadius: "2.5rem",
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
        zIndex: 0,
      }}
    >
      {children}
    </div>
  );
}
