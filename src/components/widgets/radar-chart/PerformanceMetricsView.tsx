"use client";

import React from "react";
import type { PerformanceMetricsViewProps } from "@/interfaces/charts";
import PerformanceMetricsContainer from "@/components/widgets/radar-chart/PerformanceMetricsContainer";

export default function PerformanceMetricsView({
  data,
  currentView,
  isRealTime,
}: PerformanceMetricsViewProps) {
  return (
    <PerformanceMetricsContainer
      data={data}
      currentView={currentView}
      isRealTime={isRealTime}
    />
  );
}
