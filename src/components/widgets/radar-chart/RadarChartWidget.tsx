"use client";

import React, { useState, useEffect } from "react";
import { RadarChartWidgetProps } from "../../../../interfaces/widgets";
import WidgetBase from "../../common/WidgetBase";
import SlideNavigation from "../../common/SlideNavigation";
import PerformanceMetricsHeader from "./PerformanceMetricsHeader";
import PerformanceMetricsContainer from "./PerformanceMetricsContainer";

export default function RadarChartWidget({
  data,
  title,
  onOpenSidebar,
  showSidebarButton = false,
  currentSlide,
  setCurrentSlide,
}: RadarChartWidgetProps & {
  onOpenSidebar?: () => void;
  showSidebarButton?: boolean;
  currentSlide?: number;
  setCurrentSlide?: (slide: number) => void;
}) {
  const [isMobile, setIsMobile] = useState(false);
  const [currentView, setCurrentView] = useState<
    "radar" | "timeline" | "alerts" | "capacity"
  >("radar");
  const [isRealTime, setIsRealTime] = useState(true);

  useEffect(() => {
    const check = () => {
      if (typeof window !== "undefined") {
        setIsMobile(window.innerWidth <= 425);
      }
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Auto-rotate views for demonstration
  useEffect(() => {
    if (isRealTime) {
      const interval = setInterval(() => {
        setCurrentView((prev) => {
          const views = ["radar", "timeline", "alerts", "capacity"] as const;
          const currentIndex = views.indexOf(prev);
          return views[(currentIndex + 1) % views.length];
        });
      }, 20000); // Change view every 20 seconds
      return () => clearInterval(interval);
    }
  }, [isRealTime]);

  return (
    <WidgetBase
      className={`flex flex-col h-full ${isMobile ? "performance-metrics-widget" : ""}`}
      style={{
        width: isMobile ? "100vw" : undefined,
        height: isMobile ? "82vh" : undefined,
        padding: isMobile ? 0 : undefined,
        borderRadius: isMobile ? 0 : undefined,
      }}
      onOpenSidebar={onOpenSidebar}
      showSidebarButton={showSidebarButton}
    >
      <PerformanceMetricsHeader
        title={title}
        currentView={currentView}
        setCurrentView={setCurrentView}
        isRealTime={isRealTime}
        setIsRealTime={setIsRealTime}
      />
      <PerformanceMetricsContainer
        data={data}
        currentView={currentView}
        isRealTime={isRealTime}
      />
      {/* Navigation buttons */}
      {currentSlide !== undefined && setCurrentSlide && (
        <SlideNavigation
          currentSlide={currentSlide}
          setCurrentSlide={setCurrentSlide}
          totalSlides={17}
        />
      )}
    </WidgetBase>
  );
}
