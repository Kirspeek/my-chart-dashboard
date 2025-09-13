import React from "react";
import { useTheme } from "@/hooks/useTheme";
import { useGlobalTooltip } from "@/hooks/useGlobalTooltip";
import {
  Clock,
  Play,
  Pause,
  Zap,
  Settings,
  Award,
  TrendingUp,
  Target,
  Zap as Lightning,
} from "lucide-react";
import MigrationFlowButton from "@/components/widgets/sankey-chart/MigrationFlowButton";
import type {
  ViewMode,
  Speed,
  TimelineControlsProps,
} from "@/interfaces/timeline";

export default function TimelineControls({
  viewMode,
  setViewMode,
  isMobile,
  isPlaying,
  setIsPlaying,
  animationSpeed,
  setAnimationSpeed,
  onReset,
  showDetails,
  setShowDetails,
}: TimelineControlsProps) {
  const { colors } = useTheme();
  const { createTooltipHandlers } = useGlobalTooltip();

  const viewModes = [
    {
      key: "timeline",
      label: "Timeline",
      icon: Clock,
      tooltip: "Interactive timeline view",
    },
    {
      key: "stats",
      label: "Stats",
      icon: TrendingUp,
      tooltip: "Progress statistics",
    },
    {
      key: "achievements",
      label: "Achievements",
      icon: Award,
      tooltip: "Milestone achievements",
    },
  ] as const;

  const speedOptions = [
    { value: "slow", label: "Slow", icon: Clock },
    { value: "normal", label: "Normal", icon: Zap },
    { value: "fast", label: "Fast", icon: Lightning },
  ] as const;

  return (
    <div className="mb-4">
      <div className="flex items-center justify-center space-x-1 mb-3">
        {viewModes.map((mode) => {
          const Icon = mode.icon;
          const isActive = viewMode === mode.key;
          return (
            <MigrationFlowButton
              key={mode.key}
              onClick={() => setViewMode(mode.key as ViewMode)}
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

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="relative p-3 rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-lg"
            style={{
              background: `linear-gradient(135deg, color-mix(in srgb, ${colors.accent.teal} 22%, transparent), var(--card-bg))`,
              border: `1px solid color-mix(in srgb, ${colors.accent.teal} 30%, var(--border-secondary))`,
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

          <div className="flex items-center space-x-1">
            {speedOptions.map((speed) => {
              const Icon = speed.icon;
              const isActive = animationSpeed === speed.value;
              return (
                <button
                  key={speed.value}
                  onClick={() => setAnimationSpeed(speed.value as Speed)}
                  className={`p-2 rounded-lg transition-all duration-200 ${isActive ? "scale-110" : "hover:scale-105"}`}
                  style={{
                    background: isActive
                      ? `linear-gradient(135deg, color-mix(in srgb, ${colors.accent.yellow} 24%, transparent), var(--card-bg))`
                      : `linear-gradient(135deg, color-mix(in srgb, ${colors.accent.yellow} 12%, transparent), var(--card-bg))`,
                    border: `1px solid color-mix(in srgb, ${colors.accent.yellow} 28%, var(--border-secondary))`,
                  }}
                  {...createTooltipHandlers(`${speed.label} speed`)}
                >
                  <Icon
                    size={14}
                    style={{
                      color: isActive
                        ? colors.accent.yellow
                        : "var(--secondary-text)",
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
              background: `linear-gradient(135deg, color-mix(in srgb, ${colors.accent.red} 20%, transparent), var(--card-bg))`,
              border: `1px solid color-mix(in srgb, ${colors.accent.red} 28%, var(--border-secondary))`,
            }}
            {...createTooltipHandlers("Reset to default")}
          >
            <Target size={18} style={{ color: colors.accent.red }} />
          </button>
        </div>

        <button
          onClick={() => setShowDetails(!showDetails)}
          className={`relative p-3 rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-lg ${
            showDetails ? "shadow-lg" : ""
          }`}
          style={{
            background: showDetails
              ? `linear-gradient(135deg, color-mix(in srgb, ${colors.accent.blue} 22%, transparent), var(--card-bg))`
              : `linear-gradient(135deg, color-mix(in srgb, ${colors.accent.blue} 12%, transparent), var(--card-bg))`,
            border: `1px solid color-mix(in srgb, ${colors.accent.blue} 26%, var(--border-secondary))`,
          }}
          {...createTooltipHandlers(
            showDetails ? "Hide details" : "Show details"
          )}
        >
          <Settings
            size={18}
            style={{
              color: showDetails ? colors.accent.blue : "var(--secondary-text)",
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
