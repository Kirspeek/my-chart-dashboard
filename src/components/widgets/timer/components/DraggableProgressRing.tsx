"use client";

import React from "react";

export default function DraggableProgressRing({
  isMobile,
  svgRef,
  onMouseDown,
  isDragging,
  strokeColor,
  progress,
  children,
}: {
  isMobile: boolean;
  svgRef: React.RefObject<SVGSVGElement | null>;
  onMouseDown: (e: React.MouseEvent | React.TouchEvent) => void;
  isDragging: boolean;
  strokeColor: string;
  progress: number;
  children?: React.ReactNode;
}) {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - progress / 100);

  return (
    <div
      className={`relative flex items-center justify-center ${isMobile ? "w-48 h-48" : "w-32 h-32"}`}
    >
      <svg
        ref={svgRef}
        className="w-full h-full transform -rotate-90 cursor-pointer"
        viewBox="0 0 100 100"
        onMouseDown={onMouseDown}
        onTouchStart={onMouseDown}
        style={{ cursor: isDragging ? "grabbing" : "grab" }}
      >
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="var(--button-border)"
          strokeWidth="3"
        />
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={`${circumference}`}
          strokeDashoffset={`${dashOffset}`}
          style={{
            transition: isDragging ? "none" : "stroke-dashoffset 0.3s ease",
          }}
        />
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="transparent"
          strokeWidth="8"
        />
      </svg>

      {children}
    </div>
  );
}
