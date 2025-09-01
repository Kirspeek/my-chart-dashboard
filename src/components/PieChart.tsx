"use client";

import React from "react";
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import type { PieChartProps } from "../../interfaces/charts";
import WidgetBase from "./common/WidgetBase";
import { useTheme } from "../hooks/useTheme";

export default function PieChart({ data, title }: PieChartProps) {
  const { colorsTheme } = useTheme();
  const pieChartColors = colorsTheme.widgets.pieChart;

  return (
    <WidgetBase>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {title}
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <RechartsPieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) =>
              `${name} ${((percent || 0) * 100).toFixed(0)}%`
            }
            outerRadius={80}
            fill={pieChartColors.fill}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={
                  pieChartColors.colors[index % pieChartColors.colors.length]
                }
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: pieChartColors.tooltip.background,
              border: `1px solid ${pieChartColors.tooltip.border}`,
              borderRadius: "8px",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            }}
            formatter={(value: number, name: string) => [`${value}%`, name]}
          />
          <Legend />
        </RechartsPieChart>
      </ResponsiveContainer>
    </WidgetBase>
  );
}
