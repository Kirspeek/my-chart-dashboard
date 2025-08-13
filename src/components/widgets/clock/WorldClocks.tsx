"use client";

import React from "react";
import Button3D from "../../common/3DButton";
import { useTheme } from "src/hooks/useTheme";

interface WorldClocksProps {
  timeZones: Array<{ zone: string; label: string; utc: string }>;
  selectedZone: string;
  setSelectedZone: (zone: string) => void;
  mounted: boolean;
  pad: (n: number) => string;
  getTimeInZone: (zone: string) => Date;
  isDay: (hours: number) => boolean;
  isMobile?: boolean;
}

export default function WorldClocks({
  timeZones,
  selectedZone,
  setSelectedZone,
  mounted,
  pad,
  getTimeInZone,
  isDay,
  isMobile = false,
}: WorldClocksProps) {
  const { accent } = useTheme();
  const clockAccentColor = accent.red;

  // Check if viewport is at least 1440px wide
  const [isViewportAtLeast1440, setIsViewportAtLeast1440] =
    React.useState(false);

  React.useEffect(() => {
    const checkViewport = () => {
      setIsViewportAtLeast1440(window.innerWidth >= 1440);
    };
    checkViewport();
    window.addEventListener("resize", checkViewport);
    return () => window.removeEventListener("resize", checkViewport);
  }, []);

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <style jsx>{`
        @media (min-width: 1024px) and (max-width: 1440px) {
          .wc-time-desktop {
            font-size: 1.75rem !important;
          }
        }
      `}</style>
      <div
        className={`grid grid-cols-2 gap-2 justify-center w-full ${
          isMobile ? "px-25" : isViewportAtLeast1440 ? "px-18" : ""
        }`}
      >
        {timeZones.map((tz) => {
          // Only calculate time when mounted to prevent hydration mismatch
          const t = mounted ? getTimeInZone(tz.zone) : new Date(0);
          const h = t.getHours();
          const m = t.getMinutes();
          const isLocal = tz.zone === selectedZone;
          const isDayTime = isDay(h);
          return (
            <Button3D
              key={tz.zone}
              selected={isLocal}
              onClick={() => setSelectedZone(tz.zone)}
              customAccentColor={clockAccentColor}
              className="world-clock-card-mobile"
              style={
                isMobile
                  ? undefined
                  : isViewportAtLeast1440
                    ? { padding: "1rem 1.25rem", minWidth: 150, minHeight: 90 }
                    : { padding: "1rem 0.5rem", minWidth: 0, minHeight: 20 }
              }
            >
              <span
                className="text-base font-bold mono mb-1 world-clock-city-mobile primary-text"
                style={{
                  color: isLocal ? "#fff" : "var(--primary-text)",
                }}
              >
                {tz.label}
              </span>
              <span
                className="text-xs font-mono mb-2 world-clock-utc-mobile secondary-text"
                style={{
                  color: isLocal ? "#fff" : "var(--secondary-text)",
                }}
              >
                {tz.utc}
              </span>
              <span
                className="text-lg font-bold mono wc-time-desktop primary-text"
                style={{
                  color: isLocal ? "#fff" : "var(--primary-text)",
                }}
              >
                {pad(h)}:{pad(m)}
              </span>
              <div className="flex items-center gap-1 mt-1">
                <span
                  className="text-xs font-mono secondary-text"
                  style={{
                    color: isLocal ? "#fff" : "var(--secondary-text)",
                  }}
                >
                  {isDayTime ? "Day" : "Night"}
                </span>
                <span
                  className="text-xs"
                  style={{
                    color: isLocal ? "#fff" : "var(--secondary-text)",
                  }}
                >
                  {isDayTime ? "☀️" : "🌙"}
                </span>
              </div>
            </Button3D>
          );
        })}
      </div>
    </div>
  );
}
