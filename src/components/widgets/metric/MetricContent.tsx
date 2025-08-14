"use client";

import React from "react";

interface MetricContentProps {
  title: string;
  value: string | number;
  animatedValue?: number;
  isHovered?: boolean;
}

function splitNumber(value: string | number) {
  // Extracts main and secondary (decimal/units) part
  const str = String(value);
  const match = str.match(/^(.*?)([.,][0-9]+|[A-Z%]+)?$/);
  if (!match) return { main: str, secondary: "" };
  return { main: match[1], secondary: match[2] || "" };
}

export default function MetricContent({
  title,
  value,
  animatedValue,
  isHovered = false,
}: MetricContentProps) {
  const { main, secondary } = splitNumber(value);
  const displayMain =
    animatedValue !== undefined ? Math.floor(animatedValue).toString() : main;
  const displaySecondary =
    animatedValue !== undefined
      ? (animatedValue % 1).toFixed(1).slice(1)
      : secondary;

  return (
    <div className="flex-1 min-w-0 text-left">
      <p
        className="text-xs font-bold uppercase mb-1 truncate text-left secondary-text transition-all duration-300"
        style={{
          fontFamily: "var(--font-sans)",
          opacity: 0.7,
          letterSpacing: 1.5,
        }}
        title={title}
      >
        {title}
      </p>
      <span className="flex items-baseline gap-1 justify-start">
        <span
          className={`text-2xl sm:text-3xl lg:text-4xl font-mono font-extrabold mono primary-text transition-all duration-300 ${
            isHovered ? "scale-105" : "scale-100"
          }`}
          style={{
            letterSpacing: "0.04em",
            lineHeight: 1.1,
          }}
        >
          {displayMain}
        </span>
        {displaySecondary && (
          <span
            className={`text-2xl sm:text-3xl lg:text-4xl font-mono font-extrabold mono secondary-text transition-all duration-300 ${
              isHovered ? "scale-105" : "scale-100"
            }`}
            style={{
              letterSpacing: "0.04em",
              lineHeight: 1.1,
            }}
          >
            {displaySecondary}
          </span>
        )}
      </span>
    </div>
  );
}
