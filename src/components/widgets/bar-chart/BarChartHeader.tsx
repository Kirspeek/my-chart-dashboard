"use client";

import React from "react";

interface BarChartHeaderProps {
  title: string;
}

export default function BarChartHeader({ title }: BarChartHeaderProps) {
  // Detect mobile for spacing adjustments
  const [isMobile, setIsMobile] = React.useState(false);
  React.useEffect(() => {
    const check = () => {
      if (typeof window !== "undefined") {
        setIsMobile(window.innerWidth <= 425);
      }
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <h3
      className={`text-lg font-semibold mb-4 ${isMobile ? "text-center" : ""}`}
      style={{
        color: "#232323",
        fontFamily: "var(--font-mono)",
        fontWeight: 900,
        letterSpacing: "0.01em",
        marginTop: isMobile ? "2rem" : undefined,
      }}
    >
      {title}
    </h3>
  );
}
