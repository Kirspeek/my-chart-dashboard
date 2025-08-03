"use client";

import React from "react";
import {
  useWavesChartLogic,
  useWavesInteractionLogic,
  useWavesRenderLogic,
  WaveData,
} from "./logic";
import { WavesCanvas } from "./components";
import { ChartHeader } from "../../common";

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
  const { chartData, chartTitle } = useWavesChartLogic({ data, title });

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
        padding: "20px",
        color: "rgba(0, 0, 0, 0.7)",
      }}
    >
      {title && (
        <ChartHeader
          title={title}
          onRefresh={handleRefreshClick}
          showRefreshButton={true}
        />
      )}

      <WavesCanvas
        chartRef={chartRef}
        isLoaded={isLoaded}
        wavePaths={wavePaths}
        onRefresh={handleRefreshClick}
      />

      <div
        style={{
          lineHeight: "36px",
          fontStyle: "italic",
          color: "rgba(0, 0, 0, 0.7)",
          marginTop: "1rem",
        }}
      >
        {chartTitle}
      </div>
    </div>
  );
}
