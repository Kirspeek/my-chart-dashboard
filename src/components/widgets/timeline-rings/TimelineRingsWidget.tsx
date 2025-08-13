import React, { useState, useRef, useEffect } from "react";
import { useTheme } from "src/hooks/useTheme";
import WidgetBase from "../../common/WidgetBase";
import { WidgetTitle } from "../../common";
import SlideNavigation from "../../common/SlideNavigation";
import type { TimelineItem } from "../../../../interfaces/charts";

// Utility to lighten/darken a hex color
function shadeColor(color: string, percent: number) {
  let R = parseInt(color.substring(1, 3), 16);
  let G = parseInt(color.substring(3, 5), 16);
  let B = parseInt(color.substring(5, 7), 16);
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
function darkenColor(color: string, percent: number) {
  let R = parseInt(color.substring(1, 3), 16);
  let G = parseInt(color.substring(3, 5), 16);
  let B = parseInt(color.substring(5, 7), 16);
  R = Math.round(R * (1 - percent));
  G = Math.round(G * (1 - percent));
  B = Math.round(B * (1 - percent));
  return (
    "#" +
    R.toString(16).padStart(2, "0") +
    G.toString(16).padStart(2, "0") +
    B.toString(16).padStart(2, "0")
  );
}

type RingColorKey = "yellow" | "red" | "blue" | "teal" | "purple";
const colorMap = (
  accent: Record<string, string>
): Record<RingColorKey, string> => ({
  yellow: accent.yellow,
  red: accent.red,
  blue: accent.blue,
  teal: accent.teal,
  purple: "#b39ddb", // fallback for purple, not in theme
});

// SVG arc helper for a half-circle (left or right)
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
  const { accent, colors } = useTheme();
  const ringColors = colorMap(accent);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const widgetRef = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [timelineData, setTimelineData] = useState<TimelineItem[]>([]);
  const [animatedProgress, setAnimatedProgress] = useState<number[]>([]);
  const [animatedLineProgress, setAnimatedLineProgress] = useState<number[]>(
    []
  );

  // Detect mobile to apply responsive sizing
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  React.useEffect(() => {
    const check = () => {
      if (typeof window !== "undefined") {
        const width = window.innerWidth;
        // Mobile: ≤425px, Tablet: 426px-1024px, Desktop: >1024px
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
      setHasAnimated(false); // Reset animation state when data loads
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
            minHeight: isMobile ? 150 : isTablet ? 280 : 340, // Reduced height for mobile
            position: "relative",
            gap: isMobile ? "1px" : isTablet ? "16px" : "48px", // Further reduced gap for mobile
            flexDirection: isMobile ? "column" : "row",
            alignItems: isMobile ? "center" : "center",
            marginTop: isMobile ? "1rem" : "4rem", // Reduced margin for mobile
          }}
        >
          {isMobile ? (
            // Mobile layout: 3 blocks on top, 2 blocks below
            <>
              {/* Top row: 3 blocks */}
              <div
                className="flex flex-row items-end justify-center gap-1 w-full" // Reduced from gap-2 to gap-1
                style={{ marginBottom: "2px" }} // Reduced from 4px to 2px
              >
                {timelineData.slice(0, 3).map((item, idx) => {
                  const color = ringColors[item.color as RingColorKey];
                  const arcStart = 0;
                  const arcEnd = arcStart + 360 * (animatedProgress[idx] ?? 0);
                  const gapStart = arcEnd;
                  const gapEnd = 360;
                  return (
                    <div
                      key={item.year}
                      className="flex flex-col items-center relative"
                      style={{ width: isMobile ? "80px" : "100px" }} // Further reduced for mobile
                    >
                      {/* Text block above */}
                      <div
                        className="mb-1 text-center" // Reduced from mb-2 to mb-1
                        style={{
                          color,
                          fontFamily: "var(--font-mono)",
                          fontWeight: 700,
                          fontSize: isMobile ? "6px" : "8px", // Further reduced for mobile
                          letterSpacing: 0.5, // Reduced from 1 to 0.5
                          marginBottom: "1px",
                          lineHeight: 1.2, // Added for better text fitting
                        }}
                      >
                        {item.title}
                      </div>
                      <div
                        className="text-base mb-1" // Reduced from mb-2 to mb-1
                        style={{
                          color: colors.secondary,
                          fontFamily: "var(--font-mono)",
                          fontWeight: 500,
                          lineHeight: 1.2, // Reduced from 1.4 to 1.2
                          fontSize: isMobile ? "4px" : "6px", // Further reduced for mobile
                          marginBottom: "1px",
                        }}
                      >
                        {item.desc}
                      </div>
                      {/* Line between text and ring */}
                      <svg
                        width={2}
                        height={12} // Reduced from 16 to 12
                        style={{ display: "block", marginBottom: -1 }} // Reduced from -2 to -1
                      >
                        <line
                          x1={1}
                          y1={12} // Reduced from 16 to 12
                          x2={1}
                          y2={12 - 12 * animatedLineProgress[idx]} // Reduced from 16 to 12
                          stroke={color}
                          strokeWidth={2}
                          style={{ transition: "y2 0.18s" }}
                        />
                      </svg>
                      {/* Ring */}
                      <svg
                        width={isMobile ? 50 : 60} // Further reduced for mobile
                        height={isMobile ? 50 : 60} // Further reduced for mobile
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
                            <stop
                              offset="0%"
                              stopColor={shadeColor(color, 0.45)}
                            />
                            <stop offset="30%" stopColor={color} />
                            <stop
                              offset="100%"
                              stopColor={darkenColor(color, 0.18)}
                            />
                          </linearGradient>
                          <radialGradient
                            id={`center-gradient-${idx}`}
                            cx="50%"
                            cy="40%"
                            r="60%"
                          >
                            <stop
                              offset="0%"
                              stopColor="#fff"
                              stopOpacity="1"
                            />
                            <stop
                              offset="80%"
                              stopColor="#eaeaea"
                              stopOpacity="0.7"
                            />
                            <stop
                              offset="100%"
                              stopColor="#d0d0d0"
                              stopOpacity="0.3"
                            />
                          </radialGradient>
                        </defs>
                        <path
                          d={describeArc(
                            isMobile ? 25 : 30,
                            isMobile ? 25 : 30,
                            isMobile ? 20 : 24,
                            arcStart,
                            arcEnd
                          )} // Adjusted for mobile
                          fill="none"
                          stroke={color}
                          strokeWidth={isMobile ? 6 : 8} // Reduced for mobile
                          opacity={
                            hoveredIdx === null
                              ? 1
                              : hoveredIdx === idx
                                ? 1
                                : 0.5
                          }
                          strokeLinecap="round"
                          style={{
                            cursor: "pointer",
                            transition: "opacity 0.18s",
                          }}
                          onMouseMove={() => setHoveredIdx(idx)}
                          onMouseEnter={() => setHoveredIdx(idx)}
                        />
                        <path
                          d={describeArc(
                            isMobile ? 25 : 30,
                            isMobile ? 25 : 30,
                            isMobile ? 20 : 24,
                            gapStart,
                            gapEnd
                          )} // Adjusted for mobile
                          fill="none"
                          stroke={color}
                          strokeWidth={isMobile ? 6 : 8} // Reduced for mobile
                          opacity={0.18}
                          strokeLinecap="round"
                        />
                        <circle
                          cx={isMobile ? 25 : 30} // Adjusted for mobile
                          cy={isMobile ? 25 : 30} // Adjusted for mobile
                          r={isMobile ? 15 : 18} // Adjusted for mobile
                          fill="#fff"
                          stroke="none"
                        />
                        <text
                          x={isMobile ? 25 : 30} // Adjusted for mobile
                          y={isMobile ? 30 : 35} // Adjusted for mobile
                          textAnchor="middle"
                          fontFamily="var(--font-mono)"
                          fontWeight="bold"
                          fontSize={isMobile ? "0.5rem" : "0.7rem"} // Reduced for mobile
                          fill={color}
                          style={{ letterSpacing: 2 }}
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
                            left: 70, // Reduced from 90 to 70
                            transform: "translateY(-50%)",
                            color,
                            fontFamily: "var(--font-mono)",
                            fontWeight: 800,
                            fontSize: 10, // Reduced from 12 to 10
                            letterSpacing: 0.5, // Reduced from 1 to 0.5
                            textAlign: "center",
                            whiteSpace: "nowrap",
                            pointerEvents: "none",
                            background: "#fff",
                            borderRadius: 6, // Reduced from 8 to 6
                            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                            padding: "1px 6px", // Reduced from 2px 8px to 1px 6px
                            border: `2px solid ${color}`,
                          }}
                        >
                          {Math.round((animatedProgress[idx] ?? 0) * 100)}%
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              {/* Bottom row: 2 blocks */}
              <div className="flex flex-row items-end justify-center gap-1 w-full">
                {" "}
                {/* Reduced from gap-2 to gap-1 */}
                {timelineData.slice(3, 5).map((item, idx) => {
                  const color = ringColors[item.color as RingColorKey];
                  const actualIdx = idx + 3;
                  const arcStart = 0;
                  const arcEnd =
                    arcStart + 360 * (animatedProgress[actualIdx] ?? 0);
                  const gapStart = arcEnd;
                  const gapEnd = 360;
                  return (
                    <div
                      key={item.year}
                      className="flex flex-col items-center relative"
                      style={{ width: isMobile ? "80px" : "100px" }} // Consistent with top row
                    >
                      {/* Ring first */}
                      <svg
                        width={isMobile ? 50 : 60} // Consistent with top row
                        height={isMobile ? 50 : 60} // Consistent with top row
                        style={{ zIndex: 1, display: "block" }}
                        onMouseLeave={() => setHoveredIdx(null)}
                      >
                        <defs>
                          <filter
                            id={`arc-shadow-${actualIdx}`}
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
                            id={`arc-gradient-${actualIdx}`}
                            x1="0"
                            y1="0"
                            x2="1"
                            y2="1"
                          >
                            <stop
                              offset="0%"
                              stopColor={shadeColor(color, 0.45)}
                            />
                            <stop offset="30%" stopColor={color} />
                            <stop
                              offset="100%"
                              stopColor={darkenColor(color, 0.18)}
                            />
                          </linearGradient>
                          <radialGradient
                            id={`center-gradient-${actualIdx}`}
                            cx="50%"
                            cy="40%"
                            r="60%"
                          >
                            <stop
                              offset="0%"
                              stopColor="#fff"
                              stopOpacity="1"
                            />
                            <stop
                              offset="80%"
                              stopColor="#eaeaea"
                              stopOpacity="0.7"
                            />
                            <stop
                              offset="100%"
                              stopColor="#d0d0d0"
                              stopOpacity="0.3"
                            />
                          </radialGradient>
                        </defs>
                        <path
                          d={describeArc(
                            isMobile ? 25 : 30,
                            isMobile ? 25 : 30,
                            isMobile ? 20 : 24,
                            arcStart,
                            arcEnd
                          )} // Consistent with top row
                          fill="none"
                          stroke={color}
                          strokeWidth={isMobile ? 6 : 8} // Consistent with top row
                          opacity={
                            hoveredIdx === null
                              ? 1
                              : hoveredIdx === actualIdx
                                ? 1
                                : 0.5
                          }
                          strokeLinecap="round"
                          style={{
                            cursor: "pointer",
                            transition: "opacity 0.18s",
                          }}
                          onMouseMove={() => setHoveredIdx(actualIdx)}
                          onMouseEnter={() => setHoveredIdx(actualIdx)}
                        />
                        <path
                          d={describeArc(
                            isMobile ? 25 : 30,
                            isMobile ? 25 : 30,
                            isMobile ? 20 : 24,
                            gapStart,
                            gapEnd
                          )} // Consistent with top row
                          fill="none"
                          stroke={color}
                          strokeWidth={isMobile ? 6 : 8} // Consistent with top row
                          opacity={0.18}
                          strokeLinecap="round"
                        />
                        <circle
                          cx={isMobile ? 25 : 30} // Consistent with top row
                          cy={isMobile ? 25 : 30} // Consistent with top row
                          r={isMobile ? 15 : 18} // Consistent with top row
                          fill="#fff"
                          stroke="none"
                        />
                        <text
                          x={isMobile ? 25 : 30} // Consistent with top row
                          y={isMobile ? 30 : 35} // Consistent with top row
                          textAnchor="middle"
                          fontFamily="var(--font-mono)"
                          fontWeight="bold"
                          fontSize={isMobile ? "0.5rem" : "0.7rem"} // Consistent with top row
                          fill={color}
                          style={{ letterSpacing: 2 }}
                        >
                          {item.year}
                        </text>
                      </svg>
                      {/* Line between ring and text */}
                      <svg
                        width={2}
                        height={12} // Reduced from 16 to 12
                        style={{ display: "block", marginTop: -1 }} // Reduced from -2 to -1
                      >
                        <line
                          x1={1}
                          y1={0}
                          x2={1}
                          y2={12 * animatedLineProgress[actualIdx]} // Reduced from 16 to 12
                          stroke={color}
                          strokeWidth={2}
                          style={{ transition: "y2 0.18s" }}
                        />
                      </svg>
                      {/* Text block below */}
                      <div
                        className="mt-1 text-center" // Reduced from mt-2 to mt-1
                        style={{ minHeight: isMobile ? 30 : 40 }} // Reduced for mobile
                      >
                        <div
                          className="font-bold mb-1"
                          style={{
                            color,
                            fontFamily: "var(--font-mono)",
                            fontSize: isMobile ? "6px" : "8px", // Consistent with top row
                            letterSpacing: 0.5, // Reduced from 1 to 0.5
                            marginBottom: "1px", // Reduced from 2px to 1px
                            lineHeight: 1.2, // Added for better text fitting
                          }}
                        >
                          {item.title}
                        </div>
                        <div
                          className="text-base"
                          style={{
                            color: colors.secondary,
                            fontFamily: "var(--font-mono)",
                            fontWeight: 500,
                            lineHeight: 1.2, // Reduced from 1.4 to 1.2
                            marginTop: "2px", // Reduced from 4px to 2px
                            fontSize: isMobile ? "4px" : "6px", // Consistent with top row
                          }}
                        >
                          {item.desc}
                        </div>
                      </div>
                      {/* Hover tooltip */}
                      {hoveredIdx === actualIdx && (
                        <div
                          style={{
                            position: "absolute",
                            top: "50%",
                            right: 70, // Reduced from 90 to 70
                            transform: "translateY(-50%)",
                            color,
                            fontFamily: "var(--font-mono)",
                            fontWeight: 800,
                            fontSize: 10, // Reduced from 12 to 10
                            letterSpacing: 0.5, // Reduced from 1 to 0.5
                            textAlign: "center",
                            whiteSpace: "nowrap",
                            pointerEvents: "none",
                            background: "#fff",
                            borderRadius: 6, // Reduced from 8 to 6
                            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                            padding: "1px 6px", // Reduced from 2px 8px to 1px 6px
                            border: `2px solid ${color}`,
                          }}
                        >
                          {Math.round((animatedProgress[actualIdx] ?? 0) * 100)}
                          %
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            // Desktop/Tablet layout: original alternating layout
            timelineData
              .map((item, idx): [typeof item, number] => [item, idx])
              .map(([item, idx]) => {
                const color = ringColors[item.color as RingColorKey];
                const isEven = idx % 2 === 1;
                const arcStart = 0;
                const arcEnd = arcStart + 360 * (animatedProgress[idx] ?? 0);
                const gapStart = arcEnd;
                const gapEnd = 360;
                return (
                  <div
                    key={item.year}
                    className="flex flex-col items-center relative"
                    style={{ width: isTablet ? "140px" : "224px" }} // Further reduced width for larger tablets
                  >
                    {/* For even rings, text block above, line between ring and text above */}
                    {isEven && (
                      <>
                        <div
                          className="mb-2 text-center"
                          style={{
                            color,
                            fontFamily: "var(--font-mono)",
                            fontWeight: 700,
                            fontSize: isTablet ? "14px" : "22px", // Further reduced font for larger tablets
                            letterSpacing: 1,
                            marginBottom: isTablet ? "4px" : "8px", // Reduced margin for tablet
                          }}
                        >
                          {item.title}
                        </div>
                        <div
                          className="text-base mb-2"
                          style={{
                            color: colors.secondary,
                            fontFamily: "var(--font-mono)",
                            fontWeight: 500,
                            lineHeight: 1.4,
                            fontSize: isTablet ? "10px" : "16px", // Further reduced font for larger tablets
                            marginBottom: isTablet ? "4px" : "8px", // Reduced margin for tablet
                          }}
                        >
                          {item.desc}
                        </div>
                        <svg
                          width={2}
                          height={isTablet ? 28 : 38} // Reduced height for tablet
                          style={{
                            display: "block",
                            marginBottom: isTablet ? -4 : -8, // Reduced margin for tablet
                          }}
                        >
                          <line
                            x1={1}
                            y1={isTablet ? 28 : 38} // Reduced height for tablet
                            x2={1}
                            y2={
                              (isTablet ? 28 : 38) -
                              (isTablet ? 28 : 38) * animatedLineProgress[idx]
                            } // Reduced height for tablet
                            stroke={color}
                            strokeWidth={2}
                            style={{ transition: "y2 0.18s" }}
                          />
                        </svg>
                      </>
                    )}
                    {/* Ring SVG */}
                    <svg
                      width={isTablet ? 90 : 120} // Reduced width for tablet
                      height={isTablet ? 90 : 120} // Reduced height for tablet
                      style={{ zIndex: 1, display: "block" }}
                      onMouseLeave={() => {
                        setHoveredIdx(null);
                      }}
                    >
                      {/* SVG defs for gradients and shadow */}
                      <defs>
                        {/* Drop shadow filter for arc */}
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
                        {/* Linear gradient for arc with highlight and shadow */}
                        <linearGradient
                          id={`arc-gradient-${idx}`}
                          x1="0"
                          y1="0"
                          x2="1"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor={shadeColor(color, 0.45)}
                          />
                          <stop offset="30%" stopColor={color} />
                          <stop
                            offset="100%"
                            stopColor={darkenColor(color, 0.18)}
                          />
                        </linearGradient>
                        {/* Radial gradient for center circle */}
                        <radialGradient
                          id={`center-gradient-${idx}`}
                          cx="50%"
                          cy="40%"
                          r="60%"
                        >
                          <stop offset="0%" stopColor="#fff" stopOpacity="1" />
                          <stop
                            offset="80%"
                            stopColor="#eaeaea"
                            stopOpacity="0.7"
                          />
                          <stop
                            offset="100%"
                            stopColor="#d0d0d0"
                            stopOpacity="0.3"
                          />
                        </radialGradient>
                      </defs>
                      {/* Colored arc: arcStart to arcEnd (animated) */}
                      <path
                        d={describeArc(
                          isTablet ? 45 : 60, // Reduced center for tablet
                          isTablet ? 45 : 60, // Reduced center for tablet
                          isTablet ? 36 : 48, // Reduced radius for tablet
                          arcStart,
                          arcEnd
                        )}
                        fill="none"
                        stroke={color}
                        strokeWidth={isTablet ? 10 : 14} // Reduced stroke width for tablet
                        opacity={
                          hoveredIdx === null ? 1 : hoveredIdx === idx ? 1 : 0.5
                        }
                        strokeLinecap="round"
                        style={{
                          cursor: "pointer",
                          transition: "opacity 0.18s",
                        }}
                        onMouseMove={() => {
                          setHoveredIdx(idx);
                        }}
                        onMouseEnter={() => {
                          setHoveredIdx(idx);
                        }}
                      />
                      {/* Faded arc: gapStart to gapEnd (remaining part) */}
                      <path
                        d={describeArc(
                          isTablet ? 45 : 60, // Reduced center for tablet
                          isTablet ? 45 : 60, // Reduced center for tablet
                          isTablet ? 36 : 48, // Reduced radius for tablet
                          gapStart,
                          gapEnd
                        )}
                        fill="none"
                        stroke={color}
                        strokeWidth={isTablet ? 10 : 14} // Reduced stroke width for tablet
                        opacity={0.18}
                        strokeLinecap="round"
                      />
                      {/* Center white circle (flat) */}
                      <circle
                        cx={isTablet ? 45 : 60} // Reduced center for tablet
                        cy={isTablet ? 45 : 60} // Reduced center for tablet
                        r={isTablet ? 28 : 38} // Reduced radius for tablet
                        fill="#fff"
                        stroke="none"
                      />
                      {/* Year */}
                      <text
                        x={isTablet ? 45 : 60} // Reduced center for tablet
                        y={isTablet ? 52 : 70} // Reduced center for tablet
                        textAnchor="middle"
                        fontFamily="var(--font-mono)"
                        fontWeight="bold"
                        fontSize={isTablet ? "1rem" : "1.3rem"} // Smaller font for tablet
                        fill={colors.secondary}
                        style={{ letterSpacing: 2 }}
                      >
                        {item.year}
                      </text>
                    </svg>
                    {/* Show percent value to the side of the circle on hover, visually balanced */}
                    {hoveredIdx === idx && (
                      <div
                        style={{
                          position: "absolute",
                          top: "50%",
                          left: isEven ? undefined : isTablet ? 100 : 140, // Reduced position for tablet
                          right: isEven ? (isTablet ? 100 : 140) : undefined, // Reduced position for tablet
                          transform: "translateY(-50%)",
                          color,
                          fontFamily: "var(--font-mono)",
                          fontWeight: 800,
                          fontSize: isTablet ? 12 : 15, // Smaller font for tablet
                          letterSpacing: 1,
                          textAlign: "center",
                          whiteSpace: "nowrap",
                          pointerEvents: "none",
                          background: "#fff",
                          borderRadius: 8,
                          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                          padding: isTablet ? "2px 12px" : "4px 16px", // Reduced padding for tablet
                          border: `2px solid ${color}`,
                        }}
                      >
                        {Math.round((animatedProgress[idx] ?? 0) * 100)}%
                      </div>
                    )}
                    {/* For even rings, add margin below ring to balance layout */}
                    {isEven && <div style={{ height: isTablet ? 12 : 16 }} />}{" "}
                    {/* Reduced height for tablet */}
                    {/* For odd rings, line between ring and text below, then text block */}
                    {!isEven && (
                      <>
                        <svg
                          width={2}
                          height={isTablet ? 28 : 38} // Reduced height for tablet
                          style={{
                            display: "block",
                            marginTop: isTablet ? -4 : -8, // Reduced margin for tablet
                          }}
                        >
                          <line
                            x1={1}
                            y1={0}
                            x2={1}
                            y2={
                              (isTablet ? 28 : 38) * animatedLineProgress[idx]
                            } // Reduced height for tablet
                            stroke={color}
                            strokeWidth={2}
                            style={{ transition: "y2 0.18s" }}
                          />
                        </svg>
                        <div
                          className="mt-8 text-center"
                          style={{ minHeight: isTablet ? 60 : 80 }} // Reduced height for tablet
                        >
                          <div
                            className="font-bold mb-1"
                            style={{
                              color,
                              fontFamily: "var(--font-mono)",
                              fontSize: isTablet ? "14px" : "22px", // Further reduced font for larger tablets
                              letterSpacing: 1,
                              marginBottom: isTablet ? "2px" : "4px", // Reduced margin for tablet
                            }}
                          >
                            {item.title}
                          </div>
                          <div
                            className="text-base"
                            style={{
                              color: colors.secondary,
                              fontFamily: "var(--font-mono)",
                              fontWeight: 500,
                              lineHeight: 1.4,
                              marginTop: isTablet ? "4px" : "8px", // Reduced margin for tablet
                              fontSize: isTablet ? "10px" : "16px", // Further reduced font for larger tablets
                            }}
                          >
                            {item.desc}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                );
              })
          )}
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
