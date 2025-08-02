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

  return (
    <WidgetBase
      className="flex flex-col"
      style={{
        height: targetHeight,
      }}
    >
      <WavesChart data={data} title={title} onRefresh={onRefresh} />
    </WidgetBase>
  );
}
