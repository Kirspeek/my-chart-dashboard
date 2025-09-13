"use client";

import React from "react";
import type { BubbleChartControlsProps } from "@/interfaces/charts";

export default function BubbleChartControls({
  categories,
  selectedCategory,
  setSelectedCategory,
  animationSpeed,
  setAnimationSpeed,
  isZoomedOut,
  setIsZoomedOut,
  isSmallScreen = false,
  getCategoryHex,
}: BubbleChartControlsProps) {
  return (
    <div className="flex flex-wrap gap-4 mb-4 items-center justify-between">
      <div className="flex gap-1.5 flex-wrap">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all duration-200`}
          style={{
            backgroundColor: "transparent",
            border: `1px solid ${!selectedCategory ? "var(--accent-color)" : "var(--border-secondary)"}`,
            color:
              "color-mix(in srgb, var(--primary-text) 70%, var(--secondary-text))",
          }}
        >
          All Categories
        </button>
        {categories.map((category) => {
          const categoryColor = getCategoryHex(category);
          return (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all duration-200`}
              style={{
                backgroundColor:
                  selectedCategory === category
                    ? `#${categoryColor}22`
                    : "transparent",
                border: `1px solid #${categoryColor}`,
                color:
                  "color-mix(in srgb, var(--primary-text) 70%, var(--secondary-text))",
                opacity: selectedCategory === category ? 1 : 0.85,
              }}
            >
              {category}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span
            className="text-sm font-medium"
            style={{
              color:
                "color-mix(in srgb, var(--primary-text) 70%, var(--secondary-text))",
            }}
          >
            Speed:
          </span>
          <input
            type="range"
            min="0.1"
            max="3"
            step="0.1"
            value={animationSpeed}
            onChange={(e) => setAnimationSpeed(parseFloat(e.target.value))}
            className="w-20"
          />
          <span
            className="text-sm font-mono"
            style={{
              color:
                "color-mix(in srgb, var(--primary-text) 70%, var(--secondary-text))",
            }}
          >
            {animationSpeed.toFixed(1)}x
          </span>
        </div>

        {!isSmallScreen && (
          <button
            onClick={() => setIsZoomedOut(!isZoomedOut)}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200`}
            style={{
              backgroundColor: "transparent",
              border: `1px solid var(--border-secondary)`,
              color:
                "color-mix(in srgb, var(--primary-text) 70%, var(--secondary-text))",
            }}
          >
            {isZoomedOut ? "Zoom In" : "Zoom Out"}
          </button>
        )}
      </div>
    </div>
  );
}
