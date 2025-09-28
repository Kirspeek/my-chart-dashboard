"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/common/AppShell";
import dynamic from "next/dynamic";
import {
  ContributionGraphWidget,
  WorkInProgressWidget,
} from "@/components/widgets";
const EnhancedTimelineWidget = dynamic(
  () => import("@/components/widgets").then((m) => m.EnhancedTimelineWidget),
  { ssr: false }
);
const SankeyChartWidget = dynamic(
  () => import("@/components/widgets").then((m) => m.SankeyChartWidget),
  { ssr: false }
);
const ChordChartWidget = dynamic(
  () => import("@/components/widgets").then((m) => m.ChordChartWidget),
  { ssr: false }
);
const RadarChartWidget = dynamic(
  () => import("@/components/widgets").then((m) => m.RadarChartWidget),
  { ssr: false }
);
import type {
  PerformanceMetricsData,
  WidgetRadarChartData,
} from "@/interfaces/widgets";
import { WidgetHeightProvider } from "@/context/WidgetHeightContext";
import { WidgetStateProvider } from "@/context/WidgetStateContext";

export default function AnalyticsPage() {
  const [data, setData] = useState<{
    migrationData: Array<{ from: string; to: string; size: number }>;
    sankeyData: Array<{ from: string; to: string; size: number }>;
    performanceMetricsData?: PerformanceMetricsData;
  }>({ migrationData: [], sankeyData: [] });

  useEffect(() => {
    async function load() {
      const [migrationData, sankeyData, performanceMetricsData] =
        await Promise.all([
          import("@/data/json/migrationData.json").then((m) => m.default),
          import("@/data/json/sankeyData.json").then((m) => m.default),
          import("@/data/json/performanceMetricsData.json").then(
            (m) => m.default
          ),
        ]);
      setData({
        migrationData,
        sankeyData,
        performanceMetricsData:
          performanceMetricsData as PerformanceMetricsData,
      });
    }
    load();
  }, []);

  return (
    <AppShell>
      <WidgetHeightProvider>
        <WidgetStateProvider>
          <div className="grid grid-cols-1 gap-8 my-8">
            <ContributionGraphWidget title="Financial Activity Overview" />
          </div>
        </WidgetStateProvider>
      </WidgetHeightProvider>

      <div className="grid grid-cols-1 gap-8 my-8">
        <EnhancedTimelineWidget />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 my-8">
        <SankeyChartWidget
          data={data.sankeyData}
          title="Global Migration Flows"
          subtitle="2019/2020"
        />
        <ChordChartWidget
          data={data.migrationData}
          title="Global Migrations"
          subtitle="2023"
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 my-8">
        <RadarChartWidget
          data={
            (data.performanceMetricsData
              ?.currentMetrics as WidgetRadarChartData[]) ?? []
          }
          title="Performance Metrics"
        />
        <WorkInProgressWidget />
      </div>
    </AppShell>
  );
}
