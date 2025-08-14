"use client";

import React, { useState, useEffect } from "react";
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
  TrendingUp,
  TrendingDown,
  Minus,
  DollarSign,
  BarChart3,
  Target,
  Calendar,
  Activity,
  PieChart,
  LineChart,
  Sparkles,
  Eye,
  MousePointer,
} from "lucide-react";
import type { WidgetBarChartData } from "../../../../interfaces/widgets";
import { useChartLogic } from "src/hooks/useChartLogic";
import { useTheme } from "src/hooks/useTheme";

interface BarChartContainerProps {
  data: WidgetBarChartData[];
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    dataKey: string;
    value: number;
  }>;
  label?: string;
}

export default function BarChartContainer({ data }: BarChartContainerProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [currentView, setCurrentView] = useState<
    "bars" | "lines" | "area" | "composed"
  >("bars");
  const [selectedQuarter, setSelectedQuarter] = useState<string | null>(null);
  const [animatedValues, setAnimatedValues] = useState({
    totalRevenue: 0,
    totalSales: 0,
    avgRevenue: 0,
    growth: 0,
  });
  const [showInsights, setShowInsights] = useState(false);
  const [hoveredQuarter, setHoveredQuarter] = useState<string | null>(null);

  const { chartColors, formatValue, axisStyle, gridStyle } = useChartLogic();
  const { colors } = useTheme();

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
    const analytics = calculateAnalytics();
    const duration = 2000; // 2 seconds
    const steps = 60;
    const stepDuration = duration / steps;

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;

      setAnimatedValues({
        totalRevenue: Math.floor(analytics.totalRevenue * progress),
        totalSales: Math.floor(analytics.totalSales * progress),
        avgRevenue: Math.floor(analytics.avgRevenue * progress),
        growth: analytics.growth * progress,
      });

      if (currentStep >= steps) {
        clearInterval(interval);
      }
    }, stepDuration);

    return () => clearInterval(interval);
  }, [data]);

  // Calculate analytics
  const calculateAnalytics = () => {
    if (!data.length)
      return {
        totalRevenue: 0,
        totalSales: 0,
        avgRevenue: 0,
        avgSales: 0,
        growth: 0,
      };

    const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);
    const totalSales = data.reduce((sum, item) => sum + item.sales, 0);
    const avgRevenue = totalRevenue / data.length;
    const avgSales = totalSales / data.length;

    // Calculate growth from Q1 to Q4
    const q1Revenue = data[0]?.revenue || 0;
    const q4Revenue = data[data.length - 1]?.revenue || 0;
    const growth =
      q1Revenue > 0 ? ((q4Revenue - q1Revenue) / q1Revenue) * 100 : 0;

    return { totalRevenue, totalSales, avgRevenue, avgSales, growth };
  };

  const analytics = calculateAnalytics();

  // Enhanced data with gradients and trends
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
      trend: revenueGrowth > 0 ? "up" : revenueGrowth < 0 ? "down" : "stable",
      isSelected: selectedQuarter === item.name,
      isHovered: hoveredQuarter === item.name,
    };
  });

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

  // Custom tooltip with insights
  const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
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
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(0, 0, 0, 0.1)",
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

  const renderChart = () => {
    const chartHeight = isMobile ? 200 : 250;

    switch (currentView) {
      case "bars":
        return (
          <ResponsiveContainer width="100%" height={chartHeight}>
            <RechartsBarChart
              data={enhancedData}
              onMouseMove={(data) => {
                if (data && data.activeLabel) {
                  setHoveredQuarter(data.activeLabel);
                }
              }}
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
                {/* Animated gradient for selected quarter */}
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
                onClick={(data) => setSelectedQuarter(data.name || null)}
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
                onClick={(data) => setSelectedQuarter(data.name || null)}
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
              onMouseMove={(data) => {
                if (data && data.activeLabel) {
                  setHoveredQuarter(data.activeLabel);
                }
              }}
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
                  stroke: "#fff",
                }}
                activeDot={{
                  r: 7,
                  fill: chartColors.revenue,
                  strokeWidth: 2,
                  stroke: "#fff",
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
                  stroke: "#fff",
                }}
                activeDot={{
                  r: 7,
                  fill: chartColors.sales,
                  strokeWidth: 2,
                  stroke: "#fff",
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
                  setHoveredQuarter(data.activeLabel);
                }
              }}
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
              onMouseMove={(data) => {
                if (data && data.activeLabel) {
                  setHoveredQuarter(data.activeLabel);
                }
              }}
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
                  stroke: "#fff",
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
      {/* Enhanced Header with Analytics */}
      <div
        className="flex items-center justify-between mb-4 p-3 rounded-lg flex-shrink-0 relative overflow-hidden"
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
            Quarterly Performance
          </div>
          <div className="text-xs secondary-text">Revenue & Sales Analysis</div>
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
            ${(animatedValues.totalRevenue / 1000).toFixed(0)}k
          </div>
          <div className="text-xs secondary-text">Total Revenue</div>
        </div>
      </div>

      {/* Interactive Quarter Selector */}
      {selectedQuarter && (
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
                Selected: {selectedQuarter}
              </span>
            </div>
            <button
              onClick={() => setSelectedQuarter(null)}
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

      {/* Chart Type Navigation */}
      <div className="flex items-center justify-center space-x-1 mb-4 flex-shrink-0">
        {[
          { key: "bars", icon: BarChart3, label: "Bars" },
          { key: "lines", icon: LineChart, label: "Lines" },
          { key: "area", icon: Activity, label: "Area" },
          { key: "composed", icon: PieChart, label: "Mixed" },
        ].map(({ key, icon: Icon, label }) => (
          <button
            key={key}
            onClick={() =>
              setCurrentView(key as "bars" | "lines" | "area" | "composed")
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

      {/* Chart */}
      <div className="flex-1 min-h-0 mb-4">{renderChart()}</div>

      {/* Enhanced Analytics Cards */}
      <div className="grid grid-cols-2 gap-2 flex-shrink-0">
        {[
          {
            icon: DollarSign,
            label: "Total Revenue",
            value: animatedValues.totalRevenue,
            growth: animatedValues.growth,
            color: chartColors.revenue,
            subtitle: "Annual Revenue",
            badge: "Top Performer",
          },
          {
            icon: Target,
            label: "Total Sales",
            value: animatedValues.totalSales,
            growth: 0,
            color: chartColors.sales,
            subtitle: "Annual Sales",
            badge: "Growing",
          },
          {
            icon: BarChart3,
            label: "Avg Revenue",
            value: animatedValues.avgRevenue,
            growth: 0,
            color: colors.accent.teal,
            subtitle: "Per Quarter",
            badge: "Stable",
          },
          {
            icon: Calendar,
            label: "Growth Rate",
            value: animatedValues.growth.toFixed(1) + "%",
            growth: animatedValues.growth,
            color: colors.accent.blue,
            subtitle: "Q1 to Q4",
            badge: "Trending",
          },
        ].map((item, index) => (
          <div
            key={index}
            className="p-2 rounded-lg relative overflow-hidden min-h-[70px] group hover:scale-[1.02] transition-all duration-300"
            style={{
              background: "var(--button-bg)",
              border: "1px solid var(--button-border)",
            }}
          >
            {/* Animated background accent */}
            <div
              className="absolute top-0 right-0 w-4 h-4 rounded-bl-full opacity-10 group-hover:opacity-20 transition-opacity duration-300"
              style={{ background: item.color }}
            />

            {/* Badge - moved to top-left to avoid overlap */}
            <div className="absolute top-1 left-1">
              <div
                className="text-xs px-1 py-0.5 rounded-full"
                style={{
                  background: item.color + "20",
                  color: item.color,
                  fontFamily: "var(--font-mono)",
                  fontWeight: 700,
                  fontSize: "0.6rem",
                }}
              >
                {item.badge}
              </div>
            </div>

            <div className="relative z-10 h-full flex flex-col justify-between pt-6">
              <div className="flex items-center justify-between mb-1">
                <item.icon className="w-3 h-3" style={{ color: item.color }} />
                <div
                  className={`text-xs px-1 py-0.5 rounded-full ${
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

              <div className="text-xs secondary-text">{item.subtitle}</div>
              <div className="text-sm font-bold primary-text mb-1">
                {typeof item.value === "number"
                  ? `$${(item.value / 1000).toFixed(0)}k`
                  : item.value}
              </div>

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
                    ? "Growing"
                    : item.growth < 0
                      ? "Declining"
                      : "Stable"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Insights Panel */}
      <div
        className="mt-3 p-3 rounded-lg flex-shrink-0"
        style={{
          background: "var(--button-bg)",
          border: "1px solid var(--button-border)",
        }}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <Eye
              className="w-4 h-4 mr-2"
              style={{ color: colors.accent.blue }}
            />
            <span className="text-sm font-bold primary-text">Key Insights</span>
          </div>
          <button
            onClick={() => setShowInsights(!showInsights)}
            className="text-xs px-2 py-1 rounded-full transition-all duration-200"
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

        {showInsights && (
          <div className="space-y-2">
            <div className="text-xs secondary-text">
              💡 <strong>Best Quarter:</strong> Q3 with $
              {(Math.max(...data.map((d) => d.revenue)) / 1000).toFixed(0)}k
              revenue
            </div>
            <div className="text-xs secondary-text">
              📈 <strong>Growth Trend:</strong>{" "}
              {analytics.growth > 0 ? "Positive" : "Negative"} year-over-year
              growth
            </div>
            <div className="text-xs secondary-text">
              🎯 <strong>Recommendation:</strong> Focus on Q3 strategies for Q4
              optimization
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
