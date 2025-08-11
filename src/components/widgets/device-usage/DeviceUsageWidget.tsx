"use client";

import React from "react";
import { DeviceUsageWidgetProps } from "../../../../interfaces/widgets";
import WidgetBase from "../../common/WidgetBase";
import DeviceUsageHeader from "./DeviceUsageHeader";
import DeviceUsageContainer from "./DeviceUsageContainer";

export default function DeviceUsageWidget({
  data,
  title,
}: DeviceUsageWidgetProps) {
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
      className={`flex flex-col h-full ${isMobile ? "device-usage-widget" : ""}`}
      style={{
        width: isMobile ? "100vw" : undefined,
        height: isMobile ? "82vh" : undefined,
        padding: isMobile ? 0 : undefined,
        borderRadius: isMobile ? 0 : undefined,
      }}
    >
      <DeviceUsageHeader title={title} />
      <DeviceUsageContainer data={data} />
    </WidgetBase>
  );
}
