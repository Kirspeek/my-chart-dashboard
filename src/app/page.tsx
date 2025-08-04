"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import MobileHamburgerMenu from "@/components/MobileHamburgerMenu";
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
  TimelineRingsWidget,
  WalletWidget,
  WalletCardWidget,
  ContributionGraphWidget,
  AggregatedSpendingWidget,
} from "@/components/widgets";
import CalendarWidgetMobile from "@/components/widgets/calendar/CalendarWidgetMobile";
import { useWeatherPreload } from "@/hooks";
import { Menu } from "lucide-react";
import type { UserData } from "../../interfaces/dashboard";
import { WidgetHeightProvider } from "../context/WidgetHeightContext";
import { WidgetStateProvider } from "../context/WidgetStateContext";

interface MetricCardData {
  title: string;
  value: string;
  change: number;
  icon: string;
}

interface RadarChartDataItem {
  subject: string;
  value: number;
  fullMark: number;
}

interface SankeyChartDataItem {
  from: string;
  to: string;
  size: number;
}

interface BubbleChartDataItem {
  x: number;
  y: number;
  size: number;
  category: string;
  label: string;
}

interface DashboardData {
  metricCards?: MetricCardData[];
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
  radarChartData?: RadarChartDataItem[];
  migrationData?: SankeyChartDataItem[];
  sankeyData?: SankeyChartDataItem[];
  bubbleData?: BubbleChartDataItem[];
}

const cityMap: { [key: string]: string } = {
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
      ]);
      setData({
        metricCards,
        salesData,
        barChartData,
        pieChartData,
        userData,
        radarChartData,
        migrationData,
        sankeyData,
        bubbleData,
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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const data = useDashboardData();

  useWeatherPreload(allCities, {
    autoPreload: true,
    preloadOnMount: true,
  });

  useEffect(() => {
    setMounted(true);
    const localZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setSelectedZone(localZone);

    // Check if mobile (phones only, not tablets)
    const checkMobile = () => {
      // Use mobile version only for phones (≤768px)
      // Tablets (768px-1024px) and desktop (>1024px) use desktop version
      const isPhone = window.innerWidth <= 768;
      setIsMobile(isPhone);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Touch/swipe handling for mobile
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(0);
    setTouchStart(e.targetTouches[0].clientY);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientY);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isUpSwipe = distance > minSwipeDistance;
    const isDownSwipe = distance < -minSwipeDistance;

    if (isUpSwipe && currentSlide < 3) {
      setCurrentSlide(currentSlide + 1);
    }
    if (isDownSwipe && currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  if (!data.metricCards) return <div>Loading dashboard data...</div>;

  // Mobile swipe interface
  if (isMobile) {
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

        <div
          className="mobile-swipe-container"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {/* Hamburger menu button */}
          <MobileHamburgerMenu onOpenSidebar={() => setSidebarOpen(true)} />

          <div
            className="mobile-slides-container"
            style={{ transform: `translateY(-${currentSlide * 100}vh)` }}
          >
            {/* Slide 1: Clock + Weather Widgets in column */}
            <div className="mobile-slide">
              <div className="flex flex-col h-full pt-4">
                <div className="h-[45vh]">
                  <ClockWidget
                    selectedZone={selectedZone}
                    setSelectedZone={setSelectedZone}
                    isMobile={true}
                  />
                </div>
                <div className="h-[65vh]">
                  <WeatherWidgetMobile city={selectedCity} />
                </div>
              </div>
            </div>

            {/* Slide 2: Timer Widget */}
            <div className="mobile-slide">
              <TimerWidget />
            </div>

            {/* Slide 3: Map Widget */}
            <div className="mobile-slide">
              <MapWidget />
            </div>

            {/* Slide 4: Calendar Widget */}
            <div className="mobile-slide">
              <CalendarWidgetMobile />
            </div>
          </div>

          {/* Slide indicators */}
          <div className="mobile-slide-indicators">
            {[0, 1, 2, 3].map((index) => (
              <div
                key={index}
                className={`mobile-slide-indicator ${currentSlide === index ? "active" : ""}`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Desktop layout (unchanged)
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
                      isMobile={false}
                    />
                  </div>
                  {/* Column 2: Weather (70%) + Timer (30%) */}
                  <div className="h-full flex flex-col">
                    <div className="flex-1 basis-[70%] min-h-0 mb-8">
                      {isMobile ? (
                        <WeatherWidgetMobile city={selectedCity} />
                      ) : (
                        <WeatherWidget city={selectedCity} />
                      )}
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

            {/* Wallet Widget */}
            <WidgetHeightProvider>
              <WidgetStateProvider>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 my-8 items-stretch">
                  <div>
                    <WalletWidget />
                  </div>
                  <div>
                    <WalletCardWidget />
                  </div>
                  <div>
                    <AggregatedSpendingWidget />
                  </div>
                </div>
              </WidgetStateProvider>
            </WidgetHeightProvider>

            {/* Contribution Graph Widget */}
            <WidgetHeightProvider>
              <WidgetStateProvider>
                <div className="grid grid-cols-1 gap-8 my-8">
                  <div>
                    <ContributionGraphWidget title="Financial Activity Overview" />
                  </div>
                </div>
              </WidgetStateProvider>
            </WidgetHeightProvider>
            {/* Metric cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 my-8">
              {(data.metricCards ?? []).map((metric, index) => (
                <MetricWidget key={index} metric={metric} index={index} />
              ))}
            </div>
            {/* Charts grid */}
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
            {/* New charts row: Performance Metrics and Chord Diagram side by side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 my-8">
              <RadarChartWidget
                data={data.radarChartData ?? []}
                title="Performance Metrics"
              />
            </div>
            {/* Bottom row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 my-8">
              <div className="lg:col-span-2 h-full">
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
            {/* Sankey Chart and Global Migrations row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 my-8">
              <div className="lg:col-span-2 h-full">
                <SankeyChartWidget
                  data={data.sankeyData ?? []}
                  title="Global Migration Flows"
                  subtitle="2019/2020"
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
            {/* Bubble Chart row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 my-8">
              <div className="lg:col-span-2 h-full">
                <BubbleChartWidget
                  data={data.bubbleData ?? []}
                  title="Global Tech Investment"
                  subtitle="Market Cap vs Growth vs Workforce Size"
                />
              </div>
            </div>
            {/* Timeline Rings row */}
            <div className="grid grid-cols-1 gap-8 my-8">
              <TimelineRingsWidget />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
