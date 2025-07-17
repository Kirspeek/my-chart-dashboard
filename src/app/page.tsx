"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import {
  metricCards,
  salesData,
  barChartData,
  pieChartData,
  userData,
  radarChartData,
} from "@/lib/data";
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
} from "@/components/widgets";
import { useWeatherPreload } from "@/hooks";
import { Menu } from "lucide-react";

const cityMap: { [key: string]: string } = {
  "America/New_York": "New York",
  "Europe/London": "London",
  "Europe/Rome": "Rome",
  "Europe/Kyiv": "Kyiv",
};

// All cities that might be selected
const allCities = Object.values(cityMap);

export default function Home() {
  const [selectedZone, setSelectedZone] = useState("Europe/London"); // Default fallback
  const selectedCity = cityMap[selectedZone] || "London";
  const [mounted, setMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // Remove isDesktop logic and useEffect

  // Preload weather for all cities
  useWeatherPreload(allCities, {
    autoPreload: true,
    preloadOnMount: true,
  });

  useEffect(() => {
    setMounted(true);
    // Only get local timezone on client side
    const localZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setSelectedZone(localZone);
  }, []);

  return (
    <div className="flex min-h-screen bg-[var(--background)]">
      {/* Sidebar (mobile/desktop) */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/30 backdrop-blur-sm transition-opacity duration-300 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header with menu button */}
        <div className="relative">
          <Header />
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 lg:hidden"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
            type="button"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
        {/* Main dashboard content */}
        <main className="flex-1 overflow-y-auto px-6 py-8 bg-[var(--background)]">
          <div className="max-w-7xl mx-auto">
            {/* Widget grid */}
            {mounted && (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
                  {/* Column 1: ClockWidget */}
                  <div className="h-full">
                    <ClockWidget
                      selectedZone={selectedZone}
                      setSelectedZone={setSelectedZone}
                    />
                  </div>
                  {/* Column 2: Weather (70%) + Timer (30%) */}
                  <div className="h-full flex flex-col gap-8">
                    <div className="flex-1 basis-[70%] min-h-0">
                      <WeatherWidget city={selectedCity} />
                    </div>
                    <div className="flex-1 basis-[30%] min-h-0">
                      <TimerWidget />
                    </div>
                  </div>
                </div>
                {/* New row: Map and Calendar widgets */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                  <div className="h-full">
                    <MapWidget />
                  </div>
                  <div className="h-full">
                    <CalendarWidget />
                  </div>
                </div>
              </>
            )}

            {/* Metric cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 my-8">
              {metricCards.map((metric, index) => (
                <MetricWidget key={index} metric={metric} index={index} />
              ))}
            </div>
            {/* Charts grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 my-8">
              <LineChartWidget data={salesData} title="Sales Performance" />
              <BarChartWidget data={barChartData} title="Quarterly Overview" />
            </div>
            {/* New charts row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 my-8">
              <RadarChartWidget
                data={radarChartData}
                title="Performance Metrics"
              />
            </div>
            {/* Bottom row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 my-8">
              <div className="lg:col-span-2 h-full">
                <RecentUsersWidget data={userData} title="Recent Users" />
              </div>
              <div className="h-full">
                <DeviceUsageWidget data={pieChartData} title="Device Usage" />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
