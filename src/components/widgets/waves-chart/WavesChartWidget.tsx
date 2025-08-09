"use client";

import React from "react";
import WidgetBase from "../../common/WidgetBase";
import WavesChart from "./WavesChart";
import { useWidgetHeight } from "../../../context/WidgetHeightContext";
import { WaveData } from "./logic";

interface WavesChartWidgetProps {
  data?: WaveData[];
  title?: string;
  onRefresh?: () => void;
}

export default function WavesChartWidget({
  data,
  title,
  onRefresh,
}: WavesChartWidgetProps) {
  const { targetHeight } = useWidgetHeight();

  // Detect mobile to apply full-screen sizing without affecting desktop
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
      className="flex flex-col"
      style={{
        height: isMobile ? "82vh" : targetHeight,
        width: isMobile ? "100vw" : undefined,
        padding: isMobile ? 0 : undefined,
        borderRadius: isMobile ? 0 : undefined,
      }}
    >
      <WavesChart data={data} title={title} onRefresh={onRefresh} />
    </WidgetBase>
  );
}
