"use client";

import React from "react";
import {
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { useTheme } from "@/hooks/useTheme";
import { useChartLogic } from "@/hooks/useChartLogic";
import type { WidgetRadarChartData } from "@/interfaces/widgets";

export default function RadarView({
  currentMetrics,
  isMobile,
}: {
  currentMetrics: WidgetRadarChartData[];
  isMobile: boolean;
}) {
  const { colors } = useTheme();
  const { tooltipStyle } = useChartLogic();

  const comparisonData = currentMetrics.map((metric) => {
    let currentValue: number;
    switch (metric.subject) {
      case "CPU Utilization":
        currentValue = Math.max(
          0,
          Math.min(100, metric.value + 12 + (Math.random() - 0.5) * 15)
        );
        break;
      case "Memory Usage":
        currentValue = Math.max(
          0,
          Math.min(100, metric.value - 8 + (Math.random() - 0.5) * 12)
        );
        break;
      case "Network Latency":
        currentValue = Math.max(
          0,
          Math.min(100, metric.value + 15 + (Math.random() - 0.5) * 18)
        );
        break;
      case "Disk I/O":
        currentValue = Math.max(
          0,
          Math.min(100, metric.value - 5 + (Math.random() - 0.5) * 10)
        );
        break;
      case "Response Time":
        currentValue = Math.max(
          0,
          Math.min(100, metric.value + 20 + (Math.random() - 0.5) * 25)
        );
        break;
      case "Error Rate":
        currentValue = Math.max(
          0,
          Math.min(100, metric.value - 12 + (Math.random() - 0.5) * 16)
        );
        break;
      case "Throughput":
        currentValue = Math.max(
          0,
          Math.min(100, metric.value + 18 + (Math.random() - 0.5) * 20)
        );
        break;
      case "Availability":
        currentValue = Math.max(
          0,
          Math.min(100, metric.value + 3 + (Math.random() - 0.5) * 8)
        );
        break;
      default:
        currentValue = Math.max(
          0,
          Math.min(100, metric.value + (Math.random() - 0.5) * 20)
        );
    }

    let previousValue: number;
    switch (metric.subject) {
      case "CPU Utilization":
        previousValue = Math.max(
          0,
          Math.min(100, currentValue - 25 + (Math.random() - 0.5) * 20)
        );
        break;
      case "Memory Usage":
        previousValue = Math.max(
          0,
          Math.min(100, currentValue + 18 + (Math.random() - 0.5) * 15)
        );
        break;
      case "Network Latency":
        previousValue = Math.max(
          0,
          Math.min(100, currentValue - 35 + (Math.random() - 0.5) * 25)
        );
        break;
      case "Disk I/O":
        previousValue = Math.max(
          0,
          Math.min(100, currentValue + 22 + (Math.random() - 0.5) * 18)
        );
        break;
      case "Response Time":
        previousValue = Math.max(
          0,
          Math.min(100, currentValue - 40 + (Math.random() - 0.5) * 30)
        );
        break;
      case "Error Rate":
        previousValue = Math.max(
          0,
          Math.min(100, currentValue + 30 + (Math.random() - 0.5) * 20)
        );
        break;
      case "Throughput":
        previousValue = Math.max(
          0,
          Math.min(100, currentValue - 20 + (Math.random() - 0.5) * 25)
        );
        break;
      case "Availability":
        previousValue = Math.max(
          0,
          Math.min(100, currentValue - 8 + (Math.random() - 0.5) * 10)
        );
        break;
      default:
        previousValue = Math.max(
          0,
          Math.min(100, currentValue + (Math.random() - 0.5) * 40)
        );
    }

    return {
      subject: metric.subject,
      current: Math.round(currentValue),
      previous: Math.round(previousValue),
      fullMark: 100,
    };
  });

  return (
    <div className="flex flex-col items-center justify-center flex-1">
      <ResponsiveContainer width="100%" height={isMobile ? "100%" : 300}>
        <RechartsRadarChart
          data={comparisonData}
          outerRadius={isMobile ? "50%" : "80%"}
        >
          <PolarGrid stroke={colors.borderSecondary} />
          <PolarAngleAxis
            dataKey="subject"
            tick={{
              fill: colors.primary,
              fontSize: isMobile ? 8 : 12,
              fontFamily: "var(--font-mono)",
              fontWeight: 700,
            }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={{
              fill: colors.secondary,
              fontSize: isMobile ? 8 : 10,
              fontFamily: "var(--font-mono)",
              fontWeight: 700,
            }}
          />
          <Radar
            name="Current"
            dataKey="current"
            stroke={colors.accent.blue}
            fill={colors.accent.blue}
            fillOpacity={0.3}
            strokeWidth={isMobile ? 2 : 3}
          />
          <Radar
            name="Previous"
            dataKey="previous"
            stroke={colors.accent.red}
            fill={colors.accent.red}
            fillOpacity={0.1}
            strokeWidth={isMobile ? 1 : 2}
            strokeDasharray="5 5"
          />
          <Tooltip
            contentStyle={tooltipStyle}
            formatter={(value, name, props) => {
              const currentValue = (props as any).payload.current as number;
              const previousValue = (props as any).payload.previous as number;
              const change = currentValue - previousValue;
              const changePercent =
                previousValue > 0 ? (change / previousValue) * 100 : 0;
              return [
                <div key="current">
                  <span style={{ color: colors.accent.blue }}>
                    Current: {currentValue}%
                  </span>
                </div>,
                <div key="previous">
                  <span style={{ color: colors.accent.red }}>
                    Previous: {previousValue}%
                  </span>
                </div>,
                <div key="change">
                  <span
                    style={{
                      color:
                        change > 0 ? colors.accent.teal : colors.accent.red,
                    }}
                  >
                    Change: {change > 0 ? "+" : ""}
                    {change.toFixed(1)}% ({changePercent > 0 ? "+" : ""}
                    {changePercent.toFixed(1)}%)
                  </span>
                </div>,
              ];
            }}
          />
        </RechartsRadarChart>
      </ResponsiveContainer>
    </div>
  );
}
