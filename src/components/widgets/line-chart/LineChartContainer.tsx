"use client";

import React, { useEffect, useState } from "react";
import type {
  LineChartContainerProps,
  LineChartTypeKey,
} from "@/interfaces/charts";
import LineChartChartView from "@/components/widgets/line-chart/LineChartChartView";
import LineChartMetricsView from "@/components/widgets/line-chart/LineChartMetricsView";
import LineChartTrendsView from "@/components/widgets/line-chart/LineChartTrendsView";
import { useLineChartMetrics } from "@/hooks/useLineChartLogic";

export default function LineChartContainer({ data }: LineChartContainerProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [currentView, setCurrentView] = useState<
    "chart" | "metrics" | "trends"
  >("chart");
  const [currentChartType, setCurrentChartType] =
    useState<LineChartTypeKey>("line");
  const [animatedValues, setAnimatedValues] = useState({
    sales: 0,
    revenue: 0,
    profit: 0,
    growth: 0,
  });
  const [showInsights, setShowInsights] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [isRealTime] = useState(true);

  const { calculateMetrics } = useLineChartMetrics(data);
  const metrics = calculateMetrics();

  useEffect(() => {
    const check = () => {
      if (typeof window !== "undefined") setIsMobile(window.innerWidth <= 425);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

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
        sales: Math.floor(m.sales * progress),
        revenue: Math.floor(m.revenue * progress),
        profit: Math.floor(m.profit * progress),
        growth: m.revenueGrowth * progress,
      });
      if (currentStep >= steps) clearInterval(interval);
    }, stepDuration);
    return () => clearInterval(interval);
  }, [calculateMetrics, data]);

  useEffect(() => {
    if (!isRealTime) return;
    const interval = setInterval(() => {
      // Simulated updates
    }, 5000);
    return () => clearInterval(interval);
  }, [isRealTime]);

  const renderView = () => {
    switch (currentView) {
      case "chart":
        return (
          <LineChartChartView
            data={data}
            metrics={metrics}
            animatedValues={animatedValues}
            currentChartType={currentChartType}
            setCurrentChartType={setCurrentChartType}
            selectedMonth={selectedMonth}
            setSelectedMonth={setSelectedMonth}
            showInsights={showInsights}
            setShowInsights={setShowInsights}
          />
        );
      case "metrics":
        return <LineChartMetricsView data={data} />;
      case "trends":
        return <LineChartTrendsView metrics={metrics} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="flex items-center justify-center space-x-1 mb-4 flex-shrink-0">
        {(
          [
            { key: "chart", label: "Chart" },
            { key: "metrics", label: "Metrics" },
            { key: "trends", label: "Trends" },
          ] as const
        ).map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setCurrentView(key)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 ${
              currentView === key ? "scale-105" : ""
            }`}
            style={{
              background:
                currentView === key
                  ? "var(--accent-blue-20)"
                  : "var(--button-bg)",
              border: `1px solid ${currentView === key ? "var(--accent-blue)" : "var(--button-border)"}`,
              color:
                currentView === key
                  ? "var(--accent-blue)"
                  : "var(--secondary-color)",
              fontFamily: "var(--font-mono)",
              fontWeight: 700,
            }}
          >
            {!isMobile && <span>{label}</span>}
          </button>
        ))}
      </div>

      <div className="flex-1 min-h-0">{renderView()}</div>
    </div>
  );
}
