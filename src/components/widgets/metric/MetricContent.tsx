"use client";

import React from "react";

interface MetricContentProps {
  title: string;
  value: string | number;
}

function splitNumber(value: string | number) {
  // Extracts main and secondary (decimal/0) part
  const str = String(value);
  const match = str.match(/^(.*?)([.,][0-9]+)?$/);
  if (!match) return { main: str, secondary: "" };
  return { main: match[1], secondary: match[2] || "" };
}

export default function MetricContent({ title, value }: MetricContentProps) {
  const { main, secondary } = splitNumber(value);

  return (
    <div className="flex-1">
      <p
        className="text-xs font-bold uppercase mb-2"
        style={{
          color: "#232323",
          fontFamily: "var(--font-sans)",
          opacity: 0.7,
          letterSpacing: 1.5,
        }}
      >
        {title}
      </p>
      <span className="flex items-baseline gap-1">
        <span
          className="text-5xl font-mono font-extrabold mono"
          style={{
            color: "#232323",
            letterSpacing: "0.04em",
            lineHeight: 1.1,
          }}
        >
          {main}
        </span>
        {secondary && (
          <span
            className="text-5xl font-mono font-extrabold mono"
            style={{
              color: "#888",
              letterSpacing: "0.04em",
              lineHeight: 1.1,
            }}
          >
            {secondary}
          </span>
        )}
      </span>
    </div>
  );
}
