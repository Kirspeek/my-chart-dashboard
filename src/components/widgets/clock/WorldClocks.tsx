"use client";

import React from "react";
import Button3D from "../../common/3DButton";
import type { TimeZone } from "../../../../interfaces/widgets";

interface WorldClocksProps {
  timeZones: TimeZone[];
  selectedZone: string;
  setSelectedZone: (zone: string) => void;
  mounted: boolean;
  is24h: boolean;
  pad: (n: number) => string;
  getTimeInZone: (zone: string) => Date;
  isDay: (hours: number) => boolean;
}

export default function WorldClocks({
  timeZones,
  selectedZone,
  setSelectedZone,
  mounted,
  is24h,
  pad,
  getTimeInZone,
  isDay,
}: WorldClocksProps) {
  return (
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
            <Button3D
              key={tz.zone}
              selected={isLocal}
              onClick={() => setSelectedZone(tz.zone)}
            >
              <span
                className="text-base font-bold mono mb-1"
                style={{
                  color: isLocal ? "#fff" : "#232323",
                }}
              >
                {tz.label}
              </span>
              <span
                className="text-xs font-mono mb-2"
                style={{
                  color: isLocal ? "#fff" : "#888",
                }}
              >
                {tz.utc}
              </span>
              <span
                className="text-4xl font-mono font-extrabold mono mb-1"
                style={{
                  color: isLocal ? "#fff" : "#232323",
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
            </Button3D>
          );
        })}
      </div>
    </div>
  );
}
