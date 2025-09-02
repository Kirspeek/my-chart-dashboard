import React from "react";
import { ChartCanvas, Button } from "../../common";
import { useTheme } from "../../../hooks/useTheme";
import { WavesCanvasProps } from "@/interfaces/widgets";

export function WavesCanvas({
  chartRef,
  isLoaded,
  wavePaths,
  onRefresh,
}: WavesCanvasProps) {
  const { colorsTheme } = useTheme();
  const walletCardColors = colorsTheme.widgets.walletCard;

  const chartWidth = 560;
  const chartHeight = 260;
  const labelWidth = 56;
  const yMax = 2000;
  const yStep = 250;

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
          justifyContent: "center",
          backgroundImage: walletCardColors.waves.background,
          backgroundSize: "29px 29px",
          backgroundPosition: "-11px 11px",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: "10px",
            top: 0,
            height: "100%",
            width: `${labelWidth}px`,
            color: "var(--secondary-text)",
            fontSize: isMobile ? "0.6em" : "0.75em",
            lineHeight: 1,
            pointerEvents: "none",
            textAlign: "right",
            paddingRight: 24,
            paddingBottom: 0,
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
                    transform: "translateY(-50%)",
                  }}
                >
                  {formatLabel(v)}
                </div>
              );
            })}
        </div>
        <div
          style={{
            position: "absolute",
            right: "20px",
            top: "-0.75em",
          }}
        >
          <Button onClick={onRefresh} title="Refresh">
            ↻
          </Button>
        </div>
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          preserveAspectRatio="xMidYMid meet"
          style={{
            width: `${chartWidth}px`,
            height: "100%",
            maxWidth: "calc(100% - 120px)",
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
