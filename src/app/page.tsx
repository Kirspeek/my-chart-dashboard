"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import MetricCard from "@/components/metric-card";
import LineChart from "../components/LineChart";
import BarChart from "../components/BarChart";
import PieChart from "../components/PieChart";
import DataTable from "../components/DataTable";
import {
  metricCards,
  salesData,
  barChartData,
  pieChartData,
  userData,
} from "@/lib/data";
import ClockWidget from "@/components/widgets/clock/ClockWidget";
import WeatherWidget from "../components/weather/WeatherWidget";
import WeatherCacheStatus from "../components/weather/WeatherCacheStatus";
import TimerWidget from "@/components/widgets/TimerWidget";
import { useWeatherPreload } from "@/hooks";

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
      {/* Sidebar */}
      <Sidebar />
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header />
        {/* Main dashboard content */}
        <main className="flex-1 overflow-y-auto px-8 py-8 bg-[var(--background)]">
          <div className="max-w-7xl mx-auto">
            {/* Widget grid */}
            {mounted && (
              <div className="flex flex-col lg:flex-row items-stretch gap-8 mb-12 px-2 lg:px-0">
                {/* Left: ClockWidget */}
                <div
                  className="flex items-stretch justify-center"
                  style={{ flex: 1.15, minWidth: 420, maxWidth: 650 }}
                >
                  <ClockWidget
                    selectedZone={selectedZone}
                    setSelectedZone={setSelectedZone}
                  />
                </div>
                {/* Right: Weather and Music stacked */}
                <div
                  className="flex flex-col gap-8 justify-between"
                  style={{ flex: 1, minWidth: 320, maxWidth: 420 }}
                >
                  <div
                    className="flex-1 flex items-stretch"
                    style={{ width: "100%", minWidth: 320, maxWidth: 420 }}
                  >
                    <WeatherWidget city={selectedCity} />
                  </div>
                  <div
                    className="flex-1 flex items-stretch"
                    style={{ width: "100%", minWidth: 320, maxWidth: 420 }}
                  >
                    <TimerWidget />
                  </div>
                </div>
              </div>
            )}

            {/* Cache Status Demo */}
            <div className="mb-8">
              <WeatherCacheStatus cities={allCities} />
            </div>

            {/* Metric cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {metricCards.map((metric, index) => (
                <MetricCard key={index} metric={metric} index={index} />
              ))}
            </div>
            {/* Charts grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
              <LineChart data={salesData} title="Sales Performance" />
              <BarChart data={barChartData} title="Quarterly Overview" />
            </div>
            {/* Bottom row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <DataTable data={userData} title="Recent Users" />
              </div>
              <div>
                <PieChart data={pieChartData} title="Device Usage" />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
