"use client";

import React from "react";
import { LineChartWidgetProps } from "../../../../interfaces/widgets";
import WidgetBase from "../../common/WidgetBase";
import LineChartHeader from "./LineChartHeader";
import LineChartContainer from "./LineChartContainer";

export default function LineChartWidget({ data, title }: LineChartWidgetProps) {
  // Detect mobile to apply full-screen sizing
  const [isMobile, setIsMobile] = React.useState(false);
  React.useEffect(() => {
    const check = () => {
      if (typeof window !== "undefined") {
        setIsMobile(window.innerWidth <= 768);
      }
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <WidgetBase
      className={`flex flex-col ${isMobile ? "line-chart-widget" : ""}`}
      style={{
        width: isMobile ? "100vw" : undefined,
        height: isMobile ? "82vh" : undefined,
        padding: isMobile ? 0 : undefined,
        borderRadius: isMobile ? 0 : undefined,
      }}
    >
      <LineChartHeader title={title} />
      <LineChartContainer data={data} />
    </WidgetBase>
  );
}
