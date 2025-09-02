"use client";

import React from "react";
import { Zap, RefreshCw, AlertTriangle } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

interface WeatherStatusProps {
  isCached: boolean;
  isPreloading: boolean;
  stale: boolean;
}

export default function WeatherStatus({
  isCached,
  isPreloading,
  stale,
}: WeatherStatusProps) {
  const { colorsTheme } = useTheme();
  const weatherColors = colorsTheme.widgets.weather;

  const getStatusInfo = () => {
    if (isCached) {
      return {
        icon: <Zap className="w-3 h-3" />,
        text: "Instant",
        color: weatherColors.statusColors.cached,
      };
    }
    if (isPreloading) {
      return {
        icon: <RefreshCw className="w-3 h-3 animate-spin" />,
        text: "Updating...",
        color: weatherColors.statusColors.preloading,
      };
    }
    if (stale) {
      return {
        icon: <AlertTriangle className="w-3 h-3" />,
        text: "Outdated",
        color: weatherColors.statusColors.stale,
      };
    }
    return {
      icon: null,
      text: "",
      color: weatherColors.statusColors.fallback,
    };
  };

  const statusInfo = getStatusInfo();

  return (
    <div
      className="weather-status-mobile lg:weather-status-desktop"
      style={{
        fontSize: 12,
        color: statusInfo.color,
        opacity: 0.7,
        marginBottom: 4,
        minHeight: 18,
        minWidth: 70,
        textAlign: "center",
        transition: "all 0.3s ease",
        fontWeight: 500,
        letterSpacing: "0.01em",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "4px",
      }}
    >
      {statusInfo.icon}
      <span style={{ transition: "opacity 0.3s ease" }}>{statusInfo.text}</span>
    </div>
  );
}
