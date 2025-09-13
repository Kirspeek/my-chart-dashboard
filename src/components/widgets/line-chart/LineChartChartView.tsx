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
  Area,
  AreaChart as RechartsAreaChart,
  ComposedChart,
  Bar,
} from "recharts";
import {
  Activity,
  LineChart,
  PieChart,
  DollarSign,
  TrendingUp as TrendingUpIcon,
  BarChart3,
  Target,
} from "lucide-react";
import { useChartLogic } from "@/hooks/useChartLogic";
import { useTheme } from "@/hooks/useTheme";
import { useMobileDetection } from "@/components/common";
import {
  AnalyticsHeader,
  ToggleButtonGroup,
  SelectionBanner,
  MetricStatCard,
  InsightsPanel,
} from "@/components/common";
import type {
  LineChartChartViewProps,
  LineChartTooltipProps,
  LineChartTypeKey,
} from "@/interfaces/charts";

export default function LineChartChartView({
  data,
  metrics,
  animatedValues,
  currentChartType,
  setCurrentChartType,
  selectedMonth,
  setSelectedMonth,
  showInsights,
  setShowInsights,
}: LineChartChartViewProps) {
  const isMobile = useMobileDetection();
  const { chartColors, formatValue, axisStyle, gridStyle } = useChartLogic();
  const { colors, colorsTheme } = useTheme();
  const lineChartColors = colorsTheme.widgets.lineChart;

  const enhancedData = data.map((item, index) => {
    const prevItem = data[index - 1];
    const revenueGrowth = prevItem
      ? ((item.revenue - prevItem.revenue) / prevItem.revenue) * 100
      : 0;
    return { ...item, revenueGrowth };
  });

  const CustomTooltip = ({ active, payload, label }: LineChartTooltipProps) => {
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
  };

  const handleMouseMove = (e?: { activeLabel?: string }) => {
    if (e && e.activeLabel) setSelectedMonth(e.activeLabel);
  };

  const AxesGrid = () => (
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

  const renderChart = () => {
    const chartHeight = isMobile ? 220 : 280;
    switch (currentChartType) {
      case "line":
        return (
          <ResponsiveContainer width="100%" height={chartHeight}>
            <RechartsLineChart
              data={enhancedData}
              onMouseMove={handleMouseMove}
              onMouseLeave={() => setSelectedMonth(null)}
            >
              <defs>
                <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={chartColors.sales}
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor={chartColors.sales}
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient
                  id="revenueGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor={chartColors.revenue}
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor={chartColors.revenue}
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={chartColors.profit}
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor={chartColors.profit}
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <AxesGrid />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="sales"
                stroke={chartColors.sales}
                strokeWidth={3}
                name="Sales"
                dot={{
                  r: 5,
                  fill: chartColors.sales,
                  strokeWidth: 1,
                  stroke: "rgba(255, 255, 255, 0.2)",
                }}
                activeDot={{
                  r: 7,
                  fill: chartColors.sales,
                  strokeWidth: 1,
                  stroke: "rgba(255, 255, 255, 0.3)",
                }}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke={chartColors.revenue}
                strokeWidth={3}
                name="Revenue"
                dot={{
                  r: 5,
                  fill: chartColors.revenue,
                  strokeWidth: 1,
                  stroke: "rgba(255, 255, 255, 0.2)",
                }}
                activeDot={{
                  r: 7,
                  fill: chartColors.revenue,
                  strokeWidth: 1,
                  stroke: "rgba(255, 255, 255, 0.3)",
                }}
              />
              <Line
                type="monotone"
                dataKey="profit"
                stroke={chartColors.profit}
                strokeWidth={3}
                name="Profit"
                dot={{
                  r: 5,
                  fill: chartColors.profit,
                  strokeWidth: 1,
                  stroke: "rgba(255, 255, 255, 0.2)",
                }}
                activeDot={{
                  r: 7,
                  fill: chartColors.profit,
                  strokeWidth: 1,
                  stroke: "rgba(255, 255, 255, 0.3)",
                }}
              />
            </RechartsLineChart>
          </ResponsiveContainer>
        );
      case "area":
        return (
          <ResponsiveContainer width="100%" height={chartHeight}>
            <RechartsAreaChart
              data={enhancedData}
              onMouseMove={handleMouseMove}
              onMouseLeave={() => setSelectedMonth(null)}
            >
              <defs>
                <linearGradient
                  id="salesAreaGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor={chartColors.sales}
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor={chartColors.sales}
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient
                  id="revenueAreaGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor={chartColors.revenue}
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor={chartColors.revenue}
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient
                  id="profitAreaGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor={chartColors.profit}
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor={chartColors.profit}
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <AxesGrid />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="sales"
                stroke={chartColors.sales}
                fill="url(#salesAreaGradient)"
                strokeWidth={2}
                name="Sales"
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke={chartColors.revenue}
                fill="url(#revenueAreaGradient)"
                strokeWidth={2}
                name="Revenue"
              />
              <Area
                type="monotone"
                dataKey="profit"
                stroke={chartColors.profit}
                fill="url(#profitAreaGradient)"
                strokeWidth={2}
                name="Profit"
              />
            </RechartsAreaChart>
          </ResponsiveContainer>
        );
      case "composed":
        return (
          <ResponsiveContainer width="100%" height={chartHeight}>
            <ComposedChart
              data={enhancedData}
              onMouseMove={handleMouseMove}
              onMouseLeave={() => setSelectedMonth(null)}
            >
              <defs>
                <linearGradient
                  id="revenueComposedGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor={chartColors.revenue}
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor={chartColors.revenue}
                    stopOpacity={0.3}
                  />
                </linearGradient>
              </defs>
              <AxesGrid />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="revenue"
                fill="url(#revenueComposedGradient)"
                radius={[4, 4, 0, 0]}
                stroke={chartColors.revenue}
                strokeWidth={1}
              />
              <Line
                type="monotone"
                dataKey="sales"
                stroke={chartColors.sales}
                strokeWidth={3}
                name="Sales"
                dot={{
                  r: 4,
                  fill: chartColors.sales,
                  strokeWidth: 1,
                  stroke: "rgba(255, 255, 255, 0.2)",
                }}
              />
              <Line
                type="monotone"
                dataKey="profit"
                stroke={chartColors.profit}
                strokeWidth={3}
                name="Profit"
                dot={{
                  r: 4,
                  fill: chartColors.profit,
                  strokeWidth: 1,
                  stroke: "rgba(255, 255, 255, 0.2)",
                }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full min-h-0">
      <AnalyticsHeader
        leftTitle="Performance Overview"
        leftSubtitle="Last 12 months analysis"
        rightValue={`$${(animatedValues.revenue / 1000).toFixed(0)}k`}
        rightValueLabel="Total Revenue"
      />

      <ToggleButtonGroup
        options={[
          { key: "line", icon: LineChart, label: "Lines" },
          { key: "area", icon: Activity, label: "Area" },
          { key: "composed", icon: PieChart, label: "Mixed" },
        ]}
        selectedKey={currentChartType}
        onChange={(key: string) => setCurrentChartType(key as LineChartTypeKey)}
      />

      <div className="flex-1 min-h-0 mb-3">{renderChart()}</div>

      {selectedMonth && (
        <SelectionBanner
          label="Selected"
          value={selectedMonth}
          onClear={() => setSelectedMonth(null)}
        />
      )}

      <div className="grid grid-cols-2 gap-1.5 flex-shrink-0">
        {[
          {
            icon: DollarSign,
            label: "Sales",
            value: `$${(animatedValues.sales / 1000).toFixed(0)}k`,
            growth: metrics.salesGrowth,
            color: chartColors.sales,
            subtitle: "Total Sales",
            badge: "Core Metric",
            progress: Math.abs(metrics.salesGrowth),
          },
          {
            icon: TrendingUpIcon,
            label: "Revenue",
            value: `$${(animatedValues.revenue / 1000).toFixed(0)}k`,
            growth: metrics.revenueGrowth,
            color: chartColors.revenue,
            subtitle: "Total Revenue",
            badge: "Top Performer",
            progress: Math.abs(metrics.revenueGrowth),
          },
          {
            icon: BarChart3,
            label: "Profit",
            value: `$${(animatedValues.profit / 1000).toFixed(0)}k`,
            growth: metrics.profitGrowth,
            color: chartColors.profit,
            subtitle: "Net Profit",
            badge: "Key Indicator",
            progress: Math.abs(metrics.profitGrowth),
          },
          {
            icon: Target,
            label: "Growth",
            value: `${animatedValues.growth.toFixed(1)}%`,
            growth: animatedValues.growth,
            color: colors.accent.teal,
            subtitle: "Avg Growth",
            badge: "Trending",
            progress: Math.abs(animatedValues.growth),
          },
        ].map((item, index) => (
          <MetricStatCard key={index} {...item} />
        ))}
      </div>

      <InsightsPanel
        title="Performance Summary"
        show={showInsights}
        onToggle={() => setShowInsights(!showInsights)}
      >
        <div className="grid grid-cols-3 gap-2 mb-2">
          <div
            className="text-center p-1.5 rounded-lg"
            style={{ background: colors.accent.teal + "10" }}
          >
            <div
              className="text-sm font-bold"
              style={{
                color: colors.accent.teal,
                fontFamily: "var(--font-mono)",
                fontWeight: 700,
              }}
            >
              {data.length}
            </div>
            <div className="text-xs secondary-text">Months</div>
          </div>
          <div
            className="text-center p-1.5 rounded-lg"
            style={{ background: colors.accent.blue + "10" }}
          >
            <div
              className="text-sm font-bold"
              style={{
                color: colors.accent.blue,
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
            </div>
            <div className="text-xs secondary-text">Avg %</div>
          </div>
          <div
            className="text-center p-1.5 rounded-lg"
            style={{ background: colors.accent.red + "10" }}
          >
            <div
              className="text-sm font-bold"
              style={{
                color: colors.accent.red,
                fontFamily: "var(--font-mono)",
                fontWeight: 700,
              }}
            >
              {data.filter((item) => item.profit > 0).length}
            </div>
            <div className="text-xs secondary-text">Profitable</div>
          </div>
        </div>

        <div
          className="space-y-2 pt-2 border-t"
          style={{ borderColor: "var(--button-border)" }}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs secondary-text">Best Month:</span>
            <span className="text-xs font-bold primary-text">
              {data.length
                ? data.reduce(
                    (max, item) => (item.revenue > max.revenue ? item : max),
                    data[0]
                  ).month
                : "—"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs secondary-text">Growth Trend:</span>
            <span
              className={`text-xs font-bold ${metrics.revenueGrowth > 0 ? "text-green-600" : "text-red-600"}`}
            >
              {metrics.revenueGrowth > 0 ? "Positive" : "Negative"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs secondary-text">Recommendation:</span>
            <span className="text-xs font-bold primary-text">
              {metrics.revenueGrowth > 0 ? "Maintain" : "Improve"}
            </span>
          </div>
        </div>
      </InsightsPanel>
    </div>
  );
}
