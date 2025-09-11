"use client";

import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { SearchProvider } from "@/context/SearchContext";
import { WidgetHeightProvider } from "@/context/WidgetHeightContext";
import { WidgetStateProvider } from "@/context/WidgetStateContext";
import {
  ClockWidget,
  WeatherWidget,
  TimerWidget,
  MapWidget,
  CalendarWidget,
  LineChartWidget,
  BarChartWidget,
  RecentUsersWidget,
  DeviceUsageWidget,
  RadarChartWidget,
  BubbleChartWidget,
  TimelineRingsWidget,
  WalletWidget,
  WheelWidget,
  ContributionGraphWidget,
  AggregatedSpendingWidget,
} from "@/components/widgets";
import { useEffect, useState } from "react";
import type { DashboardData, RadarChartDataItem } from "@/interfaces/pages";

export default function WidgetsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedZone, setSelectedZone] = useState("Europe/London");
  const [data, setData] = useState<DashboardData>({});
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    (async () => {
      try {
        const [
          salesData,
          barChartData,
          pieChartData,
          userData,
          radarData,
          migrationData,
          sankeyData,
          bubbleData,
        ] = await Promise.all([
          import("@/data/json/salesData.json").then((m) => m.default),
          import("@/data/json/barChartData.json").then((m) => m.default),
          import("@/data/json/pieChartData.json").then((m) => m.default),
          import("@/data/json/userData.json").then((m) => m.default),
          import("@/data/json/radarChartData.json").then((m) => m.default),
          import("@/data/json/migrationData.json").then((m) => m.default),
          import("@/data/json/sankeyData.json").then((m) => m.default),
          import("@/data/json/bubbleData.json").then((m) => m.default),
        ]);
        setData({
          salesData,
          barChartData,
          pieChartData,
          userData,
          radarChartData: (
            radarData as { currentMetrics: RadarChartDataItem[] }
          ).currentMetrics,
          migrationData,
          sankeyData,
          bubbleData,
        });
      } catch {}
    })();
  }, []);

  return (
    <SearchProvider>
      <div className="flex min-h-screen bg-[var(--background)]">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto px-6 py-8 bg-[var(--background)]">
            <WidgetHeightProvider>
              <WidgetStateProvider>
                <div className="max-w-7xl mx-auto space-y-12">
                  {/* Clocks & Time & Weather */}
                  <section>
                    <h2 className="primary-text text-xl font-bold mb-4">
                      Clocks & Time & Weather
                    </h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
                      {/* Left: Clock (same as dashboard) */}
                      <div className="h-full">
                        <ClockWidget
                          selectedZone={selectedZone}
                          setSelectedZone={setSelectedZone}
                          isMobile={false}
                        />
                      </div>
                      {/* Right: Weather above Timer (same as dashboard) */}
                      <div className="h-full flex flex-col">
                        <div className="flex-none h-72 2xl:h-96">
                          <WeatherWidget city="London" />
                        </div>
                        <div className="h-2"></div>{" "}
                        {/* Smaller gap between weather and timer */}
                        <div className="flex-1 min-h-0">
                          <TimerWidget className="h-full" />
                        </div>
                      </div>
                    </div>
                  </section>

                  {/*Map & Calendar */}
                  <section>
                    <h2 className="primary-text text-xl font-bold mb-4">
                      Map & Calendar
                    </h2>
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mt-6 lg:mt-8 mb-8">
                      <div className="h-full">
                        <MapWidget />
                      </div>
                      <div className="h-full">
                        <CalendarWidget />
                      </div>
                    </div>
                  </section>

                  {/* Wallet Group */}
                  <section>
                    <h2 className="primary-text text-xl font-bold mb-4">
                      Wallet
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 items-stretch md:justify-items-center lg:justify-items-stretch">
                      <div className="md:w-full lg:col-span-2 xl:col-span-1">
                        <WalletWidget />
                      </div>
                      <div className="md:w-full">
                        <WheelWidget />
                      </div>
                      <div className="md:w-full">
                        {isClient ? <AggregatedSpendingWidget /> : null}
                      </div>
                    </div>
                  </section>

                  {/* Analytics */}
                  <section>
                    <h2 className="primary-text text-xl font-bold mb-4 w-full">
                      Analytics
                    </h2>
                    <div className="grid grid-cols-1 gap-8 items-stretch my-8">
                      <ContributionGraphWidget title="Financial Activity Overview" />
                    </div>

                    <div className="grid grid-cols-1 gap-8 items-stretch my-8">
                      <TimelineRingsWidget />{" "}
                    </div>
                  </section>

                  {/* Charts */}
                  <section>
                    <h2 className="primary-text text-xl font-bold mb-4">
                      Charts
                    </h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
                      <LineChartWidget
                        data={data.salesData ?? []}
                        title="Sales Performance"
                      />
                      <BarChartWidget
                        data={data.barChartData ?? []}
                        title="Quarterly Overview"
                      />
                    </div>
                    <div className="grid grid-cols-1 gap-8 items-stretch mt-8">
                      <RadarChartWidget
                        data={data.radarChartData ?? []}
                        title="Performance Metrics"
                      />
                      <BubbleChartWidget
                        data={data.bubbleData ?? []}
                        title="Global Tech Investment"
                        subtitle="Market Cap vs Growth vs Workforce Size"
                      />
                    </div>
                  </section>

                  {/* Users & Devices */}
                  <section>
                    <h2 className="primary-text text-xl font-bold mb-4">
                      Users & Devices
                    </h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 items-stretch my-8">
                      <div className="lg:col-span-2 xl:col-span-2 h-full">
                        <RecentUsersWidget
                          data={data.userData ?? []}
                          title="Recent Users"
                        />
                      </div>
                      <div className="h-full">
                        <DeviceUsageWidget
                          data={data.pieChartData ?? []}
                          title="Device Usage"
                        />
                      </div>
                    </div>
                  </section>
                </div>
              </WidgetStateProvider>
            </WidgetHeightProvider>
          </main>
        </div>
      </div>
    </SearchProvider>
  );
}
