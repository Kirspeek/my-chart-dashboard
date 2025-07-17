"use client";

import React from "react";
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { ChartDataPoint } from "../../../../interfaces/widgets";
import { useChartLogic } from "../../../hooks/useChartLogic";

interface BarChartContainerProps {
  data: ChartDataPoint[];
}

export default function BarChartContainer({ data }: BarChartContainerProps) {
  const {
    chartColors,
    formatValue,
    formatTooltip,
    tooltipStyle,
    axisStyle,
    gridStyle,
  } = useChartLogic();

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RechartsBarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke={gridStyle.stroke} />
        <XAxis
          dataKey="name"
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
        <Tooltip contentStyle={tooltipStyle} formatter={formatTooltip} />
        <Legend
          wrapperStyle={{
            fontFamily: "var(--font-mono)",
            fontWeight: 700,
            fontSize: 12,
          }}
        />
        <Bar dataKey="sales" fill={chartColors.sales} radius={[4, 4, 0, 0]} />
        <Bar
          dataKey="revenue"
          fill={chartColors.revenue}
          radius={[4, 4, 0, 0]}
        />
      </RechartsBarChart>
    </ResponsiveContainer>
  );
}
