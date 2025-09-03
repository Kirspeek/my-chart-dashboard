"use client";

import React, { useEffect, useState } from "react";
import type { WidgetBarChartData } from "@/interfaces/widgets";
import type { BarChartTypeKey } from "@/interfaces/charts";
import BarChartChartView from "./BarChartChartView";
import { useBarChartMetrics } from "@/hooks/useBarChartLogic";

export default function BarChartContainer({
  data,
}: {
  data: WidgetBarChartData[];
}) {
  const [currentView, setCurrentView] = useState<BarChartTypeKey>("bars");
  const [selectedQuarter, setSelectedQuarter] = useState<string | null>(null);
  const [showInsights, setShowInsights] = useState(false);
  const [animatedValues, setAnimatedValues] = useState({
    totalRevenue: 0,
    totalSales: 0,
    avgRevenue: 0,
    growth: 0,
  });

  const { calculateMetrics } = useBarChartMetrics(data);
  const metrics = calculateMetrics();

  useEffect(() => {
    const m = calculateMetrics();
    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;
    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      setAnimatedValues({
        totalRevenue: Math.floor(m.totalRevenue * progress),
        totalSales: Math.floor(m.totalSales * progress),
        avgRevenue: Math.floor(m.avgRevenue * progress),
        growth: m.growth * progress,
      });
      if (currentStep >= steps) clearInterval(interval);
    }, stepDuration);
    return () => clearInterval(interval);
  }, [calculateMetrics, data]);

  return (
    <BarChartChartView
      data={data}
      metrics={metrics}
      animatedValues={animatedValues}
      currentChartType={currentView}
      setCurrentChartType={setCurrentView}
      selectedQuarter={selectedQuarter}
      setSelectedQuarter={setSelectedQuarter}
      showInsights={showInsights}
      setShowInsights={setShowInsights}
    />
  );
}
