"use client";

import React from "react";
import { useSearch } from "../../context/SearchContext";
import {
  ClockWidget,
  WeatherWidget,
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
  TimelineRingsWidget,
  WalletWidget,
  WheelWidget,
  ContributionGraphWidget,
  AggregatedSpendingWidget,
} from "../widgets";
import { WidgetHeightProvider } from "../../context/WidgetHeightContext";
import { WidgetStateProvider } from "../../context/WidgetStateContext";
import { X } from "lucide-react";
import type { UserData } from "@/interfaces/dashboard";
import type { PerformanceMetricsData } from "@/interfaces/widgets";

interface DashboardData {
  metricCards?: Array<{
    title: string;
    value: string;
    change: number;
    icon: string;
  }>;
  salesData?: Array<{
    month: string;
    sales: number;
    revenue: number;
    profit: number;
  }>;
  barChartData?: Array<{
    name: string;
    sales: number;
    revenue: number;
  }>;
  pieChartData?: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  userData?: UserData[];
  radarChartData?: Array<{
    subject: string;
    value: number;
    fullMark: number;
  }>;
  performanceMetricsData?: PerformanceMetricsData;
  migrationData?: Array<{
    from: string;
    to: string;
    size: number;
  }>;
  sankeyData?: Array<{
    from: string;
    to: string;
    size: number;
  }>;
  bubbleData?: Array<{
    x: number;
    y: number;
    size: number;
    category: string;
    label: string;
  }>;
}

interface FilteredWidgetsGridProps {
  data: DashboardData;
  selectedZone: string;
  setSelectedZone: React.Dispatch<React.SetStateAction<string>>;
  selectedCity: string;
}

