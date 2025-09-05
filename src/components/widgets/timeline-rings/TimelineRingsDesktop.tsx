import React from "react";
import TimelineRingItemDesktop from "@/components/widgets/timeline-rings/TimelineRingItemDesktop";
import type {
  RingColorKey,
  TimelineRingsDesktopProps,
} from "@/interfaces/timeline";

// interfaces moved to src/interfaces/timeline.ts

export default function TimelineRingsDesktop({
  timelineData,
  ringColors,
  animatedProgress,
  animatedLineProgress,
  hoveredIdx,
  setHoveredIdx,
  timelineRingsColors,
  isTablet,
  secondaryColor,
}: TimelineRingsDesktopProps) {
  return (
    <>
      {timelineData.map((item, idx) => (
        <TimelineRingItemDesktop
          key={item.year}
          item={item}
          idx={idx}
          color={ringColors[item.color as RingColorKey]}
          isTablet={isTablet}
          isEven={idx % 2 === 1}
          timelineRingsColors={timelineRingsColors}
          animatedProgress={animatedProgress[idx] ?? 0}
          animatedLineProgress={animatedLineProgress[idx] ?? 0}
          hoveredIdx={hoveredIdx}
          setHoveredIdx={setHoveredIdx}
          secondaryColor={secondaryColor}
        />
      ))}
    </>
  );
}
