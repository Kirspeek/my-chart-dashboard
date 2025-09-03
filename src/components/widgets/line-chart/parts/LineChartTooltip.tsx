"use client";

import React from "react";
import type { LineChartTooltipProps } from "@/interfaces/charts";
import { useTheme } from "@/hooks/useTheme";
// no chart logic needed here

export default function LineChartTooltip({
  active,
  payload,
  label,
  enhancedData,
}: LineChartTooltipProps & {
  enhancedData: Array<{ month: string; revenueGrowth: number }>;
}) {
  const { colors, colorsTheme } = useTheme();
  const lineChartColors = colorsTheme.widgets.lineChart;
  if (active && payload && payload.length) {
    const sales = payload.find((p) => p.dataKey === "sales")?.value || 0;
    const revenue = payload.find((p) => p.dataKey === "revenue")?.value || 0;
    const profit = payload.find((p) => p.dataKey === "profit")?.value || 0;
    const monthData = enhancedData.find((d) => d.month === label);
    const revenueGrowth = monthData?.revenueGrowth || 0;
    return (
      <div
        className="p-3 rounded-lg shadow-lg border-0"
        style={{
          background: lineChartColors.tooltip.background,
          backdropFilter: "blur(10px)",
          border: `1px solid ${lineChartColors.tooltip.border}`,
        }}
      >
        <div
          className="font-bold text-sm mb-2"
          style={{ color: colors.accent.teal }}
        >
          {label} Performance
        </div>
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-sm">Sales:</span>
            <span className="font-bold text-sm">
              ${(sales / 1000).toFixed(1)}k
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">Revenue:</span>
            <span className="font-bold text-sm">
              ${(revenue / 1000).toFixed(1)}k
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">Profit:</span>
            <span className="font-bold text-sm">
              ${(profit / 1000).toFixed(1)}k
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">Revenue Growth:</span>
            <span
              className={`font-bold text-sm ${revenueGrowth > 0 ? "text-green-600" : revenueGrowth < 0 ? "text-red-600" : "text-gray-600"}`}
            >
              {revenueGrowth > 0 ? "+" : ""}
              {revenueGrowth.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
}
