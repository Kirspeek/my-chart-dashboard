"use client";

import { useState, useEffect } from "react";
import { Header as UIHeader } from "../../packages/ui-header/src";
import SunMoonToggle from "@/components/common/SunMoonToggle";
import {
  ClockWidget,
  WeatherWidget,
  WeatherWidgetMobile,
  TimerWidget,
  MapWidget,
  CalendarWidget,
  MetricWidget,
  LineChartWidget,
  BarChartWidget,
  RecentUsersWidget,
  DeviceUsageWidget,
  RadarChartWidget,
  ChordChartWidget,
  SankeyChartWidget,
  BubbleChartWidget,
  EnhancedTimelineWidget,
  WalletWidget,
  WheelWidget,
  ContributionGraphWidget,
  AggregatedSpendingWidget,
  WorkInProgressWidget,
  MusicWidget,
  HeaderWidget,
} from "@/components/widgets";
import { useWeatherPreload } from "@/hooks";
import type {
  PerformanceMetricsData,
  RadarChartDataItem,
  DashboardData,
  CityMap,
} from "@/interfaces";
import { WidgetHeightProvider } from "../context/WidgetHeightContext";
import { WidgetStateProvider } from "../context/WidgetStateContext";
import { SearchProvider } from "../context/SearchContext";
import FilteredWidgetsGrid from "../components/common/FilteredWidgetsGrid";
import MobileGridLayout from "../components/common/MobileGridLayout";

const cityMap: CityMap = {
  "America/New_York": "New York",
  "Europe/London": "London",
  "Europe/Rome": "Rome",
  "Europe/Kyiv": "Kyiv",
};

const allCities = Object.values(cityMap);

function useDashboardData(): DashboardData {
  const [data, setData] = useState<DashboardData>({});
  useEffect(() => {
    async function loadData() {
      const [
        metricCards,
        salesData,
        barChartData,
        pieChartData,
        userData,
        radarChartData,
        migrationData,
        sankeyData,
        bubbleData,
        performanceMetricsData,
      ] = await Promise.all([
        import("../data/json/metricCards.json").then((m) => m.default),
        import("../data/json/salesData.json").then((m) => m.default),
        import("../data/json/barChartData.json").then((m) => m.default),
        import("../data/json/pieChartData.json").then((m) => m.default),
        import("../data/json/userData.json").then((m) => m.default),
        import("../data/json/radarChartData.json").then((m) => m.default),
        import("../data/json/migrationData.json").then((m) => m.default),
        import("../data/json/sankeyData.json").then((m) => m.default),
        import("../data/json/bubbleData.json").then((m) => m.default),
        import("../data/json/performanceMetricsData.json").then(
          (m) => m.default
        ),
      ]);
      setData({
        metricCards,
        salesData,
        barChartData,
        pieChartData,
        userData,
        radarChartData: radarChartData as unknown as RadarChartDataItem[],
        migrationData,
        sankeyData,
        bubbleData,
        performanceMetricsData:
          performanceMetricsData as unknown as PerformanceMetricsData,
      });
    }
    loadData();
  }, []);
  return data;
}

