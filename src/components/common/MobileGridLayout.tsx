"use client";

import React from "react";
import "../../styles/mobile-grid.css";
import {
  ClockWidget,
  WeatherWidgetMobile,
  TimerWidget,
  MapWidget,
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
  MusicWidget,
} from "../widgets";
import CalendarWidgetMobile from "../widgets/calendar/CalendarWidgetMobile";
import { WidgetHeightProvider } from "../../context/WidgetHeightContext";
import { WidgetStateProvider } from "../../context/WidgetStateContext";
import type { RadarChartDataItem, DashboardData } from "@/interfaces";

interface MobileGridLayoutProps {
  data: DashboardData;
  selectedZone: string;
  setSelectedZone: React.Dispatch<React.SetStateAction<string>>;
  selectedCity: string;
}

export default function MobileGridLayout({
  data,
  selectedZone,
  setSelectedZone,
  selectedCity,
}: MobileGridLayoutProps) {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <main className="flex-1 overflow-y-auto px-4 py-2 bg-[var(--background)]">
        <div className="max-w-full mx-auto space-y-4 mobile-grid-container">
          {/* Top Section - Clock and Weather - Using original slide dimensions */}
          <div className="grid grid-cols-1 gap-4">
            <div className="clock-widget-container">
              <ClockWidget
                selectedZone={selectedZone}
                setSelectedZone={setSelectedZone}
                isMobile={true}
              />
            </div>
            <div className="weather-widget-container">
              <WeatherWidgetMobile city={selectedCity} />
            </div>
          </div>

          {/* Timer Section */}
          <div className="h-auto">
            <TimerWidget />
          </div>

          {/* Music Widget */}
          <div className="h-auto">
            <MusicWidget title="Spotify Music Player" compact={true} />
          </div>

          {/* Map and Calendar Section */}
          <div className="grid grid-cols-1 gap-4">
            <div className="h-auto">
              <MapWidget />
            </div>
            <div className="h-auto">
              <CalendarWidgetMobile />
            </div>
          </div>

          {/* Wallet and Spending Section */}
          <WidgetHeightProvider>
            <WidgetStateProvider>
              <div className="grid grid-cols-1 gap-4">
                <div className="h-auto">
                  <WalletWidget />
                </div>
                <div className="h-auto">
                  <WheelWidget />
                </div>
                <div className="h-auto">
                  <AggregatedSpendingWidget />
                </div>
              </div>
            </WidgetStateProvider>
          </WidgetHeightProvider>

          {/* Contribution Graph */}
          <WidgetHeightProvider>
            <WidgetStateProvider>
              <div className="h-auto">
                <ContributionGraphWidget title="Financial Activity Overview" />
              </div>
            </WidgetStateProvider>
          </WidgetHeightProvider>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 gap-3">
            {(data.metricCards ?? []).map((metric, index) => (
              <div key={index} className="h-auto">
                <MetricWidget
                  metric={metric}
                  index={index}
                />
              </div>
            ))}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 gap-4">
            <div className="h-auto">
              <LineChartWidget
                data={data.salesData ?? []}
                title="Sales Performance"
              />
            </div>
            <div className="h-auto">
              <BarChartWidget
                data={data.barChartData ?? []}
                title="Quarterly Overview"
              />
            </div>
          </div>

          {/* Performance and Device Usage */}
          <div className="grid grid-cols-1 gap-4">
            <div className="h-auto">
              <RadarChartWidget
                data={
                  (data.performanceMetricsData
                    ?.currentMetrics as RadarChartDataItem[]) ??
                  data.radarChartData ??
                  []
                }
                title="Performance Metrics"
              />
            </div>
            <div className="h-auto">
              <DeviceUsageWidget
                data={data.pieChartData ?? []}
                title="Device Usage"
              />
            </div>
          </div>

          {/* Recent Users */}
          <div className="h-auto">
            <RecentUsersWidget
              data={data.userData ?? []}
              title="Recent Users"
            />
          </div>

          {/* Advanced Charts */}
          <div className="grid grid-cols-1 gap-4">
            <div className="h-auto">
              <SankeyChartWidget
                data={data.sankeyData ?? []}
                title="Global Migration Flows"
                subtitle="2019/2020"
              />
            </div>
            <div className="h-auto">
              <ChordChartWidget
                data={data.migrationData ?? []}
                title="Global Migrations"
                subtitle="2023"
              />
            </div>
          </div>

          {/* Bubble Chart */}
          <div className="h-auto">
            <BubbleChartWidget
              data={data.bubbleData ?? []}
              title="Global Tech Investment"
              subtitle="Market Cap vs Growth vs Workforce Size"
            />
          </div>

          {/* Timeline */}
          <div className="h-auto">
            <EnhancedTimelineWidget />
          </div>
        </div>
      </main>
    </div>
  );
}
