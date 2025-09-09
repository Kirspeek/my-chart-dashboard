"use client";

import React from "react";
import Button3D from "../../common/3DButton";
import { useTheme } from "@/hooks/useTheme";
import { MapPin, Clock, Globe } from "lucide-react";
import type { WorldClocksProps } from "@/interfaces/widgets";

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
  const { colorsTheme } = useTheme();
  const clockColors = colorsTheme.widgets.clock;

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
        .world-clock-card {
          transition: all 0.3s ease;
          position: relative;
        }
        .world-clock-card:hover {
          transform: translateY(-2px);
        }
        .time-display {
          transition: all 0.3s ease;
        }
        .time-display:hover {
          transform: scale(1.05);
        }
        .city-name {
          transition: all 0.3s ease;
        }
        .city-name:hover {
          transform: translateX(2px);
        }
      `}</style>

      <div className="flex items-center gap-2 mb-3 opacity-70">
        <Globe className="w-4 h-4" style={{ color: clockColors.accentColor }} />
        <span
          className="text-xs font-mono"
          style={{ color: "var(--secondary-text)" }}
        >
          World Clocks
        </span>
      </div>

      <div
        className={`grid grid-cols-2 gap-2 justify-center w-full ${
          isMobile ? "px-25" : isViewportAtLeast1440 ? "px-18" : ""
        }`}
      >
        {timeZones.map((tz) => {
          const t = mounted ? getTimeInZone(tz.zone) : new Date(0);
          const h = t.getHours();
          const m = t.getMinutes();
          const isLocal = tz.zone === selectedZone;
          const isDayTime = isDay(h);

          return (
            <div key={tz.zone} className="world-clock-card">
              <Button3D
                selected={isLocal}
                onClick={() => setSelectedZone(tz.zone)}
                customAccentColor={clockColors.accentColor}
                className="world-clock-card-mobile"
                style={
                  isMobile
                    ? undefined
                    : isViewportAtLeast1440
                      ? {
                          padding: "1rem 1.25rem",
                          minWidth: 150,
                          minHeight: 90,
                        }
                      : { padding: "1rem 0.5rem", minWidth: 0, minHeight: 20 }
                }
              >
                <div className="flex items-center gap-1 mb-1">
                  <MapPin
                    className="w-3 h-3 city-name"
                    style={{
                      color: isLocal ? "#fff" : "var(--secondary-text)",
                      opacity: 0.7,
                    }}
                  />
                  <span
                    className="text-base font-bold mono world-clock-city-mobile primary-text city-name"
                    style={{
                      color: isLocal ? "#fff" : "var(--secondary-text)",
                    }}
                  >
                    {tz.label}
                  </span>
                </div>

                <span
                  className="text-xs font-mono mb-2 world-clock-utc-mobile secondary-text"
                  style={{
                    color: isLocal ? "#fff" : "var(--secondary-text)",
                    opacity: 0.8,
                  }}
                >
                  {tz.utc}
                </span>

                <div className="flex items-center gap-1">
                  <Clock
                    className="w-3 h-3"
                    style={{
                      color: isLocal ? "#fff" : "var(--secondary-text)",
                      opacity: 0.7,
                    }}
                  />
                  <span
                    className="text-lg font-bold mono wc-time-desktop  time-display"
                    style={{
                      color: isLocal ? "#fff" : "var(--secondary-text)",
                    }}
                  >
                    {pad(h)}:{pad(m)}
                  </span>
                </div>

                <div className="flex items-center gap-1 mt-1">
                  <span
                    className="text-xs font-mono secondary-text"
                    style={{
                      color: isLocal ? "#fff" : "var(--secondary-text)",
                      opacity: 0.8,
                    }}
                  >
                    {isDayTime ? "Day" : "Night"}
                  </span>
                  <span
                    className="text-xs transition-transform duration-300"
                    style={{
                      color: isLocal ? "#fff" : "var(--secondary-text)",
                      transform: "scale(1)",
                    }}
                  >
                    {isDayTime ? "☀️" : "🌙"}
                  </span>
                </div>
              </Button3D>
            </div>
          );
        })}
      </div>
    </div>
  );
}
