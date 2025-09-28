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
  setSidebarOpen: (open: boolean) => void;
}

export default function MobileGridLayout({
  data,
  selectedZone,
  setSelectedZone,
  selectedCity,
  setSidebarOpen,
}: MobileGridLayoutProps) {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <main className="flex-1 overflow-y-auto px-4 py-6 bg-[var(--background)]">
        <div className="max-w-full mx-auto space-y-6 mobile-grid-container">
          {/* Top Section - Clock and Weather - Using original slide dimensions */}
          <div className="grid grid-cols-1 gap-4">
            <div className="clock-widget-container">
              <ClockWidget
                selectedZone={selectedZone}
                setSelectedZone={setSelectedZone}
                isMobile={true}
                onOpenSidebar={() => setSidebarOpen(true)}
                showSidebarButton={true}
              />
            </div>
            <div className="weather-widget-container">
              <WeatherWidgetMobile city={selectedCity} />
            </div>
          </div>

          {/* Timer Section */}
          <div className="h-64">
            <TimerWidget
              onOpenSidebar={() => setSidebarOpen(true)}
              showSidebarButton={false}
            />
          </div>

          {/* Music Widget */}
          <div className="h-48">
            <MusicWidget title="Spotify Music Player" compact={true} />
          </div>

          {/* Map and Calendar Section */}
          <div className="grid grid-cols-1 gap-4">
            <div className="h-80">
              <MapWidget
                onOpenSidebar={() => setSidebarOpen(true)}
                showSidebarButton={false}
              />
            </div>
            <div className="h-80">
              <CalendarWidgetMobile
                onOpenSidebar={() => setSidebarOpen(true)}
                showSidebarButton={false}
              />
            </div>
          </div>

          {/* Wallet and Spending Section */}
          <WidgetHeightProvider>
            <WidgetStateProvider>
              <div className="grid grid-cols-1 gap-4">
                <div className="h-80">
                  <WalletWidget />
                </div>
                <div className="h-64">
                  <WheelWidget
                    onOpenSidebar={() => setSidebarOpen(true)}
                    showSidebarButton={false}
                  />
                </div>
                <div className="h-64">
                  <AggregatedSpendingWidget
                    onOpenSidebar={() => setSidebarOpen(true)}
                    showSidebarButton={false}
                  />
                </div>
              </div>
            </WidgetStateProvider>
          </WidgetHeightProvider>

          {/* Contribution Graph */}
          <WidgetHeightProvider>
            <WidgetStateProvider>
              <div className="h-80">
                <ContributionGraphWidget title="Financial Activity Overview" />
              </div>
            </WidgetStateProvider>
          </WidgetHeightProvider>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 gap-3">
            {(data.metricCards ?? []).map((metric, index) => (
              <div key={index} className="h-32">
                <MetricWidget
                  metric={metric}
                  index={index}
                  onOpenSidebar={() => setSidebarOpen(true)}
                  showSidebarButton={index === 0}
                />
              </div>
            ))}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 gap-4">
            <div className="h-80">
              <LineChartWidget
                data={data.salesData ?? []}
                title="Sales Performance"
                onOpenSidebar={() => setSidebarOpen(true)}
                showSidebarButton={false}
              />
            </div>
            <div className="h-80">
              <BarChartWidget
                data={data.barChartData ?? []}
                title="Quarterly Overview"
                onOpenSidebar={() => setSidebarOpen(true)}
                showSidebarButton={false}
              />
            </div>
          </div>

          {/* Performance and Device Usage */}
          <div className="grid grid-cols-1 gap-4">
            <div className="h-80">
              <RadarChartWidget
                data={
                  (data.performanceMetricsData
                    ?.currentMetrics as RadarChartDataItem[]) ??
                  data.radarChartData ??
                  []
                }
                title="Performance Metrics"
                onOpenSidebar={() => setSidebarOpen(true)}
                showSidebarButton={false}
              />
            </div>
            <div className="h-80">
              <DeviceUsageWidget
                data={data.pieChartData ?? []}
                title="Device Usage"
                onOpenSidebar={() => setSidebarOpen(true)}
                showSidebarButton={false}
              />
            </div>
          </div>

          {/* Recent Users */}
          <div className="h-80">
            <RecentUsersWidget
              data={data.userData ?? []}
              title="Recent Users"
            />
          </div>

          {/* Advanced Charts */}
          <div className="grid grid-cols-1 gap-4">
            <div className="h-80">
              <SankeyChartWidget
                data={data.sankeyData ?? []}
                title="Global Migration Flows"
                subtitle="2019/2020"
                onOpenSidebar={() => setSidebarOpen(true)}
                showSidebarButton={false}
              />
            </div>
            <div className="h-80">
              <ChordChartWidget
                data={data.migrationData ?? []}
                title="Global Migrations"
                subtitle="2023"
                onOpenSidebar={() => setSidebarOpen(true)}
                showSidebarButton={false}
              />
            </div>
          </div>

          {/* Bubble Chart */}
          <div className="h-80">
            <BubbleChartWidget
              data={data.bubbleData ?? []}
              title="Global Tech Investment"
              subtitle="Market Cap vs Growth vs Workforce Size"
              onOpenSidebar={() => setSidebarOpen(true)}
              showSidebarButton={false}
            />
          </div>

          {/* Timeline */}
          <div className="h-80">
            <EnhancedTimelineWidget
              onOpenSidebar={() => setSidebarOpen(true)}
              showSidebarButton={false}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
