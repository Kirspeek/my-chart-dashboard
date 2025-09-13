import React from "react";
import type { TimelineRingItemDesktopProps } from "@/interfaces/timeline";
import { describeArc, shadeColor, darkenColor } from "@/utils/timelineUtils";

export default function TimelineRingItemDesktop({
  item,
  idx,
  color,
  isTablet,
  isEven,
  timelineRingsColors,
  animatedProgress,
  animatedLineProgress,
  hoveredIdx,
  setHoveredIdx,
  secondaryColor,
}: TimelineRingItemDesktopProps) {
  const arcStart = 0;
  const arcEnd = arcStart + 360 * (animatedProgress ?? 0);
  const gapStart = arcEnd;
  const gapEnd = 360;

  return (
    <div
      className="flex flex-col items-center relative"
      style={{ width: isTablet ? "120px" : "180px" }}
    >
      {isEven && (
        <>
          <div
            className="mb-2 text-center"
            style={{
              color,
              fontFamily: "var(--font-mono)",
              fontWeight: 600,
              fontSize: isTablet ? "10px" : "14px",
              letterSpacing: 0.6,
              marginBottom: isTablet ? "3px" : "5px",
              textAlign: "center",
            }}
          >
            {item.title}
          </div>
          <div
            className="text-base mb-2"
            style={{
              color: secondaryColor,
              fontFamily: "var(--font-mono)",
              fontWeight: 400,
              lineHeight: 1.2,
              fontSize: isTablet ? "8px" : "11px",
              marginBottom: isTablet ? "3px" : "5px",
              textAlign: "center",
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
                (isTablet ? 28 : 38) * (animatedLineProgress ?? 0)
              }
              stroke={color}
              strokeWidth={0.5}
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
          d={describeArc(
            isTablet ? 40 : 50,
            isTablet ? 40 : 50,
            isTablet ? 30 : 40,
            arcStart,
            arcEnd
          )}
          fill="none"
          stroke={color}
          strokeWidth={isTablet ? 0.3 : 0.5}
          opacity={hoveredIdx === null ? 1 : hoveredIdx === idx ? 1 : 0.5}
          strokeLinecap="round"
          style={{ cursor: "pointer", transition: "opacity 0.18s" }}
          onMouseMove={() => setHoveredIdx(idx)}
          onMouseEnter={() => setHoveredIdx(idx)}
        />
        <path
          d={describeArc(
            isTablet ? 40 : 50,
            isTablet ? 40 : 50,
            isTablet ? 30 : 40,
            gapStart,
            gapEnd
          )}
          fill="none"
          stroke={color}
          strokeWidth={isTablet ? 0.3 : 0.5}
          opacity={0.18}
          strokeLinecap="round"
        />
        <circle
          cx={isTablet ? 40 : 50}
          cy={isTablet ? 40 : 50}
          r={isTablet ? 24 : 32}
          fill={timelineRingsColors.fill}
          stroke="none"
        />
        <text
          x={isTablet ? 40 : 50}
          y={isTablet ? 46 : 56}
          textAnchor="middle"
          fontFamily="var(--font-mono)"
          fontWeight="bold"
          fontSize={isTablet ? "0.7rem" : "0.9rem"}
          fill={secondaryColor}
          style={{ letterSpacing: 2 }}
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
            background: "rgba(0,0,0,0.06)",
            borderRadius: 8,
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            padding: isTablet ? "2px 12px" : "4px 16px",
            border: `2px solid ${color}`,
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
              y2={(isTablet ? 28 : 38) * (animatedLineProgress ?? 0)}
              stroke={color}
              strokeWidth={0.5}
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
                fontSize: isTablet ? "14px" : "22px",
                letterSpacing: 1,
                marginBottom: isTablet ? "2px" : "4px",
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
                lineHeight: 1.4,
                marginTop: isTablet ? "4px" : "8px",
                fontSize: isTablet ? "10px" : "16px",
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
