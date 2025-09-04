"use client";

import React from "react";
import CustomBubbleChart from "./CustomBubbleChart";
import type { BubbleChartWidgetProps } from "@/interfaces/widgets";

export default function BubbleChartWidget({
  data,
  title,
  subtitle,
  onOpenSidebar,
  showSidebarButton = false,
  currentSlide,
  setCurrentSlide,
}: BubbleChartWidgetProps & {
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
    <CustomBubbleChart
      data={data}
      title={title}
      subtitle={subtitle}
      isMobile={isMobile}
      onOpenSidebar={onOpenSidebar}
      showSidebarButton={showSidebarButton}
      currentSlide={currentSlide}
      setCurrentSlide={setCurrentSlide}
    />
  );
}
