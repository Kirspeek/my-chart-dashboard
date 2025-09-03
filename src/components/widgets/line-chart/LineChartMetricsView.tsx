"use client";

import React from "react";
import { BarChart3, DollarSign } from "lucide-react";
import type { LineChartMetricsViewProps } from "@/interfaces/charts";
import { useChartLogic } from "@/hooks/useChartLogic";
import { useTheme } from "@/hooks/useTheme";

export default function LineChartMetricsView({
  data,
}: LineChartMetricsViewProps) {
  const { chartColors } = useChartLogic();
  const { colors } = useTheme();

  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4 flex-shrink-0">
        {[
          {
            title: "Total Sales",
            value: data.reduce((sum, item) => sum + item.sales, 0),
            icon: DollarSign,
            color: chartColors.sales,
            trend: "+12.5%",
          },
          {
            title: "Total Revenue",
            value: data.reduce((sum, item) => sum + item.revenue, 0),
            icon: BarChart3,
            color: chartColors.revenue,
            trend: "+8.3%",
          },
          {
            title: "Total Profit",
            value: data.reduce((sum, item) => sum + item.profit, 0),
            icon: BarChart3,
            color: chartColors.profit,
            trend: "+15.2%",
          },
        ].map((metric, index) => (
          <div
            key={index}
            className="p-3 rounded-lg text-center relative overflow-hidden"
            style={{
              background: "var(--button-bg)",
              border: "1px solid var(--button-border)",
            }}
          >
            <div
              className="absolute top-0 right-0 w-12 h-12 rounded-bl-full opacity-5"
              style={{ background: metric.color }}
            />
            <div className="relative z-10">
              <metric.icon
                className="w-5 h-5 mx-auto mb-2"
                style={{ color: metric.color }}
              />
              <div className="text-sm font-medium secondary-text mb-1">
                {metric.title}
              </div>
              <div className="text-lg font-bold primary-text mb-1">
                ${(metric.value / 1000).toFixed(0)}k
              </div>
              <div
                className="text-xs font-bold"
                style={{
                  color: colors.accent.teal,
                  fontFamily: "var(--font-mono)",
                  fontWeight: 700,
                }}
              >
                {metric.trend}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide">
        <h4
          className="text-sm font-bold primary-text mb-3 flex items-center flex-shrink-0"
          style={{ fontFamily: "var(--font-mono)", fontWeight: 700 }}
        >
          <BarChart3
            className="w-4 h-4 mr-2"
            style={{ color: colors.accent.blue }}
          />
          Monthly Breakdown
        </h4>
        <div className="space-y-2">
          {data.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 rounded-lg hover:scale-[1.02] transition-transform duration-200"
              style={{
                background: "var(--button-bg)",
                border: "1px solid var(--button-border)",
              }}
            >
              <div className="min-w-0 flex-1">
                <div
                  className="text-sm font-bold primary-text truncate"
                  style={{ fontFamily: "var(--font-mono)", fontWeight: 700 }}
                >
                  {item.month}
                </div>
                <div className="text-xs secondary-text truncate">
                  Sales: ${(item.sales / 1000).toFixed(0)}k | Revenue: $
                  {(item.revenue / 1000).toFixed(0)}k
                </div>
              </div>
              <div className="text-right ml-3">
                <div
                  className="text-sm font-bold"
                  style={{
                    color:
                      item.profit > 0 ? colors.accent.teal : colors.accent.red,
                    fontFamily: "var(--font-mono)",
                    fontWeight: 700,
                  }}
                >
                  ${(item.profit / 1000).toFixed(0)}k
                </div>
                <div className="text-xs secondary-text">Profit</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
