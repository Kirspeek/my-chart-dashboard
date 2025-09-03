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
  LineChart as RechartsLineChart,
  Line,
  AreaChart as RechartsAreaChart,
  Area,
  ComposedChart,
} from "recharts";
import {
  Activity,
  PieChart,
  LineChart,
  BarChart3,
  DollarSign,
  Target,
  Calendar,
} from "lucide-react";
import type {
  BarChartChartViewProps,
  BarChartTooltipProps,
  BarChartTypeKey,
} from "@/interfaces/charts";
import { useChartLogic } from "@/hooks/useChartLogic";
import { useTheme } from "@/hooks/useTheme";
import {
  AnalyticsHeader,
  ToggleButtonGroup,
  SelectionBanner,
  MetricStatCard,
  InsightsPanel,
} from "@/components/common";

export default function BarChartChartView({
  data,
  metrics,
  animatedValues,
  currentChartType,
  setCurrentChartType,
  selectedQuarter,
  setSelectedQuarter,
  showInsights,
  setShowInsights,
}: BarChartChartViewProps) {
  const { chartColors, formatValue, axisStyle, gridStyle } = useChartLogic();
  const { colors, colorsTheme } = useTheme();
  const barChartColors = colorsTheme.widgets.barChart;

  const [hoveredQuarter, setHoveredQuarter] = React.useState<string | null>(
    null
  );
  const isMobile =
    typeof window !== "undefined" ? window.innerWidth <= 425 : false;

  const enhancedData = data.map((item, index) => {
    const prevItem = data[index - 1];
    const revenueGrowth = prevItem
      ? ((item.revenue - prevItem.revenue) / prevItem.revenue) * 100
      : 0;
    const salesGrowth = prevItem
      ? ((item.sales - prevItem.sales) / prevItem.sales) * 100
      : 0;
    return {
      ...item,
      revenueGrowth,
      salesGrowth,
      isSelected: selectedQuarter === item.name,
      isHovered: hoveredQuarter === item.name,
    };
  });

  const CustomTooltip = ({ active, payload, label }: BarChartTooltipProps) => {
    if (active && payload && payload.length) {
      const revenue = payload.find((p) => p.dataKey === "revenue")?.value || 0;
      const sales = payload.find((p) => p.dataKey === "sales")?.value || 0;
      const revenueGrowth =
        enhancedData.find((d) => d.name === label)?.revenueGrowth || 0;
      const salesGrowth =
        enhancedData.find((d) => d.name === label)?.salesGrowth || 0;
      return (
        <div
          className="p-3 rounded-lg shadow-lg border-0"
          style={{
            background: barChartColors.tooltip.background,
            backdropFilter: "blur(10px)",
            border: `1px solid ${barChartColors.tooltip.border}`,
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
              <span className="text-sm">Revenue:</span>
              <span className="font-bold text-sm">
                ${(revenue / 1000).toFixed(1)}k
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Sales:</span>
              <span className="font-bold text-sm">
                {sales.toLocaleString()}
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
            <div className="flex justify-between items-center">
              <span className="text-sm">Sales Growth:</span>
              <span
                className={`font-bold text-sm ${salesGrowth > 0 ? "text-green-600" : salesGrowth < 0 ? "text-red-600" : "text-gray-600"}`}
              >
                {salesGrowth > 0 ? "+" : ""}
                {salesGrowth.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const handleMouseMove = (e?: { activeLabel?: string }) => {
    if (e && e.activeLabel) setHoveredQuarter(e.activeLabel);
  };

  const chartHeight = isMobile ? 200 : 250;

  const renderChart = () => {
    switch (currentChartType) {
      case "bars":
        return (
          <ResponsiveContainer width="100%" height={chartHeight}>
            <RechartsBarChart
              data={enhancedData}
              onMouseMove={handleMouseMove}
              onMouseLeave={() => setHoveredQuarter(null)}
            >
              <defs>
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
                    stopOpacity={0.3}
                  />
                </linearGradient>
                <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={chartColors.sales}
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor={chartColors.sales}
                    stopOpacity={0.3}
                  />
                </linearGradient>
                <linearGradient
                  id="selectedGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor={colors.accent.blue}
                    stopOpacity={0.9}
                  />
                  <stop
                    offset="95%"
                    stopColor={colors.accent.blue}
                    stopOpacity={0.4}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={gridStyle.stroke}
                opacity={0.3}
              />
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
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{
                  fontFamily: "var(--font-mono)",
                  fontWeight: 700,
                  fontSize: 12,
                }}
              />
              <Bar
                dataKey="revenue"
                fill={
                  selectedQuarter
                    ? "url(#selectedGradient)"
                    : "url(#revenueGradient)"
                }
                radius={[6, 6, 0, 0]}
                stroke={chartColors.revenue}
                strokeWidth={2}
                onClick={(d: { name?: string }) =>
                  setSelectedQuarter(d.name || null)
                }
                style={{ cursor: "pointer" }}
              />
              <Bar
                dataKey="sales"
                fill={
                  selectedQuarter
                    ? "url(#selectedGradient)"
                    : "url(#salesGradient)"
                }
                radius={[6, 6, 0, 0]}
                stroke={chartColors.sales}
                strokeWidth={2}
                onClick={(d: { name?: string }) =>
                  setSelectedQuarter(d.name || null)
                }
                style={{ cursor: "pointer" }}
              />
            </RechartsBarChart>
          </ResponsiveContainer>
        );
      case "lines":
        return (
          <ResponsiveContainer width="100%" height={chartHeight}>
            <RechartsLineChart
              data={enhancedData}
              onMouseMove={handleMouseMove}
              onMouseLeave={() => setHoveredQuarter(null)}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={gridStyle.stroke}
                opacity={0.3}
              />
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
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{
                  fontFamily: "var(--font-mono)",
                  fontWeight: 700,
                  fontSize: 12,
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
                  strokeWidth: 2,
                  stroke: barChartColors.chart.dotStroke,
                }}
                activeDot={{
                  r: 7,
                  fill: chartColors.revenue,
                  strokeWidth: 2,
                  stroke: barChartColors.chart.dotStroke,
                }}
              />
              <Line
                type="monotone"
                dataKey="sales"
                stroke={chartColors.sales}
                strokeWidth={3}
                name="Sales"
                dot={{
                  r: 5,
                  fill: chartColors.sales,
                  strokeWidth: 2,
                  stroke: barChartColors.chart.dotStroke,
                }}
                activeDot={{
                  r: 7,
                  fill: chartColors.sales,
                  strokeWidth: 2,
                  stroke: barChartColors.chart.dotStroke,
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
              onMouseLeave={() => setHoveredQuarter(null)}
            >
              <defs>
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
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={gridStyle.stroke}
                opacity={0.3}
              />
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
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{
                  fontFamily: "var(--font-mono)",
                  fontWeight: 700,
                  fontSize: 12,
                }}
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
                dataKey="sales"
                stroke={chartColors.sales}
                fill="url(#salesAreaGradient)"
                strokeWidth={2}
                name="Sales"
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
              onMouseLeave={() => setHoveredQuarter(null)}
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
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={gridStyle.stroke}
                opacity={0.3}
              />
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
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{
                  fontFamily: "var(--font-mono)",
                  fontWeight: 700,
                  fontSize: 12,
                }}
              />
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
                  strokeWidth: 2,
                  stroke: barChartColors.chart.dotStroke,
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
        leftTitle="Quarterly Performance"
        leftSubtitle="Revenue & Sales Analysis"
        rightValue={`$${(animatedValues.totalRevenue / 1000).toFixed(0)}k`}
        rightValueLabel="Total Revenue"
      />

      {selectedQuarter && (
        <SelectionBanner
          label="Selected"
          value={selectedQuarter}
          onClear={() => setSelectedQuarter(null)}
        />
      )}

      <ToggleButtonGroup
        options={[
          { key: "bars", icon: BarChart3, label: "Bars" },
          { key: "lines", icon: LineChart, label: "Lines" },
          { key: "area", icon: Activity, label: "Area" },
          { key: "composed", icon: PieChart, label: "Mixed" },
        ]}
        selectedKey={currentChartType}
        onChange={(key) => setCurrentChartType(key as BarChartTypeKey)}
        size="md"
      />

      <div className="flex-1 min-h-0 mb-4">{renderChart()}</div>

      <div className="grid grid-cols-2 gap-2 flex-shrink-0">
        {[
          {
            icon: DollarSign,
            label: "Total Revenue",
            value: `$${(animatedValues.totalRevenue / 1000).toFixed(0)}k`,
            growth: animatedValues.growth,
            color: chartColors.revenue,
            subtitle: "Annual Revenue",
            badge: "Top Performer",
          },
          {
            icon: Target,
            label: "Total Sales",
            value: `$${(animatedValues.totalSales / 1000).toFixed(0)}k`,
            growth: 0,
            color: chartColors.sales,
            subtitle: "Annual Sales",
            badge: "Growing",
          },
          {
            icon: BarChart3,
            label: "Avg Revenue",
            value: `$${(animatedValues.avgRevenue / 1000).toFixed(0)}k`,
            growth: 0,
            color: colors.accent.teal,
            subtitle: "Per Quarter",
            badge: "Stable",
          },
          {
            icon: Calendar,
            label: "Growth Rate",
            value: `${animatedValues.growth.toFixed(1)}%`,
            growth: animatedValues.growth,
            color: colors.accent.blue,
            subtitle: "Q1 to Q4",
            badge: "Trending",
          },
        ].map((item, index) => (
          <MetricStatCard key={index} {...item} />
        ))}
      </div>

      <InsightsPanel
        title="Key Insights"
        show={showInsights}
        onToggle={() => setShowInsights(!showInsights)}
      >
        <div className="text-xs secondary-text">
          💡 <strong>Best Quarter:</strong> Q3 with $
          {(Math.max(...data.map((d) => d.revenue)) / 1000).toFixed(0)}k revenue
        </div>
        <div className="text-xs secondary-text">
          📈 <strong>Growth Trend:</strong>{" "}
          {metrics.growth > 0 ? "Positive" : "Negative"} year-over-year growth
        </div>
        <div className="text-xs secondary-text">
          🎯 <strong>Recommendation:</strong> Focus on Q3 strategies for Q4
          optimization
        </div>
      </InsightsPanel>
    </div>
  );
}
