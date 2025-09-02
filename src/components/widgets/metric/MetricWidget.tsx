"use client";

import React, { useState, useEffect } from "react";
import { MetricWidgetProps } from "../../../../interfaces/widgets";
import WidgetBase from "../../common/WidgetBase";
import { useMetricLogic } from "@/hooks/useMetricLogic";
import MetricIcon from "./MetricIcon";
import MetricContent from "./MetricContent";
import MetricTrend from "./MetricTrend";

export default function MetricWidget({
  metric,
  index = 0,
  onOpenSidebar,
  showSidebarButton = false,
}: MetricWidgetProps & {
  onOpenSidebar?: () => void;
  showSidebarButton?: boolean;
}) {
  const { accentColor, displayValue } = useMetricLogic(metric, index);
  const [isHovered, setIsHovered] = useState(false);
  const [animatedValue, setAnimatedValue] = useState(0);

  // Animated counter effect
  useEffect(() => {
    const strValue = String(displayValue);
    const numericValue = parseFloat(strValue.replace(/[^0-9.]/g, ""));
    if (isNaN(numericValue)) return;

    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      setAnimatedValue(numericValue * progress);

      if (currentStep >= steps) {
        clearInterval(interval);
      }
    }, stepDuration);

    return () => clearInterval(interval);
  }, [displayValue]);

  return (
    <WidgetBase
      className="flex flex-col gap-2 relative p-4 group hover:scale-[1.02] transition-all duration-300 cursor-pointer"
      onOpenSidebar={onOpenSidebar}
      showSidebarButton={showSidebarButton}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background accent on hover */}
      <div
        className="absolute inset-0 rounded-[2.5rem] opacity-0 group-hover:opacity-5 transition-opacity duration-300"
        style={{ background: accentColor }}
      />

      {/* Icon positioned in top-right */}
      <div className="flex justify-end">
        <MetricIcon
          icon={metric.icon}
          accentColor={accentColor}
          isHovered={isHovered}
        />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col justify-center">
        <MetricContent
          title={metric.title}
          value={displayValue}
          animatedValue={animatedValue}
          isHovered={isHovered}
        />
      </div>

      {/* Trend indicator */}
      <MetricTrend
        change={metric.change}
        accentColor={accentColor}
        isHovered={isHovered}
      />
    </WidgetBase>
  );
}
