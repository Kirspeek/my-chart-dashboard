"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/common/AppShell";
import dynamic from "next/dynamic";
const LineChartWidget = dynamic(
  () => import("@/components/widgets").then((m) => m.LineChartWidget),
  { ssr: false }
);
const BarChartWidget = dynamic(
  () => import("@/components/widgets").then((m) => m.BarChartWidget),
  { ssr: false }
);
const ChordChartWidget = dynamic(
  () => import("@/components/widgets").then((m) => m.ChordChartWidget),
  { ssr: false }
);
const SankeyChartWidget = dynamic(
  () => import("@/components/widgets").then((m) => m.SankeyChartWidget),
  { ssr: false }
);
import type { PerformanceMetricsData } from "@/interfaces/widgets";

export default function ChartsPage() {
  const [mounted, setMounted] = useState(false);
  const [data, setData] = useState({
    salesData: [] as Array<{
      month: string;
      sales: number;
      revenue: number;
      profit: number;
    }>,
    barChartData: [] as Array<{ name: string; sales: number; revenue: number }>,
    migrationData: [] as Array<{ from: string; to: string; size: number }>,
    sankeyData: [] as Array<{ from: string; to: string; size: number }>,
    bubbleData: [] as Array<{
      x: number;
      y: number;
      size: number;
      category: string;
      label: string;
    }>,
    performanceMetricsData: undefined as PerformanceMetricsData | undefined,
  });

  useEffect(() => {
    setMounted(true);
    async function load() {
      const [sales, bar, sankey, migration, bubble, perf] = await Promise.all([
        import("@/data/json/salesData.json").then((m) => m.default),
        import("@/data/json/barChartData.json").then((m) => m.default),
        import("@/data/json/sankeyData.json").then((m) => m.default),
        import("@/data/json/migrationData.json").then((m) => m.default),
        import("@/data/json/bubbleData.json").then((m) => m.default),
        import("@/data/json/performanceMetricsData.json").then(
          (m) => m.default
        ),
      ]);

      setData({
        salesData: sales,
        barChartData: bar,
        sankeyData: sankey,
        migrationData: migration,
        bubbleData: bubble,
        performanceMetricsData: perf as PerformanceMetricsData,
      });
    }
    load();
  }, []);

  return (
    <AppShell>
      {mounted &&
      data.salesData.length > 0 &&
      data.barChartData.length > 0 &&
      data.sankeyData.length > 0 &&
      data.migrationData.length > 0 &&
      data.bubbleData.length > 0 ? (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 my-8">
            <LineChartWidget data={data.salesData} title="Sales Performance" />
            <BarChartWidget
              data={data.barChartData}
              title="Quarterly Overview"
            />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 my-8">
            <div className="lg:col-span-2 xl:col-span-2 h-full">
              <SankeyChartWidget
                data={data.sankeyData}
                title="Global Migration Flows"
                subtitle="2019/2020"
              />
            </div>
            <div className="h-full">
              <ChordChartWidget
                data={data.migrationData}
                title="Global Migrations"
                subtitle="2023"
              />
            </div>
          </div>
        </>
      ) : (
        <div className="secondary-text my-8">Loading charts...</div>
      )}
    </AppShell>
  );
}
