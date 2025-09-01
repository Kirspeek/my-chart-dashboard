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
import type { LineChartProps } from "../../interfaces/charts";
import WidgetBase from "./common/WidgetBase";
import { useTheme } from "../hooks/useTheme";

export default function LineChart({ data, title }: LineChartProps) {
  const { colorsTheme } = useTheme();
  const lineChartColors = colorsTheme.widgets.lineChart;

  return (
    <WidgetBase>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {title}
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <RechartsLineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke={lineChartColors.grid} />
          <XAxis dataKey="month" stroke={lineChartColors.axis} fontSize={12} />
          <YAxis
            stroke={lineChartColors.axis}
            fontSize={12}
            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: lineChartColors.tooltip.background,
              border: `1px solid ${lineChartColors.tooltip.border}`,
              borderRadius: "8px",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            }}
            formatter={(value: number, name: string) => [
              `$${value.toLocaleString()}`,
              name.charAt(0).toUpperCase() + name.slice(1),
            ]}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="sales"
            stroke={lineChartColors.lines.sales}
            strokeWidth={2}
            dot={{ fill: lineChartColors.lines.sales, strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke={lineChartColors.lines.revenue}
            strokeWidth={2}
            dot={{ fill: lineChartColors.lines.revenue, strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="profit"
            stroke={lineChartColors.lines.profit}
            strokeWidth={2}
            dot={{ fill: lineChartColors.lines.profit, strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6 }}
          />
        </RechartsLineChart>
      </ResponsiveContainer>
    </WidgetBase>
  );
}