export default function FilteredWidgetsGrid({
  data,
  selectedZone,
  setSelectedZone,
  selectedCity,
}: FilteredWidgetsGridProps) {
  const {
    searchTerm,
    filteredWidgetTypes,
    showFilteredWidgets,
    setShowFilteredWidgets,
    clearSearch,
  } = useSearch();

  if (!showFilteredWidgets || !searchTerm.trim()) {
    return null;
  }

  const renderWidget = (widgetType: string, index: number) => {
    switch (widgetType) {
      case "clock":
        return (
          <div className="max-w-xs mx-auto">
            <ClockWidget
              key={`clock-${index}`}
              selectedZone={selectedZone}
              setSelectedZone={setSelectedZone}
              isMobile={false}
            />
          </div>
        );
      case "weather":
        return (
          <div className="max-w-sm mx-auto">
            <WeatherWidget key={`weather-${index}`} city={selectedCity} />
          </div>
        );
      case "timer":
        return (
          <div className="max-w-xs mx-auto">
            <TimerWidget key={`timer-${index}`} className="h-full" />
          </div>
        );
      case "map":
        return (
          <div className="max-w-lg mx-auto">
            <MapWidget key={`map-${index}`} />
          </div>
        );
      case "calendar":
        return (
          <div className="max-w-md mx-auto">
            <CalendarWidget key={`calendar-${index}`} />
          </div>
        );
      case "wallet":
        return (
          <div className="max-w-sm mx-auto">
            <WidgetHeightProvider key={`wallet-${index}`}>
              <WidgetStateProvider>
                <WalletWidget />
              </WidgetStateProvider>
            </WidgetHeightProvider>
          </div>
        );
      case "wallet-card":
        return (
          <div className="max-w-sm mx-auto">
            <WidgetHeightProvider key={`wallet-card-${index}`}>
              <WidgetStateProvider>
                <WheelWidget />
              </WidgetStateProvider>
            </WidgetHeightProvider>
          </div>
        );
      case "aggregated-spending":
        return (
          <div className="max-w-sm mx-auto">
            <WidgetHeightProvider key={`aggregated-spending-${index}`}>
              <WidgetStateProvider>
                <AggregatedSpendingWidget />
              </WidgetStateProvider>
            </WidgetHeightProvider>
          </div>
        );
      case "contribution-graph":
        return (
          <div className="max-w-2xl mx-auto">
            <WidgetHeightProvider key={`contribution-graph-${index}`}>
              <WidgetStateProvider>
                <ContributionGraphWidget title="Financial Activity Overview" />
              </WidgetStateProvider>
            </WidgetHeightProvider>
          </div>
        );
      case "metric":
        return (
          <div
            key={`metric-${index}`}
            className="max-w-2xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-2"
          >
            {(data.metricCards ?? []).map(
              (
                metric: {
                  title: string;
                  value: string;
                  change: number;
                  icon: string;
                },
                metricIndex: number
              ) => (
                <MetricWidget
                  key={metricIndex}
                  metric={metric}
                  index={metricIndex}
                />
              )
            )}
          </div>
        );
      case "line-chart":
        return (
          <div className="max-w-xl mx-auto">
            <LineChartWidget
              key={`line-chart-${index}`}
              data={data.salesData ?? []}
              title="Sales Performance"
            />
          </div>
        );
      case "bar-chart":
        return (
          <div className="max-w-xl mx-auto">
            <BarChartWidget
              key={`bar-chart-${index}`}
              data={data.barChartData ?? []}
              title="Quarterly Overview"
            />
          </div>
        );
      case "radar-chart":
        return (
          <div className="max-w-lg mx-auto">
            <RadarChartWidget
              key={`radar-chart-${index}`}
              data={data.radarChartData ?? []}
              title="Performance Metrics"
            />
          </div>
        );
      case "device-usage":
        return (
          <div className="max-w-lg mx-auto">
            <DeviceUsageWidget
              key={`device-usage-${index}`}
              data={data.pieChartData ?? []}
              title="Device Usage"
            />
          </div>
        );
      case "sankey-chart":
        return (
          <div className="max-w-2xl mx-auto">
            <SankeyChartWidget
              key={`sankey-chart-${index}`}
              data={data.sankeyData ?? []}
              title="Global Migration Flows"
              subtitle="2019/2020"
            />
          </div>
        );
      case "chord-chart":
        return (
          <div className="max-w-xl mx-auto">
            <ChordChartWidget
              key={`chord-chart-${index}`}
              data={data.migrationData ?? []}
              title="Global Migrations"
              subtitle="2023"
            />
          </div>
        );
      case "bubble-chart":
        return (
          <div className="max-w-2xl mx-auto">
            <BubbleChartWidget
              key={`bubble-chart-${index}`}
              data={data.bubbleData ?? []}
              title="Global Tech Investment"
              subtitle="Market Cap vs Growth vs Workforce Size"
            />
          </div>
        );
      case "timeline-rings":
        return (
          <div className="max-w-2xl mx-auto">
            <TimelineRingsWidget key={`timeline-rings-${index}`} />
          </div>
        );
      case "recent-users":
        return (
          <div className="max-w-xl mx-auto">
            <RecentUsersWidget
              key={`recent-users-${index}`}
              data={data.userData ?? []}
              title="Recent Users"
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-40 filtered-widgets-container">
      {/* Header */}
      <div className="sticky top-0 z-50 search-results-header">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h2 className="text-xl font-bold primary-text">
                Search Results: &quot;{searchTerm}&quot;
              </h2>
              <span className="text-sm secondary-text">
                {filteredWidgetTypes.length} widget type
                {filteredWidgetTypes.length !== 1 ? "s" : ""} found
              </span>
            </div>
            <button
              onClick={() => {
                setShowFilteredWidgets(false);
                clearSearch();
              }}
              className="flex items-center space-x-2 px-4 py-2 bg-[var(--accent-color)] hover:bg-[var(--accent-color)]/80 text-white rounded-lg transition-colors clear-search-button"
            >
              <X className="w-4 h-4" />
              <span>Clear Search</span>
            </button>
          </div>
        </div>
      </div>

      {/* Widget Grid */}
      <div className="p-3">
        <div className="max-w-4xl mx-auto space-y-3">
          {filteredWidgetTypes.map((widgetType, index) => (
            <div key={widgetType} className="widget-container">
              {renderWidget(widgetType, index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
