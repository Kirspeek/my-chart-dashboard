import React from "react";

interface WavesCanvasProps {
  chartRef: React.RefObject<HTMLDivElement | null>;
  isLoaded: boolean;
  wavePaths: Array<{
    id: string;
    className: string;
    path: string;
    color: string;
    animationDelay: string;
  }>;
  onRefresh?: () => void;
}

export default function WavesCanvas({
  chartRef,
  isLoaded,
  wavePaths,
  onRefresh,
}: WavesCanvasProps) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        margin: "1rem 0",
      }}
    >
      <div
        ref={chartRef}
        style={{
          position: "relative",
          width: "560px",
          height: "260px",
          margin: "3em auto",
          backgroundImage:
            "repeating-radial-gradient(center center, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1) 2px, transparent 2px, transparent 100%)",
          backgroundSize: "29px 29px",
          backgroundPosition: "-11px 11px",
        }}
      >
        {/* Y-axis labels */}
        <div
          style={{
            display: "inline-block",
            position: "absolute",
            left: "-3.5em",
            top: "-5px",
            whiteSpace: "pre",
            height: "100%",
            lineHeight: "4.2",
            textAlign: "right",
            color: "rgba(0, 0, 0, 0.7)",
            fontSize: "0.875em",
          }}
        >
          {"$4k \n$3k \n$2k \n$1k \n0"}
        </div>

        {/* X-axis labels */}
        <div
          style={{
            position: "absolute",
            bottom: "-2em",
            width: "110%",
            marginLeft: "-5%",
            wordSpacing: "36.5em",
            paddingTop: "0.5em",
            color: "rgba(0, 0, 0, 0.7)",
            fontSize: "0.875em",
          }}
        >
          07:00h 21:00h
        </div>

        <button
          style={{
            position: "relative",
            top: "-0.75em",
            border: "none",
            background: "rgba(0, 0, 0, 0.1)",
            color: "#333",
            borderRadius: "5px",
            padding: "0.25em 1em",
            fontSize: "1em",
            float: "right",
            cursor: "pointer",
            transition: "background-color 0.2s ease",
          }}
          onClick={onRefresh}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(0, 0, 0, 0.2)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(0, 0, 0, 0.1)";
          }}
        >
          <span style={{ fontSize: "1.2em", fontWeight: "bold" }}>↻</span>
        </button>

        <svg viewBox="0 0 560 260">
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

          <g style={{ width: "100%", height: "100%" }}>
            {wavePaths.map((wavePath) => (
              <path
                key={wavePath.id}
                id={wavePath.id}
                style={{
                  fill: wavePath.color,
                  fillOpacity: 0.8,
                  filter: "url(#dropshadow)",
                  transformOrigin: "bottom",
                  transform: isLoaded ? "scaleY(1)" : "scaleY(0.01)",
                  opacity: isLoaded ? 1 : 0.5,
                  transition: `transform 0.5s ease ${wavePath.animationDelay}, opacity 0.5s ease ${wavePath.animationDelay}`,
                }}
                d={wavePath.path}
              />
            ))}
          </g>
        </svg>
      </div>
    </div>
  );
}
