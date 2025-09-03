"use client";

import React from "react";
import { BarChartWidgetProps } from "@/interfaces/widgets";
import { WidgetBase, SlideNavigation } from "@/components/common";
import BarChartHeader from "@/components/widgets/bar-chart/BarChartHeader";
import BarChartContainer from "@/components/widgets/bar-chart/BarChartContainer";

export default function BarChartWidget({
  data,
  title,
  onOpenSidebar,
  showSidebarButton = false,
  currentSlide,
  setCurrentSlide,
}: BarChartWidgetProps & {
  onOpenSidebar?: () => void;
  showSidebarButton?: boolean;
  currentSlide?: number;
  setCurrentSlide?: (slide: number) => void;
}) {
  const [isMobile, setIsMobile] = React.useState(false);
  React.useEffect(() => {
    const check = () => {
      if (typeof window !== "undefined") {
        setIsMobile(window.innerWidth <= 425);
      }
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <WidgetBase
      className={`flex flex-col ${isMobile ? "bar-chart-widget" : ""}`}
      style={{
        width: isMobile ? "100vw" : undefined,
        height: isMobile ? "82vh" : undefined,
        padding: isMobile ? "1rem" : undefined,
        borderRadius: isMobile ? "2rem" : undefined,
      }}
      onOpenSidebar={onOpenSidebar}
      showSidebarButton={showSidebarButton}
    >
      <BarChartHeader title={title} />
      <div className="flex-1 min-h-0 flex flex-col">
        <BarChartContainer data={data} />
      </div>
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
