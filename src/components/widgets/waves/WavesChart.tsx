"use client";

import React from "react";
import { useWavesChartLogic } from "@/hooks/waves/useWavesChartLogic";
import { useWavesInteractionLogic } from "@/hooks/waves/useWavesInteractionLogic";
import { useWavesRenderLogic } from "@/hooks/waves/useWavesRenderLogic";
import { WavesChartProps } from "@/interfaces/widgets";
import { WavesCanvas } from "./waves-components";

export default function WavesChart({
  data,
  title,
  onRefresh,
}: WavesChartProps) {
  const { chartData } = useWavesChartLogic({ data, title });
  const { chartRef, isLoaded, handleRefresh } = useWavesInteractionLogic();
  const { wavePaths } = useWavesRenderLogic(chartData);
  const handleRefreshClick = () => {
    handleRefresh(onRefresh);
  };

  return (
    <div
      style={{
        textAlign: "center",
        fontFamily: "Montserrat, sans-serif",
        borderRadius: "12px",
        padding: 0,
        color: "var(--secondary-text)",
      }}
    >
      <WavesCanvas
        chartRef={chartRef}
        isLoaded={isLoaded}
        wavePaths={wavePaths}
        onRefresh={handleRefreshClick}
      />
    </div>
  );
}
