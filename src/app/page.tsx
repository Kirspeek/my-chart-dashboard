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
import MusicWidget from "@/components/widgets/MusicWidget";
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

  // Preload weather for all cities
  useWeatherPreload(allCities, {
    autoPreload: true,
    preloadOnMount: true,
  });

  useEffect(() => {
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
            <div className="flex flex-col lg:flex-row gap-8 mb-12">
              {/* Left: ClockWidget */}
              <div className="flex-1 flex items-stretch">
                <ClockWidget
                  selectedZone={selectedZone}
                  setSelectedZone={setSelectedZone}
                />
              </div>
              {/* Right: Weather and Music stacked */}
              <div
                className="flex flex-col flex-1 gap-8"
                style={{ minWidth: 0 }}
              >
                <div className="flex-1 flex items-stretch">
                  <WeatherWidget city={selectedCity} />
                </div>
                <div className="flex-1 flex items-stretch">
                  <MusicWidget />
                </div>
              </div>
            </div>

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
