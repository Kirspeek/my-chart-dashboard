"use client";

import React from "react";
import {
  useWavesChartLogic,
  useWavesInteractionLogic,
  useWavesRenderLogic,
  WaveData,
} from "./waves-logic";
import { WavesCanvas } from "./waves-components";

interface WavesChartProps {
  data?: WaveData[];
  title?: string;
  onRefresh?: () => void;
}

export default function WavesChart({
  data,
  title,
  onRefresh,
}: WavesChartProps) {
  // Use organized logic hooks
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
