"use client";

import { useEffect, useState, useMemo } from "react";
import WidgetCard from "../../common/WidgetCard";
import { ClockWidgetProps } from "../../../../interfaces/widgets";

const timeZones = [
  { label: "New York", zone: "America/New_York", utc: "UTC-5" },
  { label: "London", zone: "Europe/London", utc: "UTC+0" },
  { label: "Rome", zone: "Europe/Rome", utc: "UTC+1" },
  { label: "Kyiv", zone: "Europe/Kyiv", utc: "UTC+2" },
];

function getTimeInZone(zone: string) {
  return new Date(new Date().toLocaleString("en-US", { timeZone: zone }));
}

function isDay(hours: number) {
  return hours >= 6 && hours < 18;
}

export default function ClockWidget({
  selectedZone,
  setSelectedZone,
}: ClockWidgetProps) {
  const [mounted, setMounted] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [tick, setTick] = useState(0); // Used to force re-render every second
  const [is24h, setIs24h] = useState(true);
  const [dateStr, setDateStr] = useState("");

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  // Calculate time only when mounted to prevent hydration mismatch
  const mainTime = useMemo(() => {
    return mounted ? getTimeInZone(selectedZone) : new Date(0);
  }, [mounted, selectedZone, tick]);

  const hours = mainTime.getHours();
  const minutes = mainTime.getMinutes();
  const seconds = mainTime.getSeconds();
  const displayHours = is24h ? hours : hours % 12 || 12;
  const pad = (n: number) => n.toString().padStart(2, "0");

  useEffect(() => {
    if (mounted) {
      setDateStr(
        mainTime.toLocaleDateString(undefined, {
          weekday: "long",
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      );
    }
  }, [mainTime, mounted]);

  // Don't render anything until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <WidgetCard
        className="widget flex flex-col gap-8"
        variant="large"
        style={{
          width: "100%",
          minWidth: 600,
          minHeight: 480,
          maxWidth: 800,
          padding: "2.5rem 2.5rem",
        }}
      >
        <div className="w-full flex flex-col items-center justify-center">
          <div
            className="font-mono font-extrabold"
            style={{
              fontSize: "6rem",
              color: "#232323", // light theme primary
              letterSpacing: "0.04em",
              lineHeight: 1,
              textAlign: "center",
            }}
          >
            --:--:--
          </div>
        </div>
      </WidgetCard>
    );
  }

  return (
    <WidgetCard
      className="widget flex flex-col gap-8"
      variant="large"
      style={{
        width: "100%",
        minWidth: 600,
        minHeight: 480,
        maxWidth: 800,
        padding: "2.5rem 2.5rem",
      }}
    >
      {/* Large digital clock */}
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
              borderColor: "#ea4300", // light theme accent red
              color: "#ea4300", // light theme accent red
              fontWeight: 700,
              marginLeft: 8,
            }}
          >
            {/* Placeholder for sunrise/sunset */}
            Sun: 07:12 - 17:17
          </span>
          <div className="flex gap-2 ml-4">
            <button
              className="text-xs font-mono px-3 py-1 rounded-full border"
              style={{
                borderColor: is24h
                  ? "#b0b0a8" // light theme muted
                  : "#ea4300", // light theme accent red
                color: is24h
                  ? "#b0b0a8" // light theme muted
                  : "#ea4300", // light theme accent red
                background: is24h ? "transparent" : "rgba(234, 67, 0, 0.1)", // light theme red with opacity
                fontWeight: 700,
              }}
              onClick={() => setIs24h(false)}
            >
              12h
            </button>
            <button
              className="text-xs font-mono px-3 py-1 rounded-full border"
              style={{
                borderColor: is24h
                  ? "#ea4300" // light theme accent red
                  : "#b0b0a8", // light theme muted
                color: is24h
                  ? "#ea4300" // light theme accent red
                  : "#b0b0a8", // light theme muted
                background: is24h ? "rgba(234, 67, 0, 0.1)" : "transparent", // light theme red with opacity
                fontWeight: 700,
              }}
              onClick={() => setIs24h(true)}
            >
              24h
            </button>
          </div>
        </div>
      </div>
      {/* World clocks */}
      <div className="w-full flex flex-col gap-6 mt-4">
        <div className="flex flex-wrap gap-4 justify-center">
          {timeZones.map((tz) => {
            // Only calculate time when mounted to prevent hydration mismatch
            const t = mounted ? getTimeInZone(tz.zone) : new Date(0);
            const h = t.getHours();
            const m = t.getMinutes();
            const isLocal = tz.zone === selectedZone;
            const isDayTime = isDay(h);
            return (
              <div
                key={tz.zone}
                className="flex flex-col items-center justify-center px-8 py-6"
                style={{
                  background: isLocal ? "#ea4300" : "rgba(255,255,255,0.04)", // slightly lighter transparent bg for dark theme
                  borderRadius: "1.5rem",
                  minWidth: 180,
                  minHeight: 110,
                  border: isLocal ? `2px solid #ea4300` : "none", // no border for non-selected
                  color: isLocal ? "#fff" : "var(--theme-text)",
                  transition: "all 0.2s",
                  cursor: "pointer",
                }}
                onClick={() => setSelectedZone(tz.zone)}
              >
                <span
                  className="text-base font-bold mono mb-1"
                  style={{
                    color: isLocal ? "#fff" : "var(--theme-text)", // theme primary text color
                  }}
                >
                  {tz.label}
                </span>
                <span
                  className="text-xs font-mono mb-2"
                  style={{
                    color: isLocal ? "#fff" : "#888", // light theme secondary
                  }}
                >
                  {tz.utc}
                </span>
                <span
                  className="text-4xl font-mono font-extrabold mono mb-1"
                  style={{
                    color: isLocal ? "#fff" : "var(--theme-text)", // theme primary text color
                    letterSpacing: "0.04em",
                    lineHeight: 1.1,
                  }}
                >
                  {mounted
                    ? `${pad(is24h ? h : h % 12 || 12)}:${pad(m)}`
                    : "--:--"}
                </span>
                <span
                  className="text-xs font-mono"
                  style={{
                    color: isLocal ? "#fff" : isDayTime ? "#f6c700" : "#888",
                  }}
                >
                  {mounted ? (isDayTime ? "☀️ Day" : "🌙 Night") : "--"}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </WidgetCard>
  );
}
