import React from "react";
import { ChartCanvas, Button } from "../../common";

interface WavesCanvasProps {
  chartRef: React.RefObject<HTMLDivElement | null>;
  isLoaded: boolean;
  wavePaths: Array<{
    id: string;
    className: string;
    path: string;
    color: string;
    animationDelay: string;
    scaleY?: number;
  }>;
  onRefresh?: () => void;
}

export function WavesCanvas({
  chartRef,
  isLoaded,
  wavePaths,
  onRefresh,
}: WavesCanvasProps) {
  // Axis config to match SVG viewBox dimensions
  const chartWidth = 560;
  const chartHeight = 260; // baseline at 260 in paths
  const labelWidth = 56; // px reserved for Y-axis labels
  const yMax = 2000;
  const yStep = 250; // smaller step → smaller gaps between labels

  // Detect mobile viewport
  const [isMobile, setIsMobile] = React.useState(false);
  React.useEffect(() => {
    const check = () => {
      if (typeof window !== "undefined") {
        setIsMobile(window.innerWidth <= 768);
      }
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Create ticks from 0 → max so bottom label is $0 at baseline
  const yTicks = Array.from({ length: yMax / yStep + 1 }, (_, i) => i * yStep);

  const formatLabel = (value: number) =>
    value === 0 ? "$0" : `$${value / 1000}k`;

  const valueToBottomPx = (value: number) => (value / yMax) * chartHeight;
  const valueToTopPx = (value: number) => chartHeight - valueToBottomPx(value);

  return (
    <ChartCanvas style={{ width: "100%", height: "100%" }}>
      <div
        ref={chartRef}
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center", // Center the chart horizontally
          backgroundImage:
            "repeating-radial-gradient(center center, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1) 2px, transparent 2px, transparent 100%)",
          backgroundSize: "29px 29px",
          backgroundPosition: "-11px 11px",
        }}
      >
        {/* Y-axis labels positioned on the left side with more left spacing and gap */}
        <div
          style={{
            position: "absolute",
            left: "10px", // Moved further left (was 20px)
            top: 0,
            height: "100%",
            width: `${labelWidth}px`,
            color: "rgba(0, 0, 0, 0.7)",
            fontSize: isMobile ? "0.6em" : "0.75em", // smaller font on mobile
            lineHeight: 1,
            pointerEvents: "none",
            textAlign: "right",
            paddingRight: 24, // Increased padding to create more gap between numbers and waves
            paddingBottom: 0, // Remove padding to align $0 with bottom of waves
            boxSizing: "border-box",
          }}
        >
          {yTicks
            .filter((v) => v !== 0)
            .map((v) => {
              const top = valueToTopPx(v);
              const topPercent = (top / chartHeight) * 100;

              return (
                <div
                  key={v}
                  style={{
                    position: "absolute",
                    right: 0,
                    top: `${topPercent}%`,
                    transform: "translateY(-50%)", // All labels centered
                  }}
                >
                  {formatLabel(v)}
                </div>
              );
            })}
        </div>

        {/* Refresh button positioned in top right */}
        <div
          style={{
            position: "absolute",
            right: "20px", // Equal spacing from right edge
            top: "-0.75em",
          }}
        >
          <Button onClick={onRefresh} title="Refresh">
            ↻
          </Button>
        </div>

        {/* SVG chart centered horizontally */}
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          preserveAspectRatio="xMidYMid meet"
          style={{
            width: `${chartWidth}px`,
            height: "100%",
            maxWidth: "calc(100% - 120px)", // Account for labels on both sides
          }}
        >
          <defs>
            <filter id="dropshadow">
              <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
              <feOffset dx="0" dy="0" result="offsetblur" />
              <feComponentTransfer>
                <feFuncA slope="0.2" type="linear" />
              </feComponentTransfer>
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <g
            filter="url(#dropshadow)"
            style={{
              width: "100%",
              height: "100%",
              mixBlendMode: "multiply",
              isolation: "isolate",
            }}
          >
            {wavePaths.map((wavePath, i) => {
              const scaleMultiplier = 1.25; // make waves bigger
              const translateYPx = 8; // push waves slightly towards bottom
              return (
                <path
                  key={wavePath.id}
                  id={wavePath.id}
                  style={{
                    fill: wavePath.color,
                    fillOpacity: [0.2, 0.5, 0.95][i] ?? 0.6,
                    transformOrigin: "bottom",
                    transform: isLoaded
                      ? `translateY(${translateYPx}px) scaleY(${(wavePath.scaleY ?? 1) * scaleMultiplier})`
                      : `translateY(${translateYPx}px) scaleY(0.01)`,
                    opacity: isLoaded ? 1 : 0.6,
                    transition: `transform 0.5s ease ${wavePath.animationDelay}, opacity 0.5s ease ${wavePath.animationDelay}`,
                  }}
                  d={wavePath.path}
                />
              );
            })}
          </g>
        </svg>
      </div>
    </ChartCanvas>
  );
}
