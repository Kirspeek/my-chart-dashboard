"use client";

import React from "react";
import type { BubbleChartLegendProps } from "@/interfaces/charts";

export default function BubbleChartLegend({
  categories,
  getCategoryHex,
}: BubbleChartLegendProps) {
  return (
    <div className="mt-4 flex justify-center">
      <div className="flex gap-4 flex-wrap justify-center">
        {categories.map((category) => {
          const categoryColor = getCategoryHex(category);
          return (
            <div key={category} className="flex items-center gap-2">
              <div
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  backgroundColor: `#${categoryColor}`,
                  boxShadow: `0 0 8px #${categoryColor}`,
                  border: `2px solid #${categoryColor}`,
                }}
              />
              <span
                style={{
                  fontSize: 13,
                  fontFamily: "var(--font-mono)",
                  fontWeight: 600,
                  color: "var(--primary-text)",
                }}
              >
                {category}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
