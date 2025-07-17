"use client";

import React from "react";
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { ChartDataPoint } from "../../../../interfaces/widgets";
import { useChartLogic } from "../../../hooks/useChartLogic";

interface LineChartContainerProps {
  data: ChartDataPoint[];
}

export default function LineChartContainer({ data }: LineChartContainerProps) {
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
      <RechartsLineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke={gridStyle.stroke} />
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
        <Tooltip contentStyle={tooltipStyle} formatter={formatTooltip} />
        <Legend
          wrapperStyle={{
            fontFamily: "var(--font-mono)",
            fontWeight: 700,
            fontSize: 12,
          }}
        />
        <Line
          type="monotone"
          dataKey="sales"
          stroke={chartColors.sales}
          strokeWidth={2}
          dot={{ fill: chartColors.sales, strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, fill: chartColors.sales }}
        />
        <Line
          type="monotone"
          dataKey="revenue"
          stroke={chartColors.revenue}
          strokeWidth={2}
          dot={{ fill: chartColors.revenue, strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, fill: chartColors.revenue }}
        />
        <Line
          type="monotone"
          dataKey="profit"
          stroke={chartColors.profit}
          strokeWidth={2}
          dot={{ fill: chartColors.profit, strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, fill: chartColors.profit }}
        />
      </RechartsLineChart>
    </ResponsiveContainer>
  );
}
