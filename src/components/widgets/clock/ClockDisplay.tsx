"use client";

import React, { useState, useEffect, useRef } from "react";
import WidgetButton from "../../common/WidgetButton";
import { useTheme } from "@/hooks/useTheme";
import { Sun, Moon, Calendar } from "lucide-react";
import type { ClockDisplayProps } from "@/interfaces/widgets";

export default function ClockDisplay({
  mainTime,
  is24h,
  dateStr,
  pad,
  setIs24h,
}: ClockDisplayProps) {
  const { colorsTheme } = useTheme();
  const clockColors = colorsTheme.widgets.clock;
  const [isHovered, setIsHovered] = useState(false);
  const [showSeconds, setShowSeconds] = useState(true);
  const [secondsChanged, setSecondsChanged] = useState(false);
  const prevSecondsRef = useRef<number>(0);

  const hours = mainTime.getHours();
  const minutes = mainTime.getMinutes();
  const seconds = mainTime.getSeconds();
  const displayHours = is24h ? hours : hours % 12 || 12;
  const isDayTime = hours >= 6 && hours < 18;

  useEffect(() => {
    if (prevSecondsRef.current !== seconds) {
      setSecondsChanged(true);
      const timer = setTimeout(() => setSecondsChanged(false), 200);
      prevSecondsRef.current = seconds;
      return () => clearTimeout(timer);
    }
  }, [seconds]);

  useEffect(() => {
    const timer = setTimeout(() => setShowSeconds(false), 3000);
    return () => clearTimeout(timer);
  }, [seconds]);

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
        @media (min-width: 768px) {
          .clock-main-size {
            font-size: clamp(4rem, 9vw, 8rem);
          }
        }
        /* Make controls more compact on screens narrower than 1440px */
        @media (max-width: 1440px) {
          .clock-controls {
            gap: 0.5rem;
          }
          .clock-button-mobile {
            padding: 0.125rem 0.4rem !important;
            font-size: 0.55rem !important;
            border-width: 1.5px !important;
          }
          .clock-sunrise-mobile {
            font-size: 0.55rem !important;
          }
          .clock-date-mobile {
            font-size: 0.75rem !important;
          }
        }
        .clock-colon {
          display: inline-block;
          color: var(--muted-text);
          animation: colonPulse 1s ease-in-out infinite;
        }
        @keyframes colonPulse {
          0%,
          100% {
            opacity: 0.45;
          }
          50% {
            opacity: 1;
          }
        }
        .time-segment {
          transition: all 0.3s ease;
        }
        .time-segment:hover {
          transform: scale(1.05);
          color: ${clockColors.accentColor} !important;
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
            color: "var(--muted-text)",
          }}
        >
          {pad(seconds)}
        </span>
      </div>

      <div className="flex flex-col items-center gap-2 mt-2">
        <div
          className="date-display flex items-center justify-center gap-2 px-3 py-1 rounded-full"
          style={{
            background: isHovered ? clockColors.hoverBackground : "transparent",
            border: `2px solid ${isHovered ? clockColors.accentColor : "transparent"}`,
          }}
        >
          <Calendar
            className="w-3 h-3"
            style={{ color: clockColors.accentColor }}
          />
          <span
            className="text-sm font-mono clock-date-mobile clock-date"
            style={{
              fontWeight: 700,
              letterSpacing: "0.04em",
              color: isHovered
                ? clockColors.accentColor
                : "var(--secondary-text)",
            }}
          >
            {dateStr}
          </span>
        </div>

        <div className="flex items-center justify-center gap-3 clock-controls">
          <div
            className="flex items-center gap-1 px-2 py-1 rounded-full border transition-all duration-300 hover:scale-105"
            style={{
              borderColor: clockColors.accentColor,
              borderWidth: 2,
              color: clockColors.accentColor,
              background: isHovered
                ? clockColors.hoverBackground
                : "transparent",
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

          <div className="flex items-center gap-1">
            <WidgetButton
              className={`clock-button-mobile text-xs font-mono px-3 py-1 rounded-full border transition font-bold widget-button hover:scale-105`}
              style={{
                fontWeight: 700,
                fontSize: "0.625rem",
                letterSpacing: "0.04em",
                borderWidth: 2,
                borderColor: is24h
                  ? clockColors.inactiveBorder
                  : clockColors.accentColor,
                color: is24h
                  ? clockColors.inactiveText
                  : clockColors.accentColor,
                backgroundColor: is24h
                  ? "var(--button-bg)"
                  : clockColors.activeBackground,
              }}
              onClick={() => setIs24h(false)}
            >
              12h
            </WidgetButton>
            <WidgetButton
              className={`clock-button-mobile text-xs font-mono px-3 py-1 rounded-full border transition font-bold widget-button hover:scale-105`}
              style={{
                fontWeight: 700,
                fontSize: "0.625rem",
                letterSpacing: "0.04em",
                borderWidth: 2,
                borderColor: is24h
                  ? clockColors.accentColor
                  : clockColors.inactiveBorder,
                color: is24h
                  ? clockColors.accentColor
                  : clockColors.inactiveText,
                backgroundColor: is24h
                  ? clockColors.activeBackground
                  : "var(--button-bg)",
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
