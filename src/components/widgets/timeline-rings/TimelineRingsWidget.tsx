import React, { useState, useRef, useEffect } from "react";
import { useTheme } from "@/hooks/useTheme";
import WidgetBase from "@/components/common/WidgetBase";
import { WidgetTitle } from "@/components/common";
import SlideNavigation from "@/components/common/SlideNavigation";
import type { TimelineItem } from "@/interfaces/charts";
import { useTimelineResponsive } from "@/hooks/useTimelineResponsive";
import TimelineRingsMobile from "@/components/widgets/timeline-rings/TimelineRingsMobile";
import TimelineRingsDesktop from "@/components/widgets/timeline-rings/TimelineRingsDesktop";
import type { RingColorKey } from "@/interfaces/timeline";

export default function TimelineRingsWidget({
  onOpenSidebar,
  showSidebarButton = false,
  currentSlide,
  setCurrentSlide,
}: {
  onOpenSidebar?: () => void;
  showSidebarButton?: boolean;
  currentSlide?: number;
  setCurrentSlide?: (slide: number) => void;
}) {
  const { colors, colorsTheme } = useTheme();
  const timelineRingsColors = colorsTheme.widgets.timelineRings;
  const ringColors: Record<RingColorKey, string> = {
    yellow: colors.accent.yellow,
    red: colors.accent.red,
    blue: colors.accent.blue,
    teal: colors.accent.teal,
    purple: timelineRingsColors.purple,
  };
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const widgetRef = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [timelineData, setTimelineData] = useState<TimelineItem[]>([]);
  const [animatedProgress, setAnimatedProgress] = useState<number[]>([]);
  const [animatedLineProgress, setAnimatedLineProgress] = useState<number[]>(
    []
  );

  const { isMobile, isTablet } = useTimelineResponsive();

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

  if (timelineData.length === 0) return null;

  return (
    <div ref={widgetRef}>
      <WidgetBase
        className={`w-full flex flex-col pb-8 ${isMobile ? "timeline-rings-widget" : ""}`}
        onOpenSidebar={onOpenSidebar}
        showSidebarButton={showSidebarButton}
      >
        <WidgetTitle
          title="Timeline of Renewable Energy Milestones"
          variant="centered"
          size="md"
          className="ml-4"
        />

        <div
          className="flex flex-row items-end justify-center gap-12 w-full max-w-7xl mt-16"
          style={{
            minHeight: isMobile ? 120 : isTablet ? 200 : 200,
            position: "relative",
            gap: isMobile ? "8px" : isTablet ? "24px" : "32px",
            flexDirection: isMobile ? "column" : "row",
            alignItems: isMobile ? "center" : "center",
            marginTop: isMobile ? "0.5rem" : isTablet ? "2rem" : "3rem",
          }}
        >
          {isMobile ? (
            <TimelineRingsMobile
              timelineData={timelineData}
              ringColors={ringColors}
              animatedProgress={animatedProgress}
              animatedLineProgress={animatedLineProgress}
              hoveredIdx={hoveredIdx}
              setHoveredIdx={setHoveredIdx}
              timelineRingsColors={timelineRingsColors}
              secondaryColor={colors.secondary}
            />
          ) : (
            <TimelineRingsDesktop
              timelineData={timelineData}
              ringColors={ringColors}
              animatedProgress={animatedProgress}
              animatedLineProgress={animatedLineProgress}
              hoveredIdx={hoveredIdx}
              setHoveredIdx={setHoveredIdx}
              timelineRingsColors={timelineRingsColors}
              isTablet={isTablet}
              secondaryColor={colors.secondary}
            />
          )}
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
