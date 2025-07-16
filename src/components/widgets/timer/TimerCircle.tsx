"use client";

import React from "react";

interface TimerCircleProps {
  svgRef: React.RefObject<SVGSVGElement | null>;
  currentTimeLeft: number;
  currentDuration: number;
  dragging: boolean;
  onPointerDown: (e: React.MouseEvent | React.TouchEvent) => void;
  formatTime: (seconds: number) => string;
}

export default function TimerCircle({
  svgRef,
  currentTimeLeft,
  currentDuration,
  dragging,
  onPointerDown,
  formatTime,
}: TimerCircleProps) {
  const svgSize = 90;
  const radius = 38;
  const center = svgSize / 2;
  const knobRadius = 7;
  const accentColor = "#ff9a9a";

  // Progress and angle for arc/knob (remaining time, not elapsed)
  const percentLeft = currentTimeLeft / currentDuration;
  const angle = percentLeft * 2 * Math.PI - Math.PI / 2;
  const knobX = center + radius * Math.cos(angle);
  const knobY = center + radius * Math.sin(angle);

  // Arc for remaining time (drawn from top, clockwise, proportional to left time)
  const circumference = 2 * Math.PI * radius;
  const arcDasharray = `${circumference * percentLeft} ${circumference * (1 - percentLeft)}`;
  const arcDashoffset = 0; // start at top

  return (
    <div
      style={{
        position: "relative",
        width: svgSize,
        height: svgSize,
        marginBottom: 10,
        marginLeft: "auto",
        marginRight: "auto",
      }}
    >
      <svg
        ref={svgRef}
        width={svgSize}
        height={svgSize}
        style={{ position: "absolute", top: 0, left: 0, touchAction: "none" }}
      >
        {/* Grey ring background (stroke only) */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="#ccc"
          strokeWidth="6"
        />
        {/* Progress arc (remaining time, accent color) */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={accentColor}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={arcDasharray}
          strokeDashoffset={arcDashoffset}
          transform={`rotate(-90 ${center} ${center})`}
          style={{
            transition: dragging
              ? "none"
              : "stroke-dasharray 0.3s cubic-bezier(.4,2,.6,1)",
          }}
        />
        {/* Draggable knob at end of arc */}
        <circle
          cx={knobX}
          cy={knobY}
          r={knobRadius}
          fill="#fff"
          stroke={accentColor}
          strokeWidth="3"
          style={{ cursor: "pointer" }}
          onMouseDown={onPointerDown}
          onTouchStart={onPointerDown}
        />
      </svg>
      {/* Time display */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "var(--font-mono)",
          fontWeight: 700,
          fontSize: 36,
          color: accentColor,
          letterSpacing: "0.04em",
          userSelect: "none",
          pointerEvents: "none",
        }}
      >
        {formatTime(currentTimeLeft)}
      </div>
    </div>
  );
}
