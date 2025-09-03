"use client";

import React from "react";
import {
  Radar,
  TrendingUp,
  AlertTriangle,
  HardDrive,
  Play,
  Pause,
  Activity,
  Zap,
} from "lucide-react";
import { useTheme } from "../../../hooks/useTheme";

interface PerformanceMetricsHeaderProps {
  title: string;
  currentView: "radar" | "timeline" | "alerts" | "capacity";
  setCurrentView: (view: "radar" | "timeline" | "alerts" | "capacity") => void;
  isRealTime: boolean;
  setIsRealTime: (realTime: boolean) => void;
}

export default function PerformanceMetricsHeader({
  title,
  currentView,
  setCurrentView,
  isRealTime,
  setIsRealTime,
}: PerformanceMetricsHeaderProps) {
  const { colors } = useTheme();
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const check = () => {
      if (typeof window !== "undefined") {
        setIsMobile(window.innerWidth <= 425);
      }
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const viewButtons = [
    { key: "radar", icon: Radar, label: "Radar" },
    { key: "timeline", icon: TrendingUp, label: "Timeline" },
    { key: "alerts", icon: AlertTriangle, label: "Alerts" },
    { key: "capacity", icon: HardDrive, label: "Capacity" },
  ] as const;

  return (
    <div className="flex flex-col space-y-3 mb-4">
      {/* Main Title */}
      <div className="flex items-center justify-between">
        <h3
          className="text-lg font-bold primary-text"
          style={{
            fontFamily: "var(--font-mono)",
            fontWeight: 700,
          }}
        >
          {title}
        </h3>

        {/* Real-time indicator */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <Activity
              className={`w-4 h-4 ${isRealTime ? "text-green-500" : "text-gray-400"}`}
              style={{ animation: isRealTime ? "pulse 2s infinite" : "none" }}
            />
            <span
              className="text-xs font-medium"
              style={{
                fontFamily: "var(--font-mono)",
                fontWeight: 700,
                color: isRealTime ? colors.accent.teal : colors.secondary,
              }}
            >
              {isRealTime ? "LIVE" : "PAUSED"}
            </span>
          </div>

          <button
            onClick={() => setIsRealTime(!isRealTime)}
            className="p-1.5 rounded-lg transition-all duration-200 hover:scale-105"
            style={{
              background: isRealTime
                ? colors.accent.teal + "20"
                : "var(--button-bg)",
              border: `1px solid ${isRealTime ? colors.accent.teal : "var(--button-border)"}`,
            }}
          >
            {isRealTime ? (
              <Pause
                className="w-3 h-3"
                style={{ color: colors.accent.teal }}
              />
            ) : (
              <Play className="w-3 h-3" style={{ color: colors.secondary }} />
            )}
          </button>
        </div>
      </div>

      {/* View Navigation */}
      <div className="flex items-center justify-center space-x-1">
        {/* Reuse common ToggleButtonGroup for consistency */}
        {/* Inline import avoided to keep header self-contained visually; we still replicate styling here to avoid deep header changes */}
        {viewButtons.map(({ key, icon: Icon, label }) => (
          <button
            key={key}
            onClick={() => setCurrentView(key)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 hover:scale-105 ${
              currentView === key ? "scale-105" : ""
            }`}
            style={{
              background:
                currentView === key
                  ? colors.accent.blue + "20"
                  : "var(--button-bg)",
              border: `1px solid ${currentView === key ? colors.accent.blue : "var(--button-border)"}`,
              color:
                currentView === key ? colors.accent.blue : colors.secondary,
              fontFamily: "var(--font-mono)",
              fontWeight: 700,
            }}
          >
            <Icon className="w-3 h-3" />
            {!isMobile && <span>{label}</span>}
          </button>
        ))}
      </div>

      {/* Performance Score Indicator */}
      <div className="flex items-center justify-center space-x-2">
        <Zap className="w-4 h-4" style={{ color: colors.accent.yellow }} />
        <span
          className="text-sm font-bold"
          style={{
            fontFamily: "var(--font-mono)",
            fontWeight: 700,
            color: colors.primary,
          }}
        >
          Performance Score: 87.5
        </span>
        <div className="flex items-center space-x-1">
          <TrendingUp
            className="w-3 h-3"
            style={{ color: colors.accent.teal }}
          />
          <span
            className="text-xs font-medium"
            style={{
              fontFamily: "var(--font-mono)",
              fontWeight: 700,
              color: colors.accent.teal,
            }}
          >
            +2.3%
          </span>
        </div>
      </div>
    </div>
  );
}
