"use client";

import React from "react";
import { useTheme } from "src/hooks/useTheme";

interface DeviceUsageHeaderProps {
  title: string;
}

export default function DeviceUsageHeader({ title }: DeviceUsageHeaderProps) {
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

  const { colors } = useTheme();

  return (
    <h3
      className={`text-lg font-semibold mb-4 ${isMobile ? "text-center" : ""}`}
      style={{
        color: colors.primary,
        fontFamily: "var(--font-mono)",
        fontWeight: 900,
        letterSpacing: "0.01em",
        marginTop: isMobile ? "2rem" : undefined,
        fontSize: isMobile ? "1rem" : undefined, // Smaller title font for mobile
      }}
    >
      {title}
    </h3>
  );
}
