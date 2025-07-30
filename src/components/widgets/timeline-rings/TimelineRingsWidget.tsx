import React, { useState, useRef, useEffect } from "react";
import { useTheme } from "src/hooks/useTheme";
import WidgetBase from "../../common/WidgetBase";
import type { TimelineItem } from "../../../../interfaces/widgets";

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

export default function TimelineRingsWidget() {
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
      <WidgetBase className="w-full flex flex-col items-center justify-center py-8">
        <div
          className="flex flex-row items-end justify-center gap-12 w-full max-w-7xl"
          style={{ minHeight: 340, position: "relative" }}
        >
          {timelineData
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
                  className="flex flex-col items-center w-56 relative"
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
                          fontSize: 22,
                          letterSpacing: 1,
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
                        }}
                      >
                        {item.desc}
                      </div>
                      <svg
                        width={2}
                        height={38}
                        style={{ display: "block", marginBottom: -8 }}
                      >
                        <line
                          x1={1}
                          y1={38}
                          x2={1}
                          y2={38 - 38 * animatedLineProgress[idx]}
                          stroke={color}
                          strokeWidth={2}
                          style={{ transition: "y2 0.18s" }}
                        />
                      </svg>
                    </>
                  )}
                  <svg
                    width={120}
                    height={120}
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
                        <stop offset="0%" stopColor={shadeColor(color, 0.45)} />
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
                      d={describeArc(60, 60, 48, arcStart, arcEnd)}
                      fill="none"
                      stroke={color}
                      strokeWidth={14}
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
                      d={describeArc(60, 60, 48, gapStart, gapEnd)}
                      fill="none"
                      stroke={color}
                      strokeWidth={14}
                      opacity={0.18}
                      strokeLinecap="round"
                    />
                    {/* Center white circle (flat) */}
                    <circle cx={60} cy={60} r={38} fill="#fff" stroke="none" />
                    {/* Year */}
                    <text
                      x="60"
                      y="70"
                      textAnchor="middle"
                      fontFamily="var(--font-mono)"
                      fontWeight="bold"
                      fontSize="1.3rem"
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
                        left: isEven ? undefined : 140,
                        right: isEven ? 140 : undefined,
                        transform: "translateY(-50%)",
                        color,
                        fontFamily: "var(--font-mono)",
                        fontWeight: 800,
                        fontSize: 15,
                        letterSpacing: 1,
                        textAlign: "center",
                        whiteSpace: "nowrap",
                        pointerEvents: "none",
                        background: "#fff",
                        borderRadius: 8,
                        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                        padding: "4px 16px",
                        border: `2px solid ${color}`,
                      }}
                    >
                      {Math.round((animatedProgress[idx] ?? 0) * 100)}%
                    </div>
                  )}
                  {/* For even rings, add margin below ring to balance layout */}
                  {isEven && <div style={{ height: 16 }} />}
                  {/* For odd rings, line between ring and text below, then text block */}
                  {!isEven && (
                    <>
                      <svg
                        width={2}
                        height={38}
                        style={{ display: "block", marginTop: -8 }}
                      >
                        <line
                          x1={1}
                          y1={0}
                          x2={1}
                          y2={38 * animatedLineProgress[idx]}
                          stroke={color}
                          strokeWidth={2}
                          style={{ transition: "y2 0.18s" }}
                        />
                      </svg>
                      <div
                        className="mt-8 text-center"
                        style={{ minHeight: 80 }}
                      >
                        <div
                          className="font-bold mb-1"
                          style={{
                            color,
                            fontFamily: "var(--font-mono)",
                            fontSize: 22,
                            letterSpacing: 1,
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
                            marginTop: 8,
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
      </WidgetBase>
    </div>
  );
}
