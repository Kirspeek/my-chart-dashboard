"use client";

import React, { useState, useRef, useEffect } from "react";
import { useTheme } from "@/hooks/useTheme";
import { useGlobalTooltip } from "@/hooks/useGlobalTooltip";
import WidgetBase from "../../common/WidgetBase";
import { WidgetTitle } from "../../common";
import SlideNavigation from "../../common/SlideNavigation";
import MigrationFlowButton from "../sankey-chart/MigrationFlowButton";
import {
  Clock,
  Play,
  Pause,
  RotateCcw,
  Zap,
  Settings,
  TrendingUp,
  Target,
  Award,
  Zap as Lightning,
} from "lucide-react";
import type { TimelineItem } from "../../../../interfaces/charts";

// Utility to lighten/darken a hex color
function shadeColor(
  color: string,
  percent: number,
  fallbackColor: string = "#666666"
) {
  // Add validation to ensure color is a valid hex string
  if (!color || typeof color !== "string" || !color.startsWith("#")) {
    return fallbackColor; // Fallback color
  }

  let R = parseInt(color.substring(1, 3), 16);
  let G = parseInt(color.substring(3, 5), 16);
  let B = parseInt(color.substring(5, 7), 16);

  // Check if parsing was successful
  if (isNaN(R) || isNaN(G) || isNaN(B)) {
    return fallbackColor; // Fallback color
  }

  R = Math.min(255, Math.max(0, R + (255 - R) * percent));
  G = Math.min(255, Math.max(0, G + (255 - G) * percent));
  B = Math.min(255, Math.max(0, B + (255 - B) * percent));
  return (
    "#" +
    R.toString(16).padStart(2, "0") +
    G.toString(16).padStart(2, "0") +
    B.toString(16).padStart(2, "0")
  );
}

// SVG arc helper for a half-circle
function describeArc(
  x: number,
  y: number,
  radius: number,
  startAngle: number,
  endAngle: number
) {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);
  const arcSweep = endAngle - startAngle <= 180 ? "0" : "1";
  return [
    "M",
    start.x,
    start.y,
    "A",
    radius,
    radius,
    0,
    arcSweep,
    0,
    end.x,
    end.y,
  ].join(" ");
}

function polarToCartesian(cx: number, cy: number, r: number, angle: number) {
  const rad = ((angle - 90) * Math.PI) / 180.0;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
}

interface EnhancedTimelineWidgetProps {
  onOpenSidebar?: () => void;
  showSidebarButton?: boolean;
  currentSlide?: number;
  setCurrentSlide?: (slide: number) => void;
}

