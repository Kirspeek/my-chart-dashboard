"use client";

import React from "react";
import { useTheme } from "@/hooks/useTheme";
import { useGlobalTooltip } from "@/hooks/useGlobalTooltip";
import {
  Play,
  Pause,
  RotateCcw,
  BarChart3,
  TrendingUp,
  Zap,
  Clock,
  Settings,
  Globe,
} from "lucide-react";
import MigrationFlowButton from "../sankey-chart/MigrationFlowButton";
import type { MigrationChordControlsProps } from "@/interfaces/charts";

export default function MigrationChordControls({
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
}: MigrationChordControlsProps) {
  const { colors } = useTheme();
  const { createTooltipHandlers } = useGlobalTooltip();

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
    { value: "slow", label: "Slow", icon: Clock },
    { value: "normal", label: "Normal", icon: Zap },
    { value: "fast", label: "Fast", icon: Settings },
  ];

  return (
    <div className="mb-4">
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
              tooltip={mode.tooltip}
              tooltipTitle={mode.label}
            >
              {!isMobile && mode.label}
            </MigrationFlowButton>
          );
        })}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="relative p-3 rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-lg"
            style={{
              background: `linear-gradient(135deg, ${colors.accent.teal}20, ${colors.accent.teal}10)`,
              border: `1px solid ${colors.accent.teal}30`,
            }}
            {...createTooltipHandlers(
              isPlaying ? "Pause animation" : "Play animation"
            )}
          >
            {isPlaying ? (
              <Pause size={18} style={{ color: colors.accent.teal }} />
            ) : (
              <Play size={18} style={{ color: colors.accent.teal }} />
            )}
          </button>

          {/* Speed Selector */}
          <div className="flex items-center space-x-1">
            {speedOptions.map((speed) => {
              const Icon = speed.icon;
              const isActive = animationSpeed === speed.value;

              return (
                <button
                  key={speed.value}
                  onClick={() =>
                    setAnimationSpeed(speed.value as "slow" | "normal" | "fast")
                  }
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    isActive ? "scale-110" : "hover:scale-105"
                  }`}
                  style={{
                    background: isActive
                      ? `linear-gradient(135deg, ${colors.accent.yellow}20, ${colors.accent.yellow}10)`
                      : `linear-gradient(135deg, ${colors.accent.yellow}10, ${colors.accent.yellow}05)`,
                    border: `1px solid ${colors.accent.yellow}30`,
                  }}
                  {...createTooltipHandlers(`${speed.label} speed`)}
                >
                  <Icon
                    size={14}
                    style={{
                      color: isActive ? colors.accent.yellow : colors.secondary,
                    }}
                  />
                </button>
              );
            })}
          </div>

          <button
            onClick={onReset}
            className="relative p-3 rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-lg"
            style={{
              background: `linear-gradient(135deg, ${colors.accent.red}20, ${colors.accent.red}10)`,
              border: `1px solid ${colors.accent.red}30`,
            }}
            {...createTooltipHandlers("Reset to default")}
          >
            <RotateCcw size={18} style={{ color: colors.accent.red }} />
          </button>
        </div>

        {/* Details Toggle */}
        <button
          onClick={() => setShowDetails(!showDetails)}
          className={`relative p-3 rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-lg ${
            showDetails ? "shadow-lg" : ""
          }`}
          style={{
            background: showDetails
              ? `linear-gradient(135deg, ${colors.accent.blue}20, ${colors.accent.blue}10)`
              : `linear-gradient(135deg, ${colors.accent.blue}10, ${colors.accent.blue}05)`,
            border: `1px solid ${colors.accent.blue}30`,
          }}
          {...createTooltipHandlers(
            showDetails ? "Hide details" : "Show details"
          )}
        >
          <Settings
            size={18}
            style={{
              color: showDetails ? colors.accent.blue : colors.secondary,
            }}
          />
          {showDetails && (
            <div
              className="absolute -top-1 -right-1 w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: colors.accent.blue }}
            />
          )}
        </button>
      </div>

      {/* Status Bar */}
      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ backgroundColor: colors.accent.teal }}
          />
          <span
            className="text-xs font-medium"
            style={{ color: colors.secondary }}
          >
            {isPlaying ? "Animating" : "Paused"}
          </span>
        </div>
        <div className="flex items-center space-x-1">
          <span
            className="text-xs font-medium"
            style={{ color: colors.secondary }}
          >
            Speed:
          </span>
          <span
            className="text-xs font-bold"
            style={{ color: colors.accent.yellow }}
          >
            {animationSpeed.charAt(0).toUpperCase() + animationSpeed.slice(1)}
          </span>
        </div>
      </div>
    </div>
  );
}
