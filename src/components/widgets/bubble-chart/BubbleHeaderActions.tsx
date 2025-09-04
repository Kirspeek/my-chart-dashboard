"use client";

import React from "react";
import type { BubbleHeaderActionsProps } from "@/interfaces/charts";
import { RotateCcw, Maximize2, Minimize2, Zap } from "lucide-react";

export default function BubbleHeaderActions({
  showParticles,
  onToggleParticles,
  onReset,
  isFullscreen,
  onToggleFullscreen,
}: BubbleHeaderActionsProps) {
  return (
    <div className="flex gap-2">
      <button
        onClick={onToggleParticles}
        className="p-2 rounded-lg transition-all duration-200 hover:scale-105"
        style={{
          backgroundColor: "transparent",
          border: `1px solid ${showParticles ? "var(--accent-color)" : "var(--border-secondary)"}`,
          color: "var(--secondary-text)",
        }}
        title="Toggle Particles"
      >
        <Zap className="w-4 h-4" />
      </button>
      <button
        onClick={onReset}
        className="p-2 rounded-lg transition-all duration-200 hover:scale-105"
        style={{
          backgroundColor: "transparent",
          border: "1px solid var(--border-secondary)",
          color: "var(--secondary-text)",
        }}
        title="Reset View"
      >
        <RotateCcw className="w-4 h-4" />
      </button>
      <button
        onClick={onToggleFullscreen}
        className="p-2 rounded-lg transition-all duration-200 hover:scale-105"
        style={{
          backgroundColor: "transparent",
          border: "1px solid var(--border-secondary)",
          color: "var(--secondary-text)",
        }}
        title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
      >
        {isFullscreen ? (
          <Minimize2 className="w-4 h-4" />
        ) : (
          <Maximize2 className="w-4 h-4" />
        )}
      </button>
    </div>
  );
}