export default function EnhancedTimelineWidget({
  onOpenSidebar,
  showSidebarButton = false,
  currentSlide,
  setCurrentSlide,
}: EnhancedTimelineWidgetProps) {
  const { colors, colorsTheme } = useTheme();
  const timelineRingsColors = colorsTheme.widgets.timelineRings;
  const { createTooltipHandlers } = useGlobalTooltip();

  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [selectedMilestone, setSelectedMilestone] = useState<number | null>(
    null
  );
  const [viewMode, setViewMode] = useState<
    "timeline" | "stats" | "achievements"
  >("timeline");
  const [isPlaying, setIsPlaying] = useState(true);
  const [animationSpeed, setAnimationSpeed] = useState<
    "slow" | "normal" | "fast"
  >("normal");
  const [showDetails, setShowDetails] = useState(false);
  const [timelineData, setTimelineData] = useState<TimelineItem[]>([]);
  const [animatedProgress, setAnimatedProgress] = useState<number[]>([]);
  const [animatedLineProgress, setAnimatedLineProgress] = useState<number[]>(
    []
  );
  const [hasAnimated, setHasAnimated] = useState(false);

  const widgetRef = useRef<HTMLDivElement>(null);

  // Detect mobile to apply responsive sizing
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  React.useEffect(() => {
    const check = () => {
      if (typeof window !== "undefined") {
        const width = window.innerWidth;
        setIsMobile(width <= 425);
        setIsTablet(width > 425 && width <= 1024);
      }
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Load timeline data
  useEffect(() => {
    import("../../../data/json/timelineData.json").then((mod) => {
      const arr = (mod.default ?? mod) as TimelineItem[];
      setTimelineData(arr);
      setAnimatedProgress(new Array(arr.length).fill(0));
      setAnimatedLineProgress(new Array(arr.length).fill(0));
      setHasAnimated(false);
    });
  }, []);

  // Intersection Observer to trigger animation
  useEffect(() => {
    const ref = widgetRef.current;
    if (!ref) return;

    let observer: IntersectionObserver | null = null;
    if (typeof window !== "undefined" && "IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && timelineData.length > 0) {
            setHasAnimated(true);
            if (observer) observer.disconnect();
          }
        },
        { threshold: 0.3 }
      );
      observer.observe(ref);
    } else if (timelineData.length > 0) {
      setHasAnimated(true);
    }

    return () => {
      if (observer) observer.disconnect();
    };
  }, [timelineData]);

  // Animation loop
  useEffect(() => {
    if (!isPlaying) return;
    const speedMultiplier = { slow: 0.5, normal: 1, fast: 2 }[animationSpeed];
    const interval = setInterval(() => {
      setAnimatedProgress((prev) =>
        prev.map((progress, idx) => {
          const target = timelineData[idx]?.progress ?? 0.9;
          const increment = 0.01 * speedMultiplier;
          return Math.min(target, progress + increment);
        })
      );
    }, 50);
    return () => clearInterval(interval);
  }, [isPlaying, animationSpeed, timelineData]);

  // Sequential animation logic
  useEffect(() => {
    if (!hasAnimated || timelineData.length === 0) return;
    let cancelled = false;

    async function animateAll() {
      for (let idx = 0; idx < timelineData.length; idx++) {
        // Animate ring
        await new Promise<void>((resolve) => {
          const target = timelineData[idx].progress ?? 0.9;
          let current = 0;
          function step() {
            if (cancelled) return;
            current += 0.02;
            if (current > target) current = target;
            setAnimatedProgress((prev) => {
              const arr = [...prev];
              arr[idx] = current;
              return arr;
            });
            if (current < target) {
              requestAnimationFrame(step);
            } else {
              resolve();
            }
          }
          step();
        });

        // Animate line
        await new Promise<void>((resolve) => {
          let lineCurrent = 0;
          function lineStep() {
            if (cancelled) return;
            lineCurrent += 0.08;
            if (lineCurrent > 1) lineCurrent = 1;
            setAnimatedLineProgress((prev) => {
              const arr = [...prev];
              arr[idx] = lineCurrent;
              return arr;
            });
            if (lineCurrent < 1) {
              requestAnimationFrame(lineStep);
            } else {
              resolve();
            }
          }
          lineStep();
        });
      }
    }
    animateAll();
    return () => {
      cancelled = true;
    };
  }, [hasAnimated, timelineData]);

  // Reset function
  const handleReset = () => {
    setSelectedMilestone(null);
    setHoveredIdx(null);
    setAnimatedProgress(new Array(timelineData.length).fill(0));
    setAnimatedLineProgress(new Array(timelineData.length).fill(0));
    setHasAnimated(false);
  };

  // Calculate statistics
  const totalMilestones = timelineData.length;
  const completedMilestones = timelineData.filter(
    (item, idx) => (animatedProgress[idx] ?? 0) >= (item.progress ?? 0.9)
  ).length;
  const averageProgress =
    timelineData.reduce(
      (sum, item, idx) => sum + (animatedProgress[idx] ?? 0),
      0
    ) / timelineData.length;

  // Get theme colors for milestones - using original color mapping
  const getMilestoneColor = (idx: number) => {
    const colorKeys = ["yellow", "red", "blue", "teal", "purple"] as const;
    const colorMap = {
      yellow: colors.accent.yellow,
      red: colors.accent.red,
      blue: colors.accent.blue,
      teal: colors.accent.teal,
      purple: timelineRingsColors.purple, // fallback for purple, not in theme
    };
    return (
      colorMap[colorKeys[idx % colorKeys.length]] ||
      timelineRingsColors.fallback
    );
  };

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
  ];

  if (timelineData.length === 0) return null;

  return (
    <div ref={widgetRef}>
      <WidgetBase
        className={`w-full flex flex-col ${isMobile ? "timeline-rings-widget" : ""}`}
        onOpenSidebar={onOpenSidebar}
        showSidebarButton={showSidebarButton}
      >
        <div
          className="w-full h-full flex flex-col"
          style={{
            padding: isMobile ? "0 1rem 1rem 1rem" : "1.5rem",
          }}
        >
          <WidgetTitle
            title="Timeline of Renewable Energy Milestones"
            subtitle="Historical Energy Milestones"
            variant={isMobile ? "centered" : "default"}
            size="md"
          />

          {/* Enhanced Header with Stats */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            {/* Total Milestones */}
            <div
              className="relative p-3 rounded-lg overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${colors.accent.blue}15, ${colors.accent.blue}05)`,
                border: `1px solid ${colors.accent.blue}25`,
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p
                    className="text-xs font-medium mb-1 opacity-70"
                    style={{ color: colors.secondary }}
                  >
                    Total Milestones
                  </p>
                  <p
                    className="text-sm font-bold"
                    style={{ color: colors.primary }}
                  >
                    {totalMilestones}
                  </p>
                </div>
                <div
                  className="p-1.5 rounded-md"
                  style={{ backgroundColor: `${colors.accent.blue}20` }}
                >
                  <Target size={12} style={{ color: colors.accent.blue }} />
                </div>
              </div>
            </div>

            {/* Completed Milestones */}
            <div
              className="relative p-3 rounded-lg overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${colors.accent.teal}15, ${colors.accent.teal}05)`,
                border: `1px solid ${colors.accent.teal}25`,
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p
                    className="text-xs font-medium mb-1 opacity-70"
                    style={{ color: colors.secondary }}
                  >
                    Completed
                  </p>
                  <p
                    className="text-sm font-bold"
                    style={{ color: colors.primary }}
                  >
                    {completedMilestones}
                  </p>
                </div>
                <div
                  className="p-1.5 rounded-md"
                  style={{ backgroundColor: `${colors.accent.teal}20` }}
                >
                  <Award size={12} style={{ color: colors.accent.teal }} />
                </div>
              </div>
            </div>

            {/* Average Progress */}
            <div
              className="relative p-3 rounded-lg overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${colors.accent.yellow}15, ${colors.accent.yellow}05)`,
                border: `1px solid ${colors.accent.yellow}25`,
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p
                    className="text-xs font-medium mb-1 opacity-70"
                    style={{ color: colors.secondary }}
                  >
                    Progress
                  </p>
                  <p
                    className="text-sm font-bold"
                    style={{ color: colors.primary }}
                  >
                    {Math.round(averageProgress * 100)}%
                  </p>
                </div>
                <div
                  className="p-1.5 rounded-md"
                  style={{ backgroundColor: `${colors.accent.yellow}20` }}
                >
                  <TrendingUp
                    size={12}
                    style={{ color: colors.accent.yellow }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="mb-4">
            {/* View Mode Selector */}
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

            {/* Control Panel */}
            <div className="flex items-center justify-between">
              {/* Animation Controls */}
              <div className="flex items-center space-x-2">
                {/* Play/Pause Button */}
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
                          setAnimationSpeed(
                            speed.value as "slow" | "normal" | "fast"
                          )
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
                            color: isActive
                              ? colors.accent.yellow
                              : colors.secondary,
                          }}
                        />
                      </button>
                    );
                  })}
                </div>

                {/* Reset Button */}
                <button
                  onClick={handleReset}
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
                  {animationSpeed.charAt(0).toUpperCase() +
                    animationSpeed.slice(1)}
                </span>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-h-0 mt-4">
            {viewMode === "timeline" && (
              <div className="flex flex-row items-end justify-center gap-12 w-full max-w-7xl">
                {timelineData.map((item, idx) => {
                  const color = getMilestoneColor(idx);
                  const isEven = idx % 2 === 1;
                  const arcStart = 0;
                  const arcEnd = arcStart + 360 * (animatedProgress[idx] ?? 0);
                  const gapStart = arcEnd;
                  const gapEnd = 360;

                  return (
                    <div
                      key={item.year}
                      className="flex flex-col items-center relative"
                      style={{ width: isTablet ? "140px" : "224px" }}
                    >
                      {/* Text block above for even rings */}
                      {isEven && (
                        <>
                          <div
                            className="mb-2 text-center"
                            style={{
                              color,
                              fontFamily: "var(--font-mono)",
                              fontWeight: 800,
                              fontSize: isTablet ? "16px" : "24px",
                              letterSpacing: 1.5,
                              marginBottom: isTablet ? "6px" : "10px",
                              textShadow: `0 2px 4px ${color}30, 0 1px 2px ${shadeColor(color, 0.6)}40`,
                              lineHeight: 1.2,
                            }}
                          >
                            {item.title}
                          </div>
                          <div
                            className="text-base mb-2"
                            style={{
                              color: shadeColor(color, 0.3),
                              fontFamily: "var(--font-mono)",
                              fontWeight: 600,
                              lineHeight: 1.5,
                              fontSize: isTablet ? "11px" : "17px",
                              marginBottom: isTablet ? "6px" : "10px",
                              opacity: 0.9,
                              letterSpacing: 0.5,
                              textShadow: `0 1px 2px ${color}15`,
                            }}
                          >
                            {item.desc}
                          </div>
                          <svg
                            width={2}
                            height={isTablet ? 28 : 38}
                            style={{
                              display: "block",
                              marginBottom: isTablet ? -4 : -8,
                            }}
                          >
                            <line
                              x1={1}
                              y1={isTablet ? 28 : 38}
                              x2={1}
                              y2={
                                (isTablet ? 28 : 38) -
                                (isTablet ? 28 : 38) * animatedLineProgress[idx]
                              }
                              stroke={color}
                              strokeWidth={2}
                              style={{ transition: "y2 0.18s" }}
                            />
                          </svg>
                        </>
                      )}

                      {/* Ring SVG */}
                      <svg
                        width={isTablet ? 90 : 120}
                        height={isTablet ? 90 : 120}
                        style={{ zIndex: 1, display: "block" }}
                        onMouseLeave={() => setHoveredIdx(null)}
                        onClick={() =>
                          setSelectedMilestone(
                            selectedMilestone === idx ? null : idx
                          )
                        }
                      >
                        <defs>
                          {/* Light shadow filter - no dark shadows */}
                          <filter
                            id={`arc-shadow-${idx}`}
                            x="-20%"
                            y="-20%"
                            width="140%"
                            height="140%"
                          >
                            <feDropShadow
                              dx="0"
                              dy="1"
                              stdDeviation="1"
                              floodColor={color}
                              floodOpacity="0.2"
                            />
                          </filter>

                          {/* Simple solid color for arc - no gradient */}
                          <linearGradient
                            id={`arc-gradient-${idx}`}
                            x1="0"
                            y1="0"
                            x2="1"
                            y2="1"
                          >
                            <stop offset="0%" stopColor={color} />
                            <stop offset="100%" stopColor={color} />
                          </linearGradient>

                          {/* Enhanced center gradient - white with transparency */}
                          <radialGradient
                            id={`center-gradient-${idx}`}
                            cx="50%"
                            cy="40%"
                            r="70%"
                          >
                            <stop
                              offset="0%"
                              stopColor={timelineRingsColors.gradient.stop1}
                              stopOpacity="1"
                            />
                            <stop
                              offset="40%"
                              stopColor={timelineRingsColors.gradient.stop2}
                              stopOpacity="0.95"
                            />
                            <stop
                              offset="70%"
                              stopColor={timelineRingsColors.gradient.stop3}
                              stopOpacity="0.7"
                            />
                            <stop
                              offset="100%"
                              stopColor={timelineRingsColors.gradient.stop1}
                              stopOpacity="0.3"
                            />
                          </radialGradient>
                        </defs>

                        {/* Simple colored arc - solid color */}
                        <path
                          d={describeArc(
                            isTablet ? 45 : 60,
                            isTablet ? 45 : 60,
                            isTablet ? 36 : 48,
                            arcStart,
                            arcEnd
                          )}
                          fill="none"
                          stroke={color}
                          strokeWidth={isTablet ? 12 : 16}
                          opacity={
                            hoveredIdx === null
                              ? 1
                              : hoveredIdx === idx
                                ? 1
                                : 0.4
                          }
                          strokeLinecap="round"
                          style={{
                            cursor: "pointer",
                            transition: "opacity 0.3s, stroke-width 0.2s",
                          }}
                          onMouseMove={() => setHoveredIdx(idx)}
                          onMouseEnter={() => setHoveredIdx(idx)}
                        />

                        {/* Enhanced faded arc */}
                        <path
                          d={describeArc(
                            isTablet ? 45 : 60,
                            isTablet ? 45 : 60,
                            isTablet ? 36 : 48,
                            gapStart,
                            gapEnd
                          )}
                          fill="none"
                          stroke={color}
                          strokeWidth={isTablet ? 12 : 16}
                          opacity={0.15}
                          strokeLinecap="round"
                        />

                        {/* Enhanced center circle with gradient */}
                        <circle
                          cx={isTablet ? 45 : 60}
                          cy={isTablet ? 45 : 60}
                          r={isTablet ? 26 : 36}
                          fill={`url(#center-gradient-${idx})`}
                          stroke={selectedMilestone === idx ? color : "none"}
                          strokeWidth={selectedMilestone === idx ? 4 : 0}
                          style={{
                            transition: "stroke-width 0.2s, r 0.2s",
                          }}
                        />

                        {/* Enhanced year text */}
                        <text
                          x={isTablet ? 45 : 60}
                          y={isTablet ? 52 : 70}
                          textAnchor="middle"
                          fontFamily="var(--font-mono)"
                          fontWeight="800"
                          fontSize={isTablet ? "1.1rem" : "1.4rem"}
                          fill={color}
                          style={{
                            letterSpacing: 3,
                            textShadow: `0 1px 3px ${color}60`,
                            filter: `drop-shadow(0 1px 2px ${shadeColor(color, 0.9)}90)`,
                          }}
                        >
                          {item.year}
                        </text>
                      </svg>

                      {/* Hover tooltip */}
                      {hoveredIdx === idx && (
                        <div
                          style={{
                            position: "absolute",
                            top: "50%",
                            left: isEven ? undefined : isTablet ? 100 : 140,
                            right: isEven ? (isTablet ? 100 : 140) : undefined,
                            transform: "translateY(-50%)",
                            color,
                            fontFamily: "var(--font-mono)",
                            fontWeight: 800,
                            fontSize: isTablet ? 12 : 15,
                            letterSpacing: 1,
                            textAlign: "center",
                            whiteSpace: "nowrap",
                            pointerEvents: "none",
                            background: `linear-gradient(135deg, ${shadeColor(color, 0.95)}95, ${shadeColor(color, 0.9)}90)`,
                            borderRadius: 8,
                            boxShadow: `0 4px 12px ${color}30, 0 2px 6px ${color}20`,
                            padding: isTablet ? "2px 12px" : "4px 16px",
                            border: `2px solid ${color}`,
                            backdropFilter: "blur(8px)",
                          }}
                        >
                          {Math.round((animatedProgress[idx] ?? 0) * 100)}%
                        </div>
                      )}

                      {/* Text block below for odd rings */}
                      {!isEven && (
                        <>
                          <svg
                            width={2}
                            height={isTablet ? 28 : 38}
                            style={{
                              display: "block",
                              marginTop: isTablet ? -4 : -8,
                            }}
                          >
                            <line
                              x1={1}
                              y1={0}
                              x2={1}
                              y2={
                                (isTablet ? 28 : 38) * animatedLineProgress[idx]
                              }
                              stroke={color}
                              strokeWidth={2}
                              style={{ transition: "y2 0.18s" }}
                            />
                          </svg>
                          <div
                            className="mt-8 text-center"
                            style={{ minHeight: isTablet ? 60 : 80 }}
                          >
                            <div
                              className="font-bold mb-1"
                              style={{
                                color,
                                fontFamily: "var(--font-mono)",
                                fontSize: isTablet ? "16px" : "24px",
                                letterSpacing: 1.5,
                                marginBottom: isTablet ? "4px" : "6px",
                                textShadow: `0 2px 4px ${color}30, 0 1px 2px ${shadeColor(color, 0.6)}40`,
                                lineHeight: 1.2,
                              }}
                            >
                              {item.title}
                            </div>
                            <div
                              className="text-base"
                              style={{
                                color: shadeColor(color, 0.3),
                                fontFamily: "var(--font-mono)",
                                fontWeight: 600,
                                lineHeight: 1.5,
                                marginTop: isTablet ? "6px" : "10px",
                                fontSize: isTablet ? "11px" : "17px",
                                opacity: 0.9,
                                letterSpacing: 0.5,
                                textShadow: `0 1px 2px ${color}15`,
                              }}
                            >
                              {item.desc}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {viewMode === "stats" && (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="text-lg font-bold mb-2">
                    Timeline Statistics
                  </div>
                  <div className="text-sm text-gray-500">
                    Detailed statistics coming soon...
                  </div>
                </div>
              </div>
            )}

            {viewMode === "achievements" && (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="text-lg font-bold mb-2">
                    Milestone Achievements
                  </div>
                  <div className="text-sm text-gray-500">
                    Achievement system coming soon...
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation buttons */}
        {currentSlide !== undefined && setCurrentSlide && (
          <SlideNavigation
            currentSlide={currentSlide}
            setCurrentSlide={setCurrentSlide}
            totalSlides={17}
          />
        )}
      </WidgetBase>
    </div>
  );
}
