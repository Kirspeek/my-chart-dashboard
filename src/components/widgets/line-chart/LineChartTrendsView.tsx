"use client";

import React from "react";
import { TrendingUp, Target } from "lucide-react";
import type { LineChartTrendsViewProps } from "@/interfaces/charts";
import { useChartLogic } from "@/hooks/useChartLogic";
import { useTheme } from "@/hooks/useTheme";

export default function LineChartTrendsView({
  metrics,
}: LineChartTrendsViewProps) {
  const { chartColors } = useChartLogic();
  const { colors } = useTheme();

  return (
    <div className="flex flex-col h-full min-h-0">
      <div
        className="p-4 rounded-lg mb-4 text-center flex-shrink-0"
        style={{
          background: "var(--button-bg)",
          border: "1px solid var(--button-border)",
        }}
      >
        <div
          className="text-2xl font-bold mb-1"
          style={{
            color: colors.accent.teal,
            fontFamily: "var(--font-mono)",
            fontWeight: 700,
          }}
        >
          {Math.round(
            (metrics.salesGrowth +
              metrics.revenueGrowth +
              metrics.profitGrowth) /
              3
          )}
          %
        </div>
        <div className="text-sm secondary-text mb-2">
          Overall Performance Score
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="h-2 rounded-full transition-all duration-300"
            style={{
              width: `${Math.min(Math.abs((metrics.salesGrowth + metrics.revenueGrowth + metrics.profitGrowth) / 3), 100)}%`,
              background: colors.accent.teal,
            }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 flex-1 min-h-0 overflow-y-auto">
        <div className="space-y-3">
          <h4
            className="text-sm font-bold primary-text flex items-center flex-shrink-0"
            style={{ fontFamily: "var(--font-mono)", fontWeight: 700 }}
          >
            <TrendingUp
              className="w-4 h-4 mr-2"
              style={{ color: colors.accent.blue }}
            />
            Performance Trends
          </h4>
          {[
            {
              label: "Sales Growth",
              value: metrics.salesGrowth,
              color: chartColors.sales,
            },
            {
              label: "Revenue Growth",
              value: metrics.revenueGrowth,
              color: chartColors.revenue,
            },
            {
              label: "Profit Margin",
              value:
                metrics.revenue > 0
                  ? (metrics.profit / metrics.revenue) * 100
                  : 0,
              color: chartColors.profit,
            },
          ].map((trend, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="secondary-text">{trend.label}</span>
                <span className="primary-text font-bold">
                  {trend.value.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.min(Math.abs(trend.value || 0), 100)}%`,
                    background:
                      (trend.value || 0) > 0
                        ? colors.accent.teal
                        : colors.accent.red,
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <h4
            className="text-sm font-bold primary-text flex items-center flex-shrink-0"
            style={{ fontFamily: "var(--font-mono)", fontWeight: 700 }}
          >
            <Target
              className="w-4 h-4 mr-2"
              style={{ color: colors.accent.blue }}
            />
            Key Insights
          </h4>
          <div className="space-y-2">
            {[
              metrics.salesGrowth > 0
                ? "Sales showing positive growth trend"
                : "Sales need attention",
              metrics.revenueGrowth > metrics.salesGrowth
                ? "Revenue outpacing sales growth"
                : "Revenue growth lagging",
              metrics.profit > 0
                ? "Profitable operations maintained"
                : "Profitability concerns",
            ].map((insight, index) => (
              <div
                key={index}
                className="flex items-start space-x-2 p-2 rounded-lg"
                style={{
                  background: "var(--button-bg)",
                  border: "1px solid var(--button-border)",
                }}
              >
                <div
                  className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                  style={{ background: colors.accent.blue }}
                />
                <span
                  className="text-sm secondary-text"
                  style={{ fontFamily: "var(--font-mono)", fontWeight: 700 }}
                >
                  {insight}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
