"use client";

import React from "react";
import { RadarChartWidgetProps } from "../../../../interfaces/widgets";
import WidgetBase from "../../common/WidgetBase";
import RadarChartHeader from "./RadarChartHeader";
import RadarChartContainer from "./RadarChartContainer";

export default function RadarChartWidget({
  data,
  title,
}: RadarChartWidgetProps) {
  // Detect mobile to apply full-screen sizing
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
      className={`flex flex-col h-full ${isMobile ? "radar-chart-widget" : ""}`}
      style={{
        width: isMobile ? "100vw" : undefined,
        height: isMobile ? "82vh" : undefined,
        padding: isMobile ? 0 : undefined,
        borderRadius: isMobile ? 0 : undefined,
      }}
    >
      <RadarChartHeader title={title} />
      <RadarChartContainer data={data} />
    </WidgetBase>
  );
}
