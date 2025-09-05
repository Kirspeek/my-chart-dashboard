"use client";

import React, { useState, useRef, useEffect } from "react";
import { useTheme } from "@/hooks/useTheme";
import { useGlobalTooltip } from "@/hooks/useGlobalTooltip";
import WidgetBase from "@/components/common/WidgetBase";
import { WidgetTitle } from "@/components/common";
import SlideNavigation from "@/components/common/SlideNavigation";
import TimelineHeaderStats from "@/components/widgets/timeline-rings/TimelineHeaderStats";
import TimelineControls from "@/components/widgets/timeline-rings/TimelineControls";
import TimelineStatsView from "@/components/widgets/timeline-rings/TimelineStatsView";
import TimelineAchievementsView from "@/components/widgets/timeline-rings/TimelineAchievementsView";
import type { TimelineItem } from "@/interfaces/charts";
import { describeArc, shadeColor } from "@/utils/timelineUtils";
import type { EnhancedTimelineWidgetProps } from "@/interfaces/timeline";

export default function EnhancedTimelineWidget({
  onOpenSidebar,
  showSidebarButton = false,
  currentSlide,
  setCurrentSlide,
}: EnhancedTimelineWidgetProps) {
  const { colors, colorsTheme } = useTheme();
  const timelineRingsColors = colorsTheme.widgets.timelineRings;
  useGlobalTooltip();

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

  useEffect(() => {
    import("../../../data/json/timelineData.json").then((mod) => {
      const arr = (mod.default ?? mod) as TimelineItem[];
      setTimelineData(arr);
      setAnimatedProgress(new Array(arr.length).fill(0));
      setAnimatedLineProgress(new Array(arr.length).fill(0));
      setHasAnimated(false);
    });
  }, []);

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

  useEffect(() => {
    if (!hasAnimated || timelineData.length === 0) return;
    let cancelled = false;

    async function animateAll() {
      for (let idx = 0; idx < timelineData.length; idx++) {
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

  const handleReset = () => {
    setSelectedMilestone(null);
    setHoveredIdx(null);
    setAnimatedProgress(new Array(timelineData.length).fill(0));
    setAnimatedLineProgress(new Array(timelineData.length).fill(0));
    setHasAnimated(false);
  };

  const totalMilestones = timelineData.length;
  const completedMilestones = timelineData.filter(
    (item, idx) => (animatedProgress[idx] ?? 0) >= (item.progress ?? 0.9)
  ).length;
  const averageProgress =
    timelineData.reduce(
      (sum, item, idx) => sum + (animatedProgress[idx] ?? 0),
      0
    ) / timelineData.length;

  const getMilestoneColor = (idx: number) => {
    const colorKeys = ["yellow", "red", "blue", "teal", "purple"] as const;
    const colorMap = {
      yellow: colors.accent.yellow,
      red: colors.accent.red,
      blue: colors.accent.blue,
      teal: colors.accent.teal,
      purple: timelineRingsColors.purple,
    };
    return (
      colorMap[colorKeys[idx % colorKeys.length]] ||
      timelineRingsColors.fallback
    );
  };

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

          <TimelineHeaderStats
            totalMilestones={totalMilestones}
            completedMilestones={completedMilestones}
            averageProgress={averageProgress}
          />

          <TimelineControls
            viewMode={viewMode}
            setViewMode={(m) => setViewMode(m)}
            isMobile={isMobile}
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying}
            animationSpeed={animationSpeed}
            setAnimationSpeed={(s) => setAnimationSpeed(s)}
            onReset={handleReset}
            showDetails={showDetails}
            setShowDetails={setShowDetails}
          />

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

                        <circle
                          cx={isTablet ? 45 : 60}
                          cy={isTablet ? 45 : 60}
                          r={isTablet ? 26 : 36}
                          fill="transparent"
                          stroke={selectedMilestone === idx ? color : "none"}
                          strokeWidth={selectedMilestone === idx ? 4 : 0}
                          style={{
                            transition: "stroke-width 0.2s, r 0.2s",
                          }}
                        />

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
              <div className="h-full w-full">
                <TimelineStatsView
                  data={timelineData}
                  progressByIndex={animatedProgress}
                />
              </div>
            )}

            {viewMode === "achievements" && (
              <div className="h-full w-full">
                <TimelineAchievementsView
                  data={timelineData}
                  progressByIndex={animatedProgress}
                />
              </div>
            )}
          </div>
        </div>

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
