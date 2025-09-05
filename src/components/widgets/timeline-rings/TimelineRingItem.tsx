import React from "react";
import type { TimelineRingItemProps } from "@/interfaces/timeline";
import { describeArc, shadeColor } from "@/utils/timelineUtils";

export default function TimelineRingItem({
  item,
  idx,
  isTablet,
  color,
  hoveredIdx,
  setHoveredIdx,
  selectedMilestone,
  setSelectedMilestone,
  animatedProgress,
  animatedLineProgress,
}: TimelineRingItemProps) {
  const isEven = idx % 2 === 1;
  const arcStart = 0;
  const arcEnd = arcStart + 360 * (animatedProgress ?? 0);
  const gapStart = arcEnd;
  const gapEnd = 360;

  return (
    <div
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
            style={{ display: "block", marginBottom: isTablet ? -4 : -8 }}
          >
            <line
              x1={1}
              y1={isTablet ? 28 : 38}
              x2={1}
              y2={
                (isTablet ? 28 : 38) -
                (isTablet ? 28 : 38) * animatedLineProgress
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
          setSelectedMilestone(selectedMilestone === idx ? null : idx)
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
          opacity={hoveredIdx === null ? 1 : hoveredIdx === idx ? 1 : 0.4}
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
          style={{ transition: "stroke-width 0.2s, r 0.2s" }}
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
          {Math.round((animatedProgress ?? 0) * 100)}%
        </div>
      )}

      {isEven && <div style={{ height: isTablet ? 12 : 16 }} />}

      {!isEven && (
        <>
          <svg
            width={2}
            height={isTablet ? 28 : 38}
            style={{ display: "block", marginTop: isTablet ? -4 : -8 }}
          >
            <line
              x1={1}
              y1={0}
              x2={1}
              y2={(isTablet ? 28 : 38) * animatedLineProgress}
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
}
