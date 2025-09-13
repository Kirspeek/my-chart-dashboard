"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import SlideNavigation from "@/components/common/SlideNavigation";
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
} from "@/components/widgets";
import CalendarWidgetMobile from "@/components/widgets/calendar/CalendarWidgetMobile";
import { useWeatherPreload } from "@/hooks";
import { Menu } from "lucide-react";
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

    const checkMobile = () => {
      const isPhone = window.innerWidth <= 425;
      setIsMobile(isPhone);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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
    if (currentSlide === 2) {
      return;
    }

    const distance = touchStart - touchEnd;
    const isUpSwipe = distance > minSwipeDistance;
    const isDownSwipe = distance < -minSwipeDistance;

    if (isUpSwipe && currentSlide < 16) {
      setCurrentSlide(currentSlide + 1);
    }
    if (isDownSwipe && currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  if (!data.metricCards) return <div>Loading dashboard data...</div>;
  if (isMobile) {
    return (
      <SearchProvider>
        <div className="flex min-h-screen bg-[var(--background)]">
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          {sidebarOpen && (
            <div
              className="fixed inset-0 z-30 bg-black/30 backdrop-blur-sm transition-opacity duration-300 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          <WidgetStateProvider>
            <div
              className="mobile-swipe-container"
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
              <div
                className="mobile-slides-container"
                style={{ transform: `translateY(-${currentSlide * 100}vh)` }}
              >
                <div className="mobile-slide">
                  <div className="flex flex-col h-full pt-4">
                    <div className="h-[45vh] relative">
                      <ClockWidget
                        selectedZone={selectedZone}
                        setSelectedZone={setSelectedZone}
                        isMobile={true}
                        onOpenSidebar={() => setSidebarOpen(true)}
                        showSidebarButton={true}
                        currentSlide={currentSlide}
                        setCurrentSlide={setCurrentSlide}
                      />
                    </div>
                    <div className="h-[65vh] relative">
                      <WeatherWidgetMobile
                        city={selectedCity}
                        currentSlide={currentSlide}
                        setCurrentSlide={setCurrentSlide}
                      />
                    </div>
                    <SlideNavigation
                      currentSlide={currentSlide}
                      setCurrentSlide={setCurrentSlide}
                      className="slide-1-navigation"
                    />
                  </div>
                </div>
                <div className="mobile-slide">
                  <div className="flex flex-col h-full pt-4">
                    <div className="relative h-full">
                      <TimerWidget
                        onOpenSidebar={() => setSidebarOpen(true)}
                        showSidebarButton={true}
                        currentSlide={currentSlide}
                        setCurrentSlide={setCurrentSlide}
                      />
                    </div>
                  </div>
                </div>
                <div className="mobile-slide">
                  <div className="flex flex-col h-full pt-4">
                    <div className="relative h-full">
                      <MapWidget
                        onOpenSidebar={() => setSidebarOpen(true)}
                        showSidebarButton={true}
                      />
                      <div className="absolute top-4 right-4 z-10 bg-black/20 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                        Map Mode
                      </div>
                      <SlideNavigation
                        currentSlide={currentSlide}
                        setCurrentSlide={setCurrentSlide}
                        className="absolute bottom-4 right-4"
                      />
                    </div>
                  </div>
                </div>
                <div className="mobile-slide">
                  <div className="flex flex-col h-full pt-4">
                    <div className="relative h-full">
                      <CalendarWidgetMobile
                        onOpenSidebar={() => setSidebarOpen(true)}
                        showSidebarButton={true}
                        currentSlide={currentSlide}
                        setCurrentSlide={setCurrentSlide}
                      />
                    </div>
                  </div>
                </div>
                <WidgetHeightProvider>
                  <div className="mobile-slide">
                    <div className="relative h-full">
                      <WalletWidget
                        currentSlide={currentSlide}
                        setCurrentSlide={setCurrentSlide}
                      />
                    </div>
                  </div>
                  <div className="mobile-slide">
                    <div className="flex flex-col h-full pt-4">
                      <div className="relative h-full">
                        <WheelWidget
                          onOpenSidebar={() => setSidebarOpen(true)}
                          showSidebarButton={true}
                          currentSlide={currentSlide}
                          setCurrentSlide={setCurrentSlide}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mobile-slide">
                    <div className="flex flex-col h-full pt-4">
                      <div className="relative h-full">
                        <AggregatedSpendingWidget
                          onOpenSidebar={() => setSidebarOpen(true)}
                          showSidebarButton={true}
                          currentSlide={currentSlide}
                          setCurrentSlide={setCurrentSlide}
                        />
                      </div>
                    </div>
                  </div>
                </WidgetHeightProvider>
                <div className="mobile-slide">
                  <div className="flex flex-col h-full pt-4">
                    <div className="relative h-full">
                      <ContributionGraphWidget
                        title="Financial Activity Overview"
                        onOpenSidebar={() => setSidebarOpen(true)}
                        showSidebarButton={true}
                        currentSlide={currentSlide}
                        setCurrentSlide={setCurrentSlide}
                      />
                    </div>
                  </div>
                </div>
                <div className="mobile-slide">
                  <div className="flex flex-col h-full pt-4">
                    <div className="flex flex-col gap-4 h-full px-4 relative">
                      {(data.metricCards ?? []).map((metric, index) => (
                        <div key={index} className="h-[18vh]">
                          <MetricWidget
                            metric={metric}
                            index={index}
                            onOpenSidebar={() => setSidebarOpen(true)}
                            showSidebarButton={index === 0}
                          />
                        </div>
                      ))}
                    </div>
                    <SlideNavigation
                      currentSlide={currentSlide}
                      setCurrentSlide={setCurrentSlide}
                      totalSlides={17}
                    />
                  </div>
                </div>
                <div className="mobile-slide">
                  <div className="flex flex-col h-full pt-4">
                    <div className="relative h-full">
                      <LineChartWidget
                        data={data.salesData ?? []}
                        title="Sales Performance"
                        onOpenSidebar={() => setSidebarOpen(true)}
                        showSidebarButton={true}
                        currentSlide={currentSlide}
                        setCurrentSlide={setCurrentSlide}
                      />
                    </div>
                  </div>
                </div>
                <div className="mobile-slide">
                  <div className="flex flex-col h-full pt-4">
                    <div className="relative h-full">
                      <BarChartWidget
                        data={data.barChartData ?? []}
                        title="Quarterly Overview"
                        onOpenSidebar={() => setSidebarOpen(true)}
                        showSidebarButton={true}
                        currentSlide={currentSlide}
                        setCurrentSlide={setCurrentSlide}
                      />
                    </div>
                  </div>
                </div>
                <div className="mobile-slide">
                  <div className="flex flex-col h-full pt-4">
                    <div className="relative h-full">
                      <RadarChartWidget
                        data={data.radarChartData ?? []}
                        title="Performance Metrics"
                        onOpenSidebar={() => setSidebarOpen(true)}
                        showSidebarButton={true}
                        currentSlide={currentSlide}
                        setCurrentSlide={setCurrentSlide}
                      />
                    </div>
                  </div>
                </div>
                <div className="mobile-slide">
                  <div className="flex flex-col h-full pt-4">
                    <div className="relative h-full">
                      <DeviceUsageWidget
                        data={data.pieChartData ?? []}
                        title="Device Usage"
                        onOpenSidebar={() => setSidebarOpen(true)}
                        showSidebarButton={true}
                        currentSlide={currentSlide}
                        setCurrentSlide={setCurrentSlide}
                      />
                    </div>
                  </div>
                </div>
                <div className="mobile-slide">
                  <div className="flex flex-col h-full pt-4">
                    <div className="relative h-full">
                      <SankeyChartWidget
                        data={data.sankeyData ?? []}
                        title="Global Migration Flows"
                        subtitle="2019/2020"
                        onOpenSidebar={() => setSidebarOpen(true)}
                        showSidebarButton={true}
                        currentSlide={currentSlide}
                        setCurrentSlide={setCurrentSlide}
                      />
                    </div>
                  </div>
                </div>
                <div className="mobile-slide">
                  <div className="flex flex-col h-full pt-4">
                    <div className="relative h-full">
                      <ChordChartWidget
                        data={data.migrationData ?? []}
                        title="Global Migrations"
                        subtitle="2023"
                        onOpenSidebar={() => setSidebarOpen(true)}
                        showSidebarButton={true}
                        currentSlide={currentSlide}
                        setCurrentSlide={setCurrentSlide}
                      />
                    </div>
                    <SlideNavigation
                      currentSlide={currentSlide}
                      setCurrentSlide={setCurrentSlide}
                      totalSlides={17}
                    />
                  </div>
                </div>
                <div className="mobile-slide">
                  <div className="flex flex-col h-full pt-4">
                    <div className="relative h-full">
                      <BubbleChartWidget
                        data={data.bubbleData ?? []}
                        title="Global Tech Investment"
                        subtitle="Market Cap vs Growth vs Workforce Size"
                        onOpenSidebar={() => setSidebarOpen(true)}
                        showSidebarButton={true}
                        currentSlide={currentSlide}
                        setCurrentSlide={setCurrentSlide}
                      />
                    </div>
                  </div>
                </div>
                <div className="mobile-slide">
                  <div className="flex flex-col h-full pt-4">
                    <div className="relative h-full">
                      <EnhancedTimelineWidget
                        onOpenSidebar={() => setSidebarOpen(true)}
                        showSidebarButton={true}
                        currentSlide={currentSlide}
                        setCurrentSlide={setCurrentSlide}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </WidgetStateProvider>
        </div>
      </SearchProvider>
    );
  }

  return (
    <SearchProvider>
      <div className="flex min-h-screen bg-[var(--background)]">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/30 backdrop-blur-sm transition-opacity duration-300 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <FilteredWidgetsGrid
          data={data}
          selectedZone={selectedZone}
          setSelectedZone={setSelectedZone}
          selectedCity={selectedCity}
        />

        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="relative">
            <Header />
            {isMobile && (
              <button
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={() => setSidebarOpen(true)}
                aria-label="Open sidebar"
                type="button"
              >
                <Menu className="h-6 w-6" />
              </button>
            )}
          </div>

          <main className="flex-1 overflow-y-auto px-6 py-8 bg-[var(--background)]">
            <div className="max-w-7xl mx-auto">
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
                      <div className="flex-none h-72 2xl:h-96">
                        {isMobile ? (
                          <WeatherWidgetMobile city={selectedCity} />
                        ) : (
                          <WeatherWidget city={selectedCity} />
                        )}
                      </div>
                      <div className="h-2"></div>{" "}
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

              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 my-8">
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

              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 my-8">
                <div className="lg:col-span-2 xl:col-span-2 h-full">
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
                    currentSlide={currentSlide}
                    setCurrentSlide={setCurrentSlide}
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
