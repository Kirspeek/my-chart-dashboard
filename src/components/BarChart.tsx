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
import type { BarChartProps } from "../../interfaces/charts";
import WidgetBase from "./common/WidgetBase";
import { useTheme } from "../hooks/useTheme";

export default function BarChart({ data, title }: BarChartProps) {
  const { colorsTheme } = useTheme();
  const barChartColors = colorsTheme.widgets.barChart;

  return (
    <WidgetBase>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {title}
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <RechartsBarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke={barChartColors.grid} />
          <XAxis dataKey="name" stroke={barChartColors.axis} fontSize={12} />
          <YAxis
            stroke={barChartColors.axis}
            fontSize={12}
            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: barChartColors.tooltip.background,
              border: `1px solid ${barChartColors.tooltip.border}`,
              borderRadius: "8px",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            }}
            formatter={(value: number, name: string) => [
              `$${value.toLocaleString()}`,
              name.charAt(0).toUpperCase() + name.slice(1),
            ]}
          />
          <Legend />
          <Bar
            dataKey="sales"
            fill={barChartColors.bars.sales}
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="revenue"
            fill={barChartColors.bars.revenue}
            radius={[4, 4, 0, 0]}
          />
        </RechartsBarChart>
      </ResponsiveContainer>
    </WidgetBase>
  );
}
