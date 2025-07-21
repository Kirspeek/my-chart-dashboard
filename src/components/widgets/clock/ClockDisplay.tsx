"use client";

import React from "react";
import WidgetButton from "../../common/WidgetButton";
import { useTheme } from "src/hooks/useTheme";

interface ClockDisplayProps {
  mainTime: Date;
  is24h: boolean;
  dateStr: string;
  pad: (n: number) => string;
  setIs24h: (is24h: boolean) => void;
}

export default function ClockDisplay({
  mainTime,
  is24h,
  dateStr,
  pad,
  setIs24h,
}: ClockDisplayProps) {
  const { accent } = useTheme();
  const clockAccentColor = accent.red; // Use red for clock widget

  const hours = mainTime.getHours();
  const minutes = mainTime.getMinutes();
  const seconds = mainTime.getSeconds();
  const displayHours = is24h ? hours : hours % 12 || 12;

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <div
        className="font-mono font-extrabold"
        style={{
          fontSize: "6rem",
          color: "var(--theme-text)", // theme primary text color
          letterSpacing: "0.04em",
          lineHeight: 1,
          textAlign: "center",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {pad(displayHours)}
        <span style={{ color: "#888" }}>:</span> {/* light theme secondary */}
        {pad(minutes)}
        <span style={{ color: "#888" }}>:</span> {/* light theme secondary */}
        <span style={{ color: "#888" }}>{pad(seconds)}</span>
      </div>
      <div className="flex items-center gap-4 mt-2">
        <span
          className="text-base font-mono text-gray-light"
          style={{ color: "#b0b0a8", fontWeight: 700 }} // light theme muted
        >
          {dateStr}
        </span>
        <span
          className="text-xs font-mono px-2 py-1 rounded-full border"
          style={{
            borderColor: clockAccentColor,
            color: clockAccentColor,
            fontWeight: 700,
            marginLeft: 8,
          }}
        >
          {/* Placeholder for sunrise/sunset */}
          Sun: 07:12 - 17:17
        </span>
        <div className="flex gap-2 ml-4">
          <WidgetButton
            className={`text-xs font-mono px-3 py-1 rounded-full border transition font-bold`}
            style={{
              fontFamily: "var(--font-mono)",
              fontWeight: 700,
              borderColor: is24h ? "#888" : clockAccentColor,
              color: is24h ? "#888" : clockAccentColor,
              backgroundColor: is24h ? "transparent" : `${clockAccentColor}1a`,
            }}
            onClick={() => setIs24h(false)}
          >
            12h
          </WidgetButton>
          <WidgetButton
            className={`text-xs font-mono px-3 py-1 rounded-full border transition font-bold`}
            style={{
              fontFamily: "var(--font-mono)",
              fontWeight: 700,
              borderColor: is24h ? clockAccentColor : "#888",
              color: is24h ? clockAccentColor : "#888",
              backgroundColor: is24h ? `${clockAccentColor}1a` : "transparent",
            }}
            onClick={() => setIs24h(true)}
          >
            24h
          </WidgetButton>
        </div>
      </div>
    </div>
  );
}
