"use client";

import React from "react";

interface TimerControlsProps {
  isRunning: boolean;
  isPaused: boolean;
  onToggle: () => void;
  onReset: () => void;
}

export default function TimerControls({
  isRunning,
  isPaused,
  onToggle,
  onReset,
}: TimerControlsProps) {
  return (
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
        onClick={onReset}
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
        onClick={onToggle}
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
        onClick={onReset}
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
  );
}
