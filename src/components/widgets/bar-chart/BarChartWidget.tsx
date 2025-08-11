"use client";

import React from "react";
import { BarChartWidgetProps } from "../../../../interfaces/widgets";
import WidgetBase from "../../common/WidgetBase";
import BarChartHeader from "./BarChartHeader";
import BarChartContainer from "./BarChartContainer";

export default function BarChartWidget({ data, title }: BarChartWidgetProps) {
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
      className={`flex flex-col ${isMobile ? "bar-chart-widget" : ""}`}
      style={{
        width: isMobile ? "100vw" : undefined,
        height: isMobile ? "82vh" : undefined,
        padding: isMobile ? 0 : undefined,
        borderRadius: isMobile ? 0 : undefined,
      }}
    >
      <BarChartHeader title={title} />
      <BarChartContainer data={data} />
    </WidgetBase>
  );
}
