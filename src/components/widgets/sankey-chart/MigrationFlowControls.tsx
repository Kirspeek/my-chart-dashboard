"use client";

import React from "react";
import { useTheme } from "@/hooks/useTheme";
import {
  BarChart3,
  TrendingUp,
  Globe,
  Play,
  Pause,
  RotateCcw,
  Eye,
  EyeOff,
} from "lucide-react";
import MigrationFlowButton from "./MigrationFlowButton";

import type { MigrationFlowControlsProps } from "@/interfaces/charts";

export default function MigrationFlowControls({
  viewMode,
  setViewMode,
  animationSpeed,
  setAnimationSpeed,
  showDetails,
  setShowDetails,
  isPlaying,
  setIsPlaying,
  onReset,
  isMobile = false,
}: MigrationFlowControlsProps) {
  const { colors, isDark } = useTheme();

  const viewModes = [
    {
      key: "flow",
      label: "Flow",
      icon: Globe,
      tooltip: "Interactive flow visualization",
    },
    {
      key: "stats",
      label: "Stats",
      icon: BarChart3,
      tooltip: "Detailed statistics and analytics",
    },
    {
      key: "trends",
      label: "Trends",
      icon: TrendingUp,
      tooltip: "Migration trends analysis",
    },
  ] as const;

  const speedOptions = [
    { key: "slow", label: "Slow", tooltip: "Slow animation speed" },
    { key: "normal", label: "Normal", tooltip: "Normal animation speed" },
    { key: "fast", label: "Fast", tooltip: "Fast animation speed" },
  ] as const;

  return (
    <div className="w-full mt-4">
      <div className="flex items-center justify-center space-x-1 mb-3">
        {viewModes.map((mode) => {
          const Icon = mode.icon;
          const isActive = viewMode === mode.key;

          return (
            <MigrationFlowButton
              key={mode.key}
              onClick={() => setViewMode(mode.key)}
              selected={isActive}
              variant={isActive ? "primary" : "secondary"}
              size={isMobile ? "sm" : "md"}
              icon={<Icon className="w-3 h-3" />}
              tooltip={true}
              tooltipTitle={mode.label}
              tooltipSubtitle={mode.tooltip}
            >
              {!isMobile && mode.label}
            </MigrationFlowButton>
          );
        })}
      </div>

      <div
        className={`flex ${isMobile ? "flex-col gap-3" : "flex-row items-center justify-between"} p-3 rounded-xl`}
        style={{
          background: isDark
            ? "rgba(255, 255, 255, 0.08)"
            : "rgba(255, 255, 255, 0.05)",
          border: isDark
            ? "1px solid rgba(255, 255, 255, 0.15)"
            : "1px solid rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(12px)",
          boxShadow: isDark
            ? "0 4px 16px rgba(0, 0, 0, 0.2)"
            : "0 4px 16px rgba(0, 0, 0, 0.05)",
        }}
      >
        {/* Left side - Animation controls */}
        <div className="flex items-center space-x-2">
          <MigrationFlowButton
            onClick={() => setIsPlaying(!isPlaying)}
            variant={isPlaying ? "danger" : "primary"}
            size="sm"
            icon={
              isPlaying ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )
            }
            tooltip={true}
            tooltipTitle={isPlaying ? "Pause" : "Play"}
            tooltipSubtitle={isPlaying ? "Pause animation" : "Play animation"}
          >
            {isPlaying ? "Pause" : "Play"}
          </MigrationFlowButton>

          <MigrationFlowButton
            onClick={onReset}
            variant="secondary"
            size="sm"
            icon={<RotateCcw className="w-4 h-4" />}
            tooltip={true}
            tooltipTitle="Reset"
            tooltipSubtitle="Reset view and selections"
          >
            Reset
          </MigrationFlowButton>

          <MigrationFlowButton
            onClick={() => setShowDetails(!showDetails)}
            variant={showDetails ? "accent" : "secondary"}
            size="sm"
            icon={
              showDetails ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )
            }
            tooltip={true}
            tooltipTitle={showDetails ? "Hide Details" : "Show Details"}
            tooltipSubtitle={showDetails ? "Hide details" : "Show details"}
          >
            {showDetails ? "Hide" : "Show"}
          </MigrationFlowButton>
        </div>

        {/* Right side - Speed selector */}
        <div className="flex items-center space-x-2">
          <span
            className="text-xs font-medium"
            style={{
              color: colors.secondary,
              fontFamily: "var(--font-mono)",
              fontWeight: 600,
            }}
          >
            Speed:
          </span>
          <div className="flex items-center space-x-1">
            {speedOptions.map((speed) => {
              const isActive = animationSpeed === speed.key;

              return (
                <MigrationFlowButton
                  key={speed.key}
                  onClick={() => setAnimationSpeed(speed.key)}
                  variant={isActive ? "primary" : "secondary"}
                  size="sm"
                  tooltip={true}
                  tooltipTitle={speed.label}
                  tooltipSubtitle={speed.tooltip}
                >
                  {speed.label}
                </MigrationFlowButton>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
