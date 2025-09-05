import React from "react";
import TimelineRingItemMobile from "@/components/widgets/timeline-rings/TimelineRingItemMobile";
import type {
  RingColorKey,
  TimelineRingsMobileProps,
} from "@/interfaces/timeline";

// interfaces moved to src/interfaces/timeline.ts

export default function TimelineRingsMobile({
  timelineData,
  ringColors,
  animatedProgress,
  animatedLineProgress,
  hoveredIdx,
  setHoveredIdx,
  timelineRingsColors,
  secondaryColor,
}: TimelineRingsMobileProps) {
  return (
    <>
      <div
        className="flex flex-row items-end justify-center gap-1 w-full"
        style={{ marginBottom: "2px" }}
      >
        {timelineData.slice(0, 3).map((item, idx) => (
          <TimelineRingItemMobile
            key={item.year}
            item={item}
            idx={idx}
            color={ringColors[item.color as RingColorKey]}
            timelineRingsColors={timelineRingsColors}
            animatedProgress={animatedProgress[idx] ?? 0}
            animatedLineProgress={animatedLineProgress[idx] ?? 0}
            hoveredIdx={hoveredIdx}
            setHoveredIdx={setHoveredIdx}
            secondaryColor={secondaryColor}
            layout="top"
          />
        ))}
      </div>
      <div className="flex flex-row items-end justify-center gap-1 w-full">
        {timelineData.slice(3, 5).map((item, idx) => {
          const actualIdx = idx + 3;
          return (
            <TimelineRingItemMobile
              key={item.year}
              item={item}
              idx={actualIdx}
              color={ringColors[item.color as RingColorKey]}
              timelineRingsColors={timelineRingsColors}
              animatedProgress={animatedProgress[actualIdx] ?? 0}
              animatedLineProgress={animatedLineProgress[actualIdx] ?? 0}
              hoveredIdx={hoveredIdx}
              setHoveredIdx={setHoveredIdx}
              secondaryColor={secondaryColor}
              layout="bottom"
            />
          );
        })}
      </div>
    </>
  );
}
