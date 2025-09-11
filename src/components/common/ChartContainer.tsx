"use client";

import React from "react";
import { useMobileDetection } from "@/hooks/useMobileDetection";

interface ChartContainerProps {
  children: React.ReactNode;
  className?: string;
  mobileClassName?: string;
  style?: React.CSSProperties;
  mobileStyle?: React.CSSProperties;
}

export default function ChartContainer({
  children,
  className = "w-full h-full",
  mobileClassName = "",
  style = {},
  mobileStyle = {},
}: ChartContainerProps) {
  const isMobile = useMobileDetection();

  const defaultMobileStyle: React.CSSProperties = {
    width: isMobile ? "100%" : undefined,
    height: isMobile ? "100%" : undefined,
    ...mobileStyle,
  };

  return (
    <div
      className={`${className} ${isMobile ? mobileClassName : ""}`}
      style={{ ...style, ...defaultMobileStyle }}
    >
      {children}
    </div>
  );
}
