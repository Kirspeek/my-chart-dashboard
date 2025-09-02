"use client";

import React, { useState, useEffect } from "react";
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
  TrendingUp,
  TrendingDown,
  Minus,
  DollarSign,
  TrendingUp as TrendingUpIcon,
  BarChart3,
  Target,
  Activity,
  Sparkles,
  Eye,
  MousePointer,
  LineChart,
  PieChart,
} from "lucide-react";
import type { WidgetLineChartData } from "@/interfaces/widgets";
import { useChartLogic } from "@/hooks/useChartLogic";
import { useTheme } from "@/hooks/useTheme";

interface LineChartContainerProps {
  data: WidgetLineChartData[];
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    dataKey: string;
    value: number;
  }>;
  label?: string;
}

export default function LineChartContainer({ data }: LineChartContainerProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [currentView, setCurrentView] = useState<
    "chart" | "metrics" | "trends"
  >("chart");
  const [currentChartType, setCurrentChartType] = useState<
    "line" | "area" | "composed"
  >("line");
  const [isRealTime] = useState(true);
  const [animatedValues, setAnimatedValues] = useState({
    sales: 0,
    revenue: 0,
    profit: 0,
    growth: 0,
  });
  const [showInsights, setShowInsights] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);

  const { chartColors, formatValue, axisStyle, gridStyle } = useChartLogic();
  const { colors, colorsTheme } = useTheme();
  const lineChartColors = colorsTheme.widgets.lineChart;

  useEffect(() => {
    const check = () => {
      if (typeof window !== "undefined") {
        setIsMobile(window.innerWidth <= 425);
      }
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Animated counter effect
  useEffect(() => {
    const metrics = calculateMetrics();
    const duration = 2000; // 2 seconds
    const steps = 60;
    const stepDuration = duration / steps;

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;

      setAnimatedValues({
        sales: Math.floor(metrics.sales * progress),
        revenue: Math.floor(metrics.revenue * progress),
        profit: Math.floor(metrics.profit * progress),
        growth: metrics.revenueGrowth * progress,
      });

      if (currentStep >= steps) {
        clearInterval(interval);
      }
    }, stepDuration);

    return () => clearInterval(interval);
  }, [data]);

  // Simulate real-time data updates
  useEffect(() => {
    if (!isRealTime) return;

    const interval = setInterval(() => {
      // This would update the data in a real application
    }, 5000);

    return () => clearInterval(interval);
  }, [isRealTime]);

  const getTrendIcon = (trend: "up" | "down" | "stable") => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-3 h-3 text-green-500" />;
      case "down":
        return <TrendingDown className="w-3 h-3 text-red-500" />;
      default:
        return <Minus className="w-3 h-3 text-gray-500" />;
    }
  };

  const calculateMetrics = () => {
    if (!data.length)
      return {
        sales: 0,
        revenue: 0,
        profit: 0,
        salesGrowth: 0,
        revenueGrowth: 0,
        profitGrowth: 0,
      };

    const latest = data[data.length - 1];
    const previous = data[data.length - 2] || latest;

    const salesGrowth =
      previous.sales > 0
        ? ((latest.sales - previous.sales) / previous.sales) * 100
        : 0;
    const revenueGrowth =
      previous.revenue > 0
        ? ((latest.revenue - previous.revenue) / previous.revenue) * 100
        : 0;
    const profitGrowth =
      previous.profit > 0
        ? ((latest.profit - previous.profit) / previous.profit) * 100
        : 0;

    return {
      sales: latest.sales,
      revenue: latest.revenue,
      profit: latest.profit,
      salesGrowth,
      revenueGrowth,
      profitGrowth,
    };
  };

  const metrics = calculateMetrics();

  // Enhanced data with trends and performance indicators
  const enhancedData = data.map((item, index) => {
    const prevItem = data[index - 1];
    const revenueGrowth = prevItem
      ? ((item.revenue - prevItem.revenue) / prevItem.revenue) * 100
      : 0;

    return {
      ...item,
      revenueGrowth,
      trend: revenueGrowth > 0 ? "up" : revenueGrowth < 0 ? "down" : "stable",
      isSelected: selectedMonth === item.month,
      performance:
        revenueGrowth > 5
          ? "excellent"
          : revenueGrowth > 0
            ? "good"
            : "needs_attention",
    };
  });

  // Custom tooltip with enhanced insights
  const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
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

  const renderChart = () => {
    const chartHeight = isMobile ? 220 : 280;

    switch (currentChartType) {
      case "line":
        return (
          <ResponsiveContainer width="100%" height={chartHeight}>
            <RechartsLineChart
              data={enhancedData}
              onMouseMove={(data) => {
                if (data && data.activeLabel) {
                  setSelectedMonth(data.activeLabel);
                }
              }}
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
                  strokeWidth: 2,
                  stroke: lineChartColors.chart.dotStroke,
                }}
                activeDot={{
                  r: 7,
                  fill: chartColors.sales,
                  strokeWidth: 2,
                  stroke: lineChartColors.chart.dotStroke,
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
                  stroke: lineChartColors.chart.dotStroke,
                }}
                activeDot={{
                  r: 7,
                  fill: chartColors.revenue,
                  strokeWidth: 2,
                  stroke: lineChartColors.chart.dotStroke,
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
                  strokeWidth: 2,
                  stroke: lineChartColors.chart.dotStroke,
                }}
                activeDot={{
                  r: 7,
                  fill: chartColors.profit,
                  strokeWidth: 2,
                  stroke: lineChartColors.chart.dotStroke,
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
              onMouseMove={(data) => {
                if (data && data.activeLabel) {
                  setSelectedMonth(data.activeLabel);
                }
              }}
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
              onMouseMove={(data) => {
                if (data && data.activeLabel) {
                  setSelectedMonth(data.activeLabel);
                }
              }}
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
                  strokeWidth: 2,
                  stroke: lineChartColors.chart.dotStroke,
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
                  strokeWidth: 2,
                  stroke: lineChartColors.chart.dotStroke,
                }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  const renderChartView = () => (
    <div className="flex flex-col h-full min-h-0">
      {/* Enhanced Header with Animated Background */}
      <div
        className="flex items-center justify-between mb-3 p-3 rounded-lg flex-shrink-0 relative overflow-hidden"
        style={{
          background: "var(--button-bg)",
          border: "1px solid var(--button-border)",
        }}
      >
        {/* Animated background effect */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-20 h-20 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 animate-pulse" />
          <div
            className="absolute bottom-0 right-0 w-16 h-16 rounded-full bg-gradient-to-r from-green-400 to-blue-500 animate-pulse"
            style={{ animationDelay: "1s" }}
          />
        </div>

        <div className="relative z-10">
          <div
            className="text-sm font-bold primary-text flex items-center"
            style={{ fontFamily: "var(--font-mono)", fontWeight: 700 }}
          >
            <Sparkles
              className="w-4 h-4 mr-2"
              style={{ color: colors.accent.blue }}
            />
            Performance Overview
          </div>
          <div className="text-xs secondary-text">Last 12 months analysis</div>
        </div>
        <div className="text-right relative z-10">
          <div
            className="text-lg font-bold"
            style={{
              color: colors.accent.teal,
              fontFamily: "var(--font-mono)",
              fontWeight: 700,
            }}
          >
            ${(animatedValues.revenue / 1000).toFixed(0)}k
          </div>
          <div className="text-xs secondary-text">Total Revenue</div>
        </div>
      </div>

      {/* Chart Type Navigation */}
      <div className="flex items-center justify-center space-x-1 mb-3 flex-shrink-0">
        {[
          { key: "line", icon: LineChart, label: "Lines" },
          { key: "area", icon: Activity, label: "Area" },
          { key: "composed", icon: PieChart, label: "Mixed" },
        ].map(({ key, icon: Icon, label }) => (
          <button
            key={key}
            onClick={() =>
              setCurrentChartType(key as "line" | "area" | "composed")
            }
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 ${
              currentChartType === key ? "scale-105" : ""
            }`}
            style={{
              background:
                currentChartType === key
                  ? colors.accent.blue + "20"
                  : "var(--button-bg)",
              border: `1px solid ${currentChartType === key ? colors.accent.blue : "var(--button-border)"}`,
              color:
                currentChartType === key
                  ? colors.accent.blue
                  : colors.secondary,
              fontFamily: "var(--font-mono)",
              fontWeight: 700,
            }}
          >
            <Icon className="w-4 h-4" />
            {!isMobile && <span>{label}</span>}
          </button>
        ))}
      </div>

      {/* Enhanced Chart with Better Space Utilization */}
      <div className="flex-1 min-h-0 mb-3">{renderChart()}</div>

      {/* Performance Indicators */}
      {selectedMonth && (
        <div
          className="mb-3 p-2 rounded-lg flex-shrink-0"
          style={{
            background: "var(--button-bg)",
            border: "1px solid var(--button-border)",
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <MousePointer
                className="w-4 h-4 mr-2"
                style={{ color: colors.accent.blue }}
              />
              <span className="text-sm font-bold primary-text">
                Selected: {selectedMonth}
              </span>
            </div>
            <button
              onClick={() => setSelectedMonth(null)}
              className="text-xs px-2 py-1 rounded-full"
              style={{
                background: colors.accent.red + "20",
                color: colors.accent.red,
                fontFamily: "var(--font-mono)",
                fontWeight: 700,
              }}
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Enhanced Metric Cards with Different Layout - 2x2 Grid Design */}
      <div className="grid grid-cols-2 gap-1.5 flex-shrink-0">
        {[
          {
            icon: DollarSign,
            label: "Sales",
            value: animatedValues.sales,
            growth: metrics.salesGrowth,
            color: chartColors.sales,
            subtitle: "Total Sales",
            badge: "Core Metric",
            progress: Math.abs(metrics.salesGrowth),
          },
          {
            icon: TrendingUpIcon,
            label: "Revenue",
            value: animatedValues.revenue,
            growth: metrics.revenueGrowth,
            color: chartColors.revenue,
            subtitle: "Total Revenue",
            badge: "Top Performer",
            progress: Math.abs(metrics.revenueGrowth),
          },
          {
            icon: BarChart3,
            label: "Profit",
            value: animatedValues.profit,
            growth: metrics.profitGrowth,
            color: chartColors.profit,
            subtitle: "Net Profit",
            badge: "Key Indicator",
            progress: Math.abs(metrics.profitGrowth),
          },
          {
            icon: Target,
            label: "Growth",
            value: animatedValues.growth.toFixed(1) + "%",
            growth: animatedValues.growth,
            color: colors.accent.teal,
            subtitle: "Avg Growth",
            badge: "Trending",
            progress: Math.abs(animatedValues.growth),
          },
        ].map((item, index) => (
          <div
            key={index}
            className="p-2 rounded-lg relative overflow-hidden group hover:scale-[1.01] transition-all duration-300 min-h-[70px]"
            style={{
              background: "var(--button-bg)",
              border: "1px solid var(--button-border)",
            }}
          >
            {/* Animated background accent */}
            <div
              className="absolute top-0 left-0 w-full h-0.5 opacity-20 group-hover:opacity-40 transition-opacity duration-300"
              style={{ background: item.color }}
            />

            <div className="relative z-10 h-full flex flex-col justify-between">
              {/* Header Row */}
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center space-x-1.5">
                  <item.icon
                    className="w-3 h-3"
                    style={{ color: item.color }}
                  />
                  <div>
                    <div
                      className="text-xs font-bold primary-text"
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontWeight: 700,
                      }}
                    >
                      {item.label}
                    </div>
                    <div className="text-xs secondary-text">
                      {item.subtitle}
                    </div>
                  </div>
                </div>
                <div
                  className={`text-xs px-1.5 py-0.5 rounded-full ${
                    item.growth > 0
                      ? "bg-green-100 text-green-800"
                      : item.growth < 0
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
                  }`}
                  style={{ fontFamily: "var(--font-mono)", fontWeight: 700 }}
                >
                  {item.growth > 0 ? "+" : ""}
                  {item.growth.toFixed(1)}%
                </div>
              </div>

              {/* Value */}
              <div
                className="text-sm font-bold primary-text mb-1"
                style={{ fontFamily: "var(--font-mono)", fontWeight: 700 }}
              >
                {typeof item.value === "number"
                  ? `$${(item.value / 1000).toFixed(0)}k`
                  : item.value}
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-1 mb-1">
                <div
                  className="h-1 rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(item.progress, 100)}%`,
                    background:
                      item.growth > 0
                        ? colors.accent.teal
                        : item.growth < 0
                          ? colors.accent.red
                          : colors.secondary,
                  }}
                />
              </div>

              {/* Footer Row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {getTrendIcon(
                    item.growth > 0 ? "up" : item.growth < 0 ? "down" : "stable"
                  )}
                  <span
                    className="text-xs ml-1"
                    style={{
                      color:
                        item.growth > 0
                          ? colors.accent.teal
                          : item.growth < 0
                            ? colors.accent.red
                            : colors.secondary,
                      fontFamily: "var(--font-mono)",
                      fontWeight: 700,
                    }}
                  >
                    {item.growth > 0
                      ? "Improving"
                      : item.growth < 0
                        ? "Declining"
                        : "Stable"}
                  </span>
                </div>
                <div
                  className="text-xs px-1.5 py-0.5 rounded-full"
                  style={{
                    background: item.color + "15",
                    color: item.color,
                    fontFamily: "var(--font-mono)",
                    fontWeight: 700,
                    fontSize: "0.6rem",
                  }}
                >
                  {item.badge}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Performance Summary Panel */}
      <div
        className="mt-2 p-3 rounded-lg flex-shrink-0"
        style={{
          background: "var(--button-bg)",
          border: "1px solid var(--button-border)",
        }}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <Eye
              className="w-3 h-3 mr-1.5"
              style={{ color: colors.accent.blue }}
            />
            <span className="text-xs font-bold primary-text">
              Performance Summary
            </span>
          </div>
          <button
            onClick={() => setShowInsights(!showInsights)}
            className="text-xs px-2 py-1 rounded-full transition-all duration-200 hover:scale-105"
            style={{
              background: showInsights
                ? colors.accent.blue + "20"
                : "var(--button-bg)",
              color: showInsights ? colors.accent.blue : colors.secondary,
              fontFamily: "var(--font-mono)",
              fontWeight: 700,
            }}
          >
            {showInsights ? "Hide" : "Show"}
          </button>
        </div>

        {/* Quick Stats Row */}
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

        {showInsights && (
          <div
            className="space-y-2 pt-2 border-t"
            style={{ borderColor: "var(--button-border)" }}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs secondary-text">Best Month:</span>
              <span className="text-xs font-bold primary-text">
                {
                  data.reduce((max, item) =>
                    item.revenue > max.revenue ? item : max
                  ).month
                }
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
        )}
      </div>
    </div>
  );

  const renderMetricsView = () => (
    <div className="flex flex-col h-full min-h-0">
      {/* Summary Cards */}
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
            icon: TrendingUpIcon,
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
            {/* Background pattern */}
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

      {/* Enhanced Monthly Breakdown */}
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

  const renderTrendsView = () => (
    <div className="flex flex-col h-full min-h-0">
      {/* Performance Score */}
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

  const renderView = () => {
    switch (currentView) {
      case "chart":
        return renderChartView();
      case "metrics":
        return renderMetricsView();
      case "trends":
        return renderTrendsView();
      default:
        return renderChartView();
    }
  };

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Enhanced View Navigation */}
      <div className="flex items-center justify-center space-x-1 mb-4 flex-shrink-0">
        {[
          { key: "chart", icon: BarChart3, label: "Chart" },
          { key: "metrics", icon: DollarSign, label: "Metrics" },
          { key: "trends", icon: TrendingUp, label: "Trends" },
        ].map(({ key, icon: Icon, label }) => (
          <button
            key={key}
            onClick={() =>
              setCurrentView(key as "chart" | "metrics" | "trends")
            }
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 ${
              currentView === key ? "scale-105" : ""
            }`}
            style={{
              background:
                currentView === key
                  ? colors.accent.blue + "20"
                  : "var(--button-bg)",
              border: `1px solid ${currentView === key ? colors.accent.blue : "var(--button-border)"}`,
              color:
                currentView === key ? colors.accent.blue : colors.secondary,
              fontFamily: "var(--font-mono)",
              fontWeight: 700,
            }}
          >
            <Icon className="w-4 h-4" />
            {!isMobile && <span>{label}</span>}
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-h-0">{renderView()}</div>
    </div>
  );
}
