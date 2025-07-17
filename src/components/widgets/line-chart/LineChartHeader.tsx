"use client";

import React from "react";

interface LineChartHeaderProps {
  title: string;
}

export default function LineChartHeader({ title }: LineChartHeaderProps) {
  return (
    <h3
      className="text-lg font-semibold mb-4"
      style={{
        color: "#232323",
        fontFamily: "var(--font-mono)",
        fontWeight: 900,
        letterSpacing: "0.01em",
      }}
    >
      {title}
    </h3>
  );
}