export default function Home() {
  const [selectedZone, setSelectedZone] = useState("Europe/London");
  const selectedCity = cityMap[selectedZone] || "London";
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const data = useDashboardData();

  useWeatherPreload(allCities, {
    autoPreload: true,
    preloadOnMount: true,
  });

  useEffect(() => {
    setMounted(true);
    const localZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setSelectedZone(localZone);

    const checkMobile = () => {
      const isPhone = window.innerWidth <= 425;
      setIsMobile(isPhone);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (!data.metricCards) return <div>Loading dashboard data...</div>;

  if (isMobile) {
    return (
      <SearchProvider>
        <div className="flex min-h-screen bg-[var(--background)]">
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="px-4 mt-2">
              <HeaderWidget
                defaultSection="dashboard"
                sections={[{ key: "dashboard", label: "Chart Dashboard" }]}
              />
            </div>

            <MobileGridLayout
              data={data}
              selectedZone={selectedZone}
              setSelectedZone={setSelectedZone}
              selectedCity={selectedCity}
            />
          </div>
        </div>
      </SearchProvider>
    );
  }

  return (
    <SearchProvider>
      <div className="flex min-h-screen bg-[var(--background)]">
        <FilteredWidgetsGrid
          data={data}
          selectedZone={selectedZone}
          setSelectedZone={setSelectedZone}
          selectedCity={selectedCity}
        />

        <div className="flex-1 flex flex-col overflow-hidden">
          <UIHeader
            className="border-b border-[var(--widget-border)] w-full"
            style={{ borderRadius: 0, margin: 0 }}
            contentClassName="!max-w-none"
            defaultSection="dashboard"
            titles={["Charts & Analytics Dashboard", "Real-time Metrics", "Global Insights"]}
            sections={[{ key: "dashboard", label: "Dashboard" }]}
            showThemeToggle
            themeToggleNode={<SunMoonToggle />}
            contactLinks={[
              {
                label: "Contact",
                href: "https://kirspeek.dev",
                target: "_blank",
                rel: "noopener noreferrer",
              },
            ]}
            onMenuClick={() => setSidebarOpen(true)}
          />
          <main className="flex-1 overflow-y-auto px-6 py-8 bg-[var(--background)]">
            <div className="max-w-7xl mx-auto">
              {/* Header removed from here */}

              {mounted && (
                <>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
                    <div className="h-full">
                      <ClockWidget
                        selectedZone={selectedZone}
                        setSelectedZone={setSelectedZone}
                        isMobile={false}
                      />
                    </div>

                    <div className="h-full flex flex-col">
                      <div className="flex-none h-72 md:h-96 lg:h-72 2xl:h-96">
                        {isMobile ? (
                          <WeatherWidgetMobile city={selectedCity} />
                        ) : (
                          <WeatherWidget city={selectedCity} />
                        )}
                      </div>
                      <div className="h-8"></div>{" "}
                      <div className="flex-1 min-h-0">
                        <TimerWidget className="h-full" />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-8 my-8">
                    <MusicWidget title="Spotify Music Player" compact={true} />
                  </div>

                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mt-6 lg:mt-8 mb-8">
                    <div className="h-full">
                      <MapWidget />
                    </div>
                    <div className="h-full">
                      <CalendarWidget />
                    </div>
                  </div>
                </>
              )}



              <WidgetHeightProvider>
                <WidgetStateProvider>
                  <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 mt-8 mb-6 lg:mb-8 items-stretch md:justify-items-center lg:justify-items-stretch">
                    <div className="md:w-full lg:col-span-2 xl:col-span-1">
                      <WalletWidget />
                    </div>
                    <div className="md:w-full">
                      <WheelWidget />
                    </div>
                    <div className="md:w-full">
                      <AggregatedSpendingWidget />
                    </div>
                  </div>
                </WidgetStateProvider>
              </WidgetHeightProvider>

              <WidgetHeightProvider>
                <WidgetStateProvider>
                  <div className="grid grid-cols-1 gap-8 my-8">
                    <div>
                      <ContributionGraphWidget title="Financial Activity Overview" />
                    </div>
                  </div>
                </WidgetStateProvider>
              </WidgetHeightProvider>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6 lg:gap-8 my-8">
                {(data.metricCards ?? []).map((metric, index) => (
                  <MetricWidget key={index} metric={metric} index={index} />
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 my-8">
                <LineChartWidget
                  data={data.salesData ?? []}
                  title="Sales Performance"
                />
                <BarChartWidget
                  data={data.barChartData ?? []}
                  title="Quarterly Overview"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 my-8">
                <RadarChartWidget
                  data={
                    (data.performanceMetricsData
                      ?.currentMetrics as RadarChartDataItem[]) ??
                    data.radarChartData ??
                    []
                  }
                  title="Performance Metrics"
                />
                <WorkInProgressWidget />
              </div>

              <div className="grid grid-cols-1 gap-8 my-8">
                <div className="h-full">
                  <RecentUsersWidget
                    data={data.userData ?? []}
                    title="Recent Users"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 my-8">
                <div className="h-full">
                  <DeviceUsageWidget
                    data={data.pieChartData ?? []}
                    title="Device Usage"
                  />
                </div>
                <div className="h-full">
                  <ChordChartWidget
                    data={data.migrationData ?? []}
                    title="Global Migrations"
                    subtitle="2023"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-8 my-8">
                <div className="h-full">
                  <SankeyChartWidget
                    data={data.sankeyData ?? []}
                    title="Global Migration Flows"
                    subtitle="2019/2020"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-8 my-8">
                <div className="h-full">
                  <BubbleChartWidget
                    data={data.bubbleData ?? []}
                    title="Global Tech Investment"
                    subtitle="Market Cap vs Growth vs Workforce Size"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-8 my-8">
                <EnhancedTimelineWidget />
              </div>
            </div>
          </main>
        </div>
      </div>
    </SearchProvider>
  );
}
