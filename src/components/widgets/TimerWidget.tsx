"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import WidgetBase from "../common/WidgetBase";

interface TimerWidgetProps {
  className?: string;
}

export default function TimerWidget({ className = "" }: TimerWidgetProps) {
  // Change: Make timer controlled by the knob (drag sets both timeLeft and originalTime)
  const [duration, setDuration] = useState(25 * 60); // replaces originalTime
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // When duration changes (by drag), reset timer
  useEffect(() => {
    setTimeLeft(duration);
    setIsRunning(false);
    setIsPaused(false);
  }, [duration]);

  // Format time as HH:MM:SS
  const formatTime = (seconds: number): string => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(1, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // --- Knob Drag Logic ---
  const svgSize = 90;
  const radius = 38;
  const center = svgSize / 2;
  const knobRadius = 7;
  const minSeconds = 10; // minimum timer value
  const maxSeconds = 60 * 60; // 1 hour max
  const [dragging, setDragging] = useState(false);
  const [previewDuration, setPreviewDuration] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // Accent color for arc and text
  const accentColor = "#ff9a9a"; // or use var(--color-accent) if you want theme

  // Progress and angle for arc/knob (remaining time, not elapsed)
  const currentDuration =
    dragging && previewDuration ? previewDuration : duration;
  const currentTimeLeft =
    dragging && previewDuration ? previewDuration : timeLeft;
  const percentLeft = currentTimeLeft / currentDuration;
  const angle = percentLeft * 2 * Math.PI - Math.PI / 2;
  const knobX = center + radius * Math.cos(angle);
  const knobY = center + radius * Math.sin(angle);

  // Arc for remaining time (drawn from top, clockwise, proportional to left time)
  const circumference = 2 * Math.PI * radius;
  const arcDasharray = `${circumference * percentLeft} ${circumference * (1 - percentLeft)}`;
  const arcDashoffset = 0; // start at top

  // Convert mouse/touch position to timer value
  const getSecondsFromPointer = (clientX: number, clientY: number) => {
    if (!svgRef.current) return timeLeft;
    const rect = svgRef.current.getBoundingClientRect();
    const x = clientX - rect.left - center;
    const y = clientY - rect.top - center;
    let theta = Math.atan2(y, x) + Math.PI / 2;
    if (theta < 0) theta += 2 * Math.PI;
    const percent = theta / (2 * Math.PI);
    let seconds = Math.round(percent * maxSeconds);
    if (seconds < minSeconds) seconds = minSeconds;
    if (seconds > maxSeconds) seconds = maxSeconds;
    return seconds;
  };

  // Drag handlers
  const onPointerDown = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setDragging(true);
    if (isRunning) {
      setIsRunning(false);
      setIsPaused(false);
    }
    document.body.style.userSelect = "none";
  };
  const onPointerMove = (e: MouseEvent | TouchEvent) => {
    if (!dragging) return;
    let clientX: number, clientY: number;
    if ("touches" in e && e.touches && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else if ("clientX" in e && "clientY" in e) {
      clientX = (e as MouseEvent).clientX;
      clientY = (e as MouseEvent).clientY;
    } else {
      return;
    }
    const seconds = getSecondsFromPointer(clientX, clientY);
    setPreviewDuration(seconds);
  };
  const onPointerUp = () => {
    if (previewDuration) {
      setDuration(previewDuration);
      setTimeLeft(previewDuration);
    }
    setPreviewDuration(null);
    setDragging(false);
    document.body.style.userSelect = "";
  };
  useEffect(() => {
    if (dragging) {
      window.addEventListener("mousemove", onPointerMove);
      window.addEventListener("touchmove", onPointerMove);
      window.addEventListener("mouseup", onPointerUp);
      window.addEventListener("touchend", onPointerUp);
      return () => {
        window.removeEventListener("mousemove", onPointerMove);
        window.removeEventListener("touchmove", onPointerMove);
        window.removeEventListener("mouseup", onPointerUp);
        window.removeEventListener("touchend", onPointerUp);
      };
    }
  }, [dragging, previewDuration]);

  // --- Sound on timer end ---
  const playEndSound = useCallback(() => {
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      const ctx = new AudioCtx();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "sine";
      o.frequency.value = 880;
      g.gain.value = 0.1;
      o.connect(g);
      g.connect(ctx.destination);
      o.start();
      o.stop(ctx.currentTime + 0.25);
      o.onended = () => ctx.close();
    } catch {}
  }, []);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning && !isPaused && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            setIsPaused(false);
            playEndSound();
            // Play notification sound or show notification
            if (typeof window !== "undefined" && "Notification" in window) {
              new Notification("Timer Complete!", {
                body: "Your timer has finished!",
                icon: "/favicon.ico",
              });
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, isPaused, timeLeft, playEndSound]);

  // Start/Pause timer
  const toggleTimer = useCallback(() => {
    if (!isRunning) {
      setIsRunning(true);
      setIsPaused(false);
    } else if (isPaused) {
      setIsPaused(false);
    } else {
      setIsPaused(true);
    }
  }, [isRunning, isPaused]);

  // Reset timer
  const resetTimer = useCallback(() => {
    setIsRunning(false);
    setIsPaused(false);
    setTimeLeft(duration);
  }, [duration]);

  return (
    <WidgetBase
      style={{
        minWidth: 480,
        maxWidth: 480,
        width: "100%",
        padding: "0.7rem 0.3rem 0.7rem 0.3rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "none",
      }}
      className={className}
    >
      {/* Timer Circle */}
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
      {/* Controls */}
      <div
        style={{
          display: "flex",
          gap: 8,
          marginTop: 4,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Timer Icon Button */}
        <button
          onClick={resetTimer}
          style={{
            width: 24,
            height: 24,
            borderRadius: "50%",
            background: "var(--color-gray)",
            border: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--theme-text)",
            fontSize: 12,
            boxShadow: "0 1px 3px rgba(0,0,0,0.10)",
            cursor: "pointer",
            transition: "background 0.2s",
          }}
          aria-label="Reset"
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M2 12a10 10 0 1 0 4.29-8.29" />
            <polyline points="2 2 2 6 6 6" />
          </svg>
        </button>
        {/* Play/Pause Button */}
        <button
          onClick={toggleTimer}
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            background:
              isRunning && !isPaused
                ? "var(--color-accent)"
                : "var(--color-gray)",
            border: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--theme-text)",
            fontSize: 14,
            boxShadow: "0 1px 4px rgba(79,140,255,0.12)",
            cursor: "pointer",
            transition: "background 0.2s",
          }}
          aria-label={isRunning && !isPaused ? "Pause" : "Start"}
        >
          {isRunning && !isPaused ? (
            // Pause icon
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="6" y="4" width="4" height="16" />
              <rect x="14" y="4" width="4" height="16" />
            </svg>
          ) : (
            // Play icon
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          )}
        </button>
        {/* Restart Button */}
        <button
          onClick={resetTimer}
          style={{
            width: 24,
            height: 24,
            borderRadius: "50%",
            background: "var(--color-gray)",
            border: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--theme-text)",
            fontSize: 12,
            boxShadow: "0 1px 3px rgba(0,0,0,0.10)",
            cursor: "pointer",
            transition: "background 0.2s",
          }}
          aria-label="Restart"
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="1 4 1 10 7 10" />
            <path d="M3.51 15a9 9 0 1 0-2.13-9.36" />
          </svg>
        </button>
      </div>
    </WidgetBase>
  );
}
