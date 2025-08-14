"use client";

import React, { useState, useEffect, useRef } from "react";
import WidgetButton from "../../common/WidgetButton";
import { useTheme } from "src/hooks/useTheme";
import { Sun, Moon, Calendar } from "lucide-react";

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
  const clockAccentColor = accent.red;
  const [isHovered, setIsHovered] = useState(false);
  const [showSeconds, setShowSeconds] = useState(true);
  const [secondsChanged, setSecondsChanged] = useState(false);
  const prevSecondsRef = useRef<number>(0);

  const hours = mainTime.getHours();
  const minutes = mainTime.getMinutes();
  const seconds = mainTime.getSeconds();
  const displayHours = is24h ? hours : hours % 12 || 12;
  const isDayTime = hours >= 6 && hours < 18;

  // Detect when seconds change and trigger animation
  useEffect(() => {
    if (prevSecondsRef.current !== seconds) {
      setSecondsChanged(true);
      const timer = setTimeout(() => setSecondsChanged(false), 200);
      prevSecondsRef.current = seconds;
      return () => clearTimeout(timer);
    }
  }, [seconds]);

  // Auto-hide seconds after 3 seconds of inactivity
  useEffect(() => {
    const timer = setTimeout(() => setShowSeconds(false), 3000);
    return () => clearTimeout(timer);
  }, [seconds]);

  // Show seconds on hover
  const handleMouseEnter = () => {
    setIsHovered(true);
    setShowSeconds(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTimeout(() => setShowSeconds(false), 1000);
  };

  return (
    <div
      className="w-full flex flex-col items-center justify-center"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <style jsx>{`
        @media (min-width: 1024px) {
          .clock-main-size {
            font-size: clamp(3.5rem, 5.5vw, 6rem);
          }
        }
        .clock-colon {
          animation: blink 1s infinite;
        }
        @keyframes blink {
          0%,
          50% {
            opacity: 1;
          }
          51%,
          100% {
            opacity: 1;
          }
        }
        .time-segment {
          transition: all 0.3s ease;
        }
        .time-segment:hover {
          transform: scale(1.05);
          color: ${clockAccentColor} !important;
        }
        .seconds-segment {
          transition: all 0.2s ease;
        }
        .seconds-segment.changed {
          animation: secondsFade 0.2s ease-out;
        }
        @keyframes secondsFade {
          0% {
            opacity: 1;
          }
          100% {
            opacity: 1;
          }
        }
        .date-display {
          transition: all 0.3s ease;
        }
        .date-display:hover {
          transform: translateY(-2px);
        }
      `}</style>

      {/* Time Display */}
      <div
        className="font-mono font-extrabold clock-display-mobile clock-main-size clock-time"
        style={{
          letterSpacing: "0.04em",
          lineHeight: 1,
          textAlign: "center",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
        }}
      >
        <span className="time-segment">{pad(displayHours)}</span>
        <span className="clock-colon">:</span>
        <span className="time-segment">{pad(minutes)}</span>
        <span className="clock-colon">:</span>
        <span
          className={`time-segment seconds-segment ${secondsChanged ? "changed" : ""}`}
          style={{
            opacity: showSeconds ? 1 : 1,
            transition: "opacity 0.3s ease",
            color: "var(--weather-text-secondary)",
          }}
        >
          {pad(seconds)}
        </span>
      </div>

      {/* Date and Controls */}
      <div className="flex flex-col items-center gap-2 mt-2">
        <div
          className="date-display flex items-center gap-2 px-3 py-1 rounded-full"
          style={{
            background: isHovered ? `${clockAccentColor}10` : "transparent",
            border: `1px solid ${isHovered ? clockAccentColor : "transparent"}`,
          }}
        >
          <Calendar className="w-3 h-3" style={{ color: clockAccentColor }} />
          <span
            className="text-base font-mono clock-date-mobile clock-date"
            style={{ fontWeight: 700 }}
          >
            {dateStr}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Sunrise/Sunset with icon */}
          <div
            className="flex items-center gap-1 px-2 py-1 rounded-full border transition-all duration-300 hover:scale-105"
            style={{
              borderColor: clockAccentColor,
              color: clockAccentColor,
              background: isHovered ? `${clockAccentColor}10` : "transparent",
            }}
          >
            {isDayTime ? (
              <Sun className="w-3 h-3" />
            ) : (
              <Moon className="w-3 h-3" />
            )}
            <span
              className="text-xs font-mono clock-sunrise-mobile"
              style={{
                fontWeight: 700,
                fontSize: "0.625rem",
              }}
            >
              {isDayTime ? "07:12 - 17:17" : "17:17 - 07:12"}
            </span>
          </div>

          {/* Time Format Toggle */}
          <div className="flex items-center gap-1">
            <WidgetButton
              className={`clock-button-mobile text-xs font-mono px-2 py-1 rounded-full border transition font-bold widget-button hover:scale-105`}
              style={{
                fontFamily: "var(--font-mono)",
                fontWeight: 700,
                fontSize: "0.625rem",
                borderColor: is24h ? "var(--muted-text)" : clockAccentColor,
                color: is24h ? "var(--muted-text)" : clockAccentColor,
                backgroundColor: is24h
                  ? "transparent"
                  : `${clockAccentColor}1a`,
              }}
              onClick={() => setIs24h(false)}
            >
              12h
            </WidgetButton>
            <WidgetButton
              className={`clock-button-mobile text-xs font-mono px-2 py-1 rounded-full border transition font-bold widget-button hover:scale-105`}
              style={{
                fontFamily: "var(--font-mono)",
                fontWeight: 700,
                fontSize: "0.625rem",
                borderColor: is24h ? clockAccentColor : "var(--muted-text)",
                color: is24h ? clockAccentColor : "var(--muted-text)",
                backgroundColor: is24h
                  ? `${clockAccentColor}1a`
                  : "transparent",
              }}
              onClick={() => setIs24h(true)}
            >
              24h
            </WidgetButton>
          </div>
        </div>
      </div>
    </div>
  );
}
