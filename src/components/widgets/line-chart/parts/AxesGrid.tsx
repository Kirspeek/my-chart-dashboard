"use client";

import React from "react";
import { CartesianGrid, XAxis, YAxis } from "recharts";
import { useChartLogic } from "@/hooks/useChartLogic";

export default function AxesGrid() {
  const { axisStyle, gridStyle, formatValue } = useChartLogic();
  return (
    <>
      <CartesianGrid
        strokeDasharray="3 3"
        stroke={gridStyle.stroke}
        opacity={0.3}
      />
      <XAxis
        dataKey="month"
        stroke={axisStyle.stroke}
        fontSize={axisStyle.fontSize}
        fontFamily={axisStyle.fontFamily}
        fontWeight={axisStyle.fontWeight}
      />
      <YAxis
        stroke={axisStyle.stroke}
        fontSize={axisStyle.fontSize}
        fontFamily={axisStyle.fontFamily}
        fontWeight={axisStyle.fontWeight}
        tickFormatter={formatValue}
      />
    </>
  );
}
