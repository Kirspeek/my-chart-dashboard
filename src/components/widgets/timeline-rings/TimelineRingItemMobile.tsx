import React from "react";
import type { TimelineRingItemMobileProps } from "@/interfaces/timeline";
import { describeArc, shadeColor, darkenColor } from "@/utils/timelineUtils";

export default function TimelineRingItemMobile({
  item,
  idx,
  color,
  timelineRingsColors,
  animatedProgress,
  animatedLineProgress,
  hoveredIdx,
  setHoveredIdx,
  secondaryColor,
  layout,
}: TimelineRingItemMobileProps) {
  const arcStart = 0;
  const arcEnd = arcStart + 360 * (animatedProgress ?? 0);
  const gapStart = arcEnd;
  const gapEnd = 360;

  return (
    <div
      className="flex flex-col items-center relative"
      style={{ width: "80px" }}
    >
      {layout === "top" && (
        <>
          <div
            className="mb-1 text-center"
            style={{
              color,
              fontFamily: "var(--font-mono)",
              fontWeight: 700,
              fontSize: "6px",
              letterSpacing: 0.5,
              marginBottom: "1px",
              lineHeight: 1.2,
            }}
          >
            {item.title}
          </div>
          <div
            className="text-base mb-1"
            style={{
              color: secondaryColor,
              fontFamily: "var(--font-mono)",
              fontWeight: 500,
              lineHeight: 1.2,
              fontSize: "4px",
              marginBottom: "1px",
            }}
          >
            {item.desc}
          </div>
          <svg
            width={2}
            height={12}
            style={{ display: "block", marginBottom: -1 }}
          >
            <line
              x1={1}
              y1={12}
              x2={1}
              y2={12 - 12 * (animatedLineProgress ?? 0)}
              stroke={color}
              strokeWidth={2}
              style={{ transition: "y2 0.18s" }}
            />
          </svg>
        </>
      )}

      <svg
        width={50}
        height={50}
        style={{ zIndex: 1, display: "block" }}
        onMouseLeave={() => setHoveredIdx(null)}
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
              dy="2"
              stdDeviation="2"
              floodColor={color}
              floodOpacity="0.18"
            />
          </filter>
          <linearGradient
            id={`arc-gradient-${idx}`}
            x1="0"
            y1="0"
            x2="1"
            y2="1"
          >
            <stop offset="0%" stopColor={shadeColor(color, 0.45)} />
            <stop offset="30%" stopColor={color} />
            <stop offset="100%" stopColor={darkenColor(color, 0.18)} />
          </linearGradient>
          <radialGradient
            id={`center-gradient-${idx}`}
            cx="50%"
            cy="40%"
            r="60%"
          >
            <stop
              offset="0%"
              stopColor={timelineRingsColors.gradient.stop1}
              stopOpacity="1"
            />
            <stop
              offset="80%"
              stopColor={timelineRingsColors.gradient.stop2}
              stopOpacity="0.7"
            />
            <stop
              offset="100%"
              stopColor={timelineRingsColors.gradient.stop3}
              stopOpacity="0.3"
            />
          </radialGradient>
        </defs>
        <path
          d={describeArc(25, 25, 20, arcStart, arcEnd)}
          fill="none"
          stroke={color}
          strokeWidth={6}
          opacity={hoveredIdx === null ? 1 : hoveredIdx === idx ? 1 : 0.5}
          strokeLinecap="round"
          style={{ cursor: "pointer", transition: "opacity 0.18s" }}
          onMouseMove={() => setHoveredIdx(idx)}
          onMouseEnter={() => setHoveredIdx(idx)}
        />
        <path
          d={describeArc(25, 25, 20, gapStart, gapEnd)}
          fill="none"
          stroke={color}
          strokeWidth={6}
          opacity={0.18}
          strokeLinecap="round"
        />
        <circle
          cx={25}
          cy={25}
          r={15}
          fill={timelineRingsColors.fill}
          stroke="none"
        />
        <text
          x={25}
          y={30}
          textAnchor="middle"
          fontFamily="var(--font-mono)"
          fontWeight="bold"
          fontSize={"0.5rem"}
          fill={color}
          style={{ letterSpacing: 2 }}
        >
          {item.year}
        </text>
      </svg>

      {layout === "bottom" && (
        <>
          <svg
            width={2}
            height={12}
            style={{ display: "block", marginTop: -1 }}
          >
            <line
              x1={1}
              y1={0}
              x2={1}
              y2={12 * (animatedLineProgress ?? 0)}
              stroke={color}
              strokeWidth={2}
              style={{ transition: "y2 0.18s" }}
            />
          </svg>
          <div className="mt-1 text-center" style={{ minHeight: 30 }}>
            <div
              className="font-bold mb-1"
              style={{
                color,
                fontFamily: "var(--font-mono)",
                fontSize: "6px",
                letterSpacing: 0.5,
                marginBottom: "1px",
                lineHeight: 1.2,
              }}
            >
              {item.title}
            </div>
            <div
              className="text-base"
              style={{
                color: secondaryColor,
                fontFamily: "var(--font-mono)",
                fontWeight: 500,
                lineHeight: 1.2,
                marginTop: "2px",
                fontSize: "4px",
              }}
            >
              {item.desc}
            </div>
          </div>
        </>
      )}

      {hoveredIdx === idx && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: layout === "top" ? 70 : undefined,
            right: layout === "bottom" ? 70 : undefined,
            transform: "translateY(-50%)",
            color,
            fontFamily: "var(--font-mono)",
            fontWeight: 800,
            fontSize: 10,
            letterSpacing: 0.5,
            textAlign: "center",
            whiteSpace: "nowrap",
            pointerEvents: "none",
            background: timelineRingsColors.background,
            borderRadius: 6,
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            padding: "1px 6px",
            border: `2px solid ${color}`,
          }}
        >
          {Math.round((animatedProgress ?? 0) * 100)}%
        </div>
      )}
    </div>
  );
}
