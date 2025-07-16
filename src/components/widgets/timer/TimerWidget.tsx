"use client";

import React, { useRef } from "react";
import WidgetBase from "../../common/WidgetBase";
import { TimerWidgetProps } from "../../../../interfaces/components";
import { useTimerLogic } from "../../../hooks/useTimerLogic";
import TimerCircle from "./TimerCircle";
import TimerControls from "./TimerControls";

export default function TimerWidget({ className = "" }: TimerWidgetProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const {
    duration,
    timeLeft,
    isRunning,
    isPaused,
    dragging,
    previewDuration,
    toggleTimer,
    resetTimer,
    onPointerDown,
    formatTime,
  } = useTimerLogic();

  // Progress and angle for arc/knob (remaining time, not elapsed)
  const currentDuration =
    dragging && previewDuration ? previewDuration : duration;
  const currentTimeLeft =
    dragging && previewDuration ? previewDuration : timeLeft;

  return (
    <WidgetBase
      style={{
        width: "100%",
        padding: "0.7rem 0.3rem 0.7rem 0.3rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
      className={className}
    >
      <TimerCircle
        svgRef={svgRef}
        currentTimeLeft={currentTimeLeft}
        currentDuration={currentDuration}
        dragging={dragging}
        onPointerDown={onPointerDown}
        formatTime={formatTime}
      />
      <TimerControls
        isRunning={isRunning}
        isPaused={isPaused}
        onToggle={toggleTimer}
        onReset={resetTimer}
      />
    </WidgetBase>
  );
}
