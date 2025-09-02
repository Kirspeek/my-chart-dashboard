"use client";

import React, { useState, useEffect } from "react";
import {
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  AlertCircle,
  CheckCircle,
  Clock,
  Cpu,
  Database,
} from "lucide-react";
import type {
  WidgetRadarChartData,
  PerformanceMetricsData,
} from "../../../../interfaces/widgets";
import { useChartLogic } from "@/hooks/useChartLogic";
import { useTheme } from "@/hooks/useTheme";

interface PerformanceMetricsContainerProps {
  data: WidgetRadarChartData[] | PerformanceMetricsData;
  currentView: "radar" | "timeline" | "alerts" | "capacity";
  isRealTime: boolean;
}

export default function PerformanceMetricsContainer({
  data,
  currentView,
  isRealTime,
}: PerformanceMetricsContainerProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [currentMetrics, setCurrentMetrics] = useState<WidgetRadarChartData[]>(
    []
  );
  const [historicalData, setHistoricalData] = useState<
    Array<{
      time: string;
      cpu: number;
      memory: number;
      network: number;
      disk: number;
      response: number;
      errors: number;
      throughput: number;
      availability: number;
    }>
  >([]);
  const [alerts, setAlerts] = useState<
    Array<{
      id: number;
      severity: string;
      metric: string;
      message: string;
      time: string;
      status: string;
    }>
  >([]);
  const [capacityData, setCapacityData] = useState<{
    currentUtilization: Record<string, number>;
    projectedGrowth: Record<string, number>;
    recommendations: string[];
  } | null>(null);

  const { tooltipStyle } = useChartLogic();
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

  useEffect(() => {
    if (typeof data === "object" && "currentMetrics" in data) {
      const performanceData = data as PerformanceMetricsData;
      setCurrentMetrics(performanceData.currentMetrics);
      setHistoricalData(performanceData.historicalData.hourly);
      setAlerts(performanceData.alerts);
      setCapacityData(performanceData.capacityPlanning);
    } else {
      setCurrentMetrics(data as WidgetRadarChartData[]);
    }
  }, [data]);

  // Simulate real-time data updates
  useEffect(() => {
    if (!isRealTime) return;

    const interval = setInterval(() => {
      setCurrentMetrics((prev) =>
        prev.map((metric) => ({
          ...metric,
          value: Math.max(
            0,
            Math.min(100, metric.value + (Math.random() - 0.5) * 5)
          ),
          change: (Math.random() - 0.5) * 10,
        }))
      );
    }, 10000); // Update data every 10 seconds

    return () => clearInterval(interval);
  }, [isRealTime]);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-3 h-3 text-green-500" />;
      case "down":
        return <TrendingDown className="w-3 h-3 text-red-500" />;
      default:
        return <Minus className="w-3 h-3 text-gray-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "text-red-500";
      case "medium":
        return "text-yellow-500";
      case "low":
        return "text-blue-500";
      default:
        return "text-gray-500";
    }
  };

  const renderRadarView = () => {
    // Create comparison data - current vs previous with very different values for each metric
    const comparisonData = currentMetrics.map((metric) => {
      // Generate very different current values for each metric
      let currentValue;
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

      // Generate very different previous values for each metric based on the metric type
      let previousValue;
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
            {/* Current values */}
            <Radar
              name="Current"
              dataKey="current"
              stroke={colors.accent.blue}
              fill={colors.accent.blue}
              fillOpacity={0.3}
              strokeWidth={isMobile ? 2 : 3}
            />
            {/* Previous values */}
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
                const currentValue = props.payload.current;
                const previousValue = props.payload.previous;
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

        {/* Comparison Legend */}
        <div className="flex items-center justify-center space-x-4 mt-4 mb-2">
          <div className="flex items-center space-x-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ background: colors.accent.blue }}
            />
            <span
              className="text-xs font-bold"
              style={{
                color: colors.accent.blue,
                fontFamily: "var(--font-mono)",
                fontWeight: 700,
              }}
            >
              Current
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <div
              className="w-3 h-3 rounded-full border-2 border-dashed"
              style={{ borderColor: colors.accent.red }}
            />
            <span
              className="text-xs font-bold"
              style={{
                color: colors.accent.red,
                fontFamily: "var(--font-mono)",
                fontWeight: 700,
              }}
            >
              Previous
            </span>
          </div>
        </div>

        {/* Enhanced Metrics Summary with Comparison */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2 w-full">
          {comparisonData.slice(0, 4).map((metric) => {
            const change = metric.current - metric.previous;
            const changePercent =
              metric.previous > 0 ? (change / metric.previous) * 100 : 0;

            return (
              <div
                key={metric.subject}
                className="p-2 rounded-lg text-center"
                style={{
                  background: "var(--button-bg)",
                  border: "1px solid var(--button-border)",
                }}
              >
                <div className="text-xs font-medium secondary-text mb-1">
                  {metric.subject}
                </div>
                <div className="text-sm font-bold primary-text mb-1">
                  {metric.current}%
                </div>
                <div className="text-xs secondary-text mb-1">
                  vs {metric.previous}%
                </div>
                <div className="flex items-center justify-center">
                  {getTrendIcon(
                    change > 0 ? "up" : change < 0 ? "down" : "stable"
                  )}
                  <span
                    className="text-xs ml-1"
                    style={{
                      color:
                        change > 0 ? colors.accent.teal : colors.accent.red,
                      fontFamily: "var(--font-mono)",
                      fontWeight: 700,
                    }}
                  >
                    {change > 0 ? "+" : ""}
                    {changePercent.toFixed(1)}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Performance Summary */}
        <div
          className="mt-4 p-3 rounded-lg w-full"
          style={{
            background: "var(--button-bg)",
            border: "1px solid var(--button-border)",
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <div
                className="text-sm font-bold primary-text"
                style={{ fontFamily: "var(--font-mono)", fontWeight: 700 }}
              >
                Performance Comparison
              </div>
              <div className="text-xs secondary-text">
                Current vs Previous Period
              </div>
            </div>
            <div className="text-right">
              <div
                className="text-lg font-bold"
                style={{
                  color: colors.accent.teal,
                  fontFamily: "var(--font-mono)",
                  fontWeight: 700,
                }}
              >
                {Math.round(
                  comparisonData.reduce((sum, m) => sum + m.current, 0) /
                    comparisonData.length
                )}
                %
              </div>
              <div className="text-xs secondary-text">Current Avg</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderTimelineView = () => (
    <div className="flex flex-col h-full">
      {/* Timeline Header */}
      <div
        className="flex items-center justify-between mb-4 p-3 rounded-lg"
        style={{
          background: "var(--button-bg)",
          border: "1px solid var(--button-border)",
        }}
      >
        <div>
          <h4
            className="text-sm font-bold primary-text"
            style={{ fontFamily: "var(--font-mono)", fontWeight: 700 }}
          >
            System Activity Timeline
          </h4>
          <div className="text-xs secondary-text">
            Last 24 hours of system events and performance
          </div>
        </div>
        <div className="text-right">
          <div
            className="text-lg font-bold"
            style={{
              color: colors.accent.teal,
              fontFamily: "var(--font-mono)",
              fontWeight: 700,
            }}
          >
            {historicalData.length}
          </div>
          <div className="text-xs secondary-text">Events</div>
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <div className="relative">
          {/* Timeline line */}
          <div
            className="absolute left-4 top-0 bottom-0 w-0.5"
            style={{ background: colors.borderSecondary }}
          />

          {historicalData.slice(-8).map((data, index) => {
            const isHighActivity = data.cpu > 85 || data.memory > 80;
            const isMediumActivity = data.cpu > 70 || data.memory > 70;

            return (
              <div key={index} className="relative mb-4">
                {/* Timeline dot */}
                <div
                  className={`absolute left-3 w-3 h-3 rounded-full border-2 ${
                    isHighActivity
                      ? "bg-red-500 border-red-500"
                      : isMediumActivity
                        ? "bg-yellow-500 border-yellow-500"
                        : "bg-green-500 border-green-500"
                  }`}
                  style={{ marginTop: "4px" }}
                />

                {/* Event card */}
                <div
                  className="ml-8 p-3 rounded-lg"
                  style={{
                    background: "var(--button-bg)",
                    border: "1px solid var(--button-border)",
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Clock
                        className="w-3 h-3"
                        style={{ color: colors.secondary }}
                      />
                      <span
                        className="text-xs font-bold primary-text"
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontWeight: 700,
                        }}
                      >
                        {data.time}
                      </span>
                    </div>
                    <div
                      className={`text-xs px-2 py-1 rounded-full ${
                        isHighActivity
                          ? "bg-red-100 text-red-800"
                          : isMediumActivity
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                      }`}
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontWeight: 700,
                      }}
                    >
                      {isHighActivity
                        ? "HIGH"
                        : isMediumActivity
                          ? "MEDIUM"
                          : "LOW"}
                    </div>
                  </div>

                  {/* Performance indicators */}
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <div className="flex items-center space-x-2">
                      <Cpu
                        className="w-3 h-3"
                        style={{ color: colors.accent.red }}
                      />
                      <div className="flex-1">
                        <div className="text-xs secondary-text">CPU</div>
                        <div className="w-full bg-gray-200 rounded-full h-1">
                          <div
                            className="h-1 rounded-full transition-all duration-300"
                            style={{
                              width: `${data.cpu}%`,
                              background:
                                data.cpu > 80
                                  ? colors.accent.red
                                  : data.cpu > 60
                                    ? colors.accent.yellow
                                    : colors.accent.teal,
                            }}
                          />
                        </div>
                      </div>
                      <span
                        className="text-xs font-bold"
                        style={{
                          color:
                            data.cpu > 80
                              ? colors.accent.red
                              : data.cpu > 60
                                ? colors.accent.yellow
                                : colors.accent.teal,
                          fontFamily: "var(--font-mono)",
                          fontWeight: 700,
                        }}
                      >
                        {data.cpu}%
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Database
                        className="w-3 h-3"
                        style={{ color: colors.accent.blue }}
                      />
                      <div className="flex-1">
                        <div className="text-xs secondary-text">Memory</div>
                        <div className="w-full bg-gray-200 rounded-full h-1">
                          <div
                            className="h-1 rounded-full transition-all duration-300"
                            style={{
                              width: `${data.memory}%`,
                              background:
                                data.memory > 80
                                  ? colors.accent.red
                                  : data.memory > 60
                                    ? colors.accent.yellow
                                    : colors.accent.teal,
                            }}
                          />
                        </div>
                      </div>
                      <span
                        className="text-xs font-bold"
                        style={{
                          color:
                            data.memory > 80
                              ? colors.accent.red
                              : data.memory > 60
                                ? colors.accent.yellow
                                : colors.accent.teal,
                          fontFamily: "var(--font-mono)",
                          fontWeight: 700,
                        }}
                      >
                        {data.memory}%
                      </span>
                    </div>
                  </div>

                  {/* Additional metrics */}
                  <div className="grid grid-cols-3 gap-1 text-xs">
                    <div className="text-center">
                      <div className="secondary-text">Network</div>
                      <div
                        className="font-bold"
                        style={{
                          color:
                            data.network > 80
                              ? colors.accent.red
                              : colors.accent.teal,
                          fontFamily: "var(--font-mono)",
                          fontWeight: 700,
                        }}
                      >
                        {data.network}%
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="secondary-text">Disk</div>
                      <div
                        className="font-bold"
                        style={{
                          color:
                            data.disk > 80
                              ? colors.accent.red
                              : colors.accent.teal,
                          fontFamily: "var(--font-mono)",
                          fontWeight: 700,
                        }}
                      >
                        {data.disk}%
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="secondary-text">Response</div>
                      <div
                        className="font-bold"
                        style={{
                          color:
                            data.response > 80
                              ? colors.accent.red
                              : colors.accent.teal,
                          fontFamily: "var(--font-mono)",
                          fontWeight: 700,
                        }}
                      >
                        {data.response}ms
                      </div>
                    </div>
                  </div>

                  {/* Event description */}
                  <div
                    className="mt-2 pt-2 border-t"
                    style={{ borderColor: colors.borderSecondary }}
                  >
                    <div
                      className="text-xs secondary-text"
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontWeight: 700,
                      }}
                    >
                      {isHighActivity
                        ? `High system load detected - CPU at ${data.cpu}%, Memory at ${data.memory}%`
                        : isMediumActivity
                          ? `Moderate system activity - monitoring performance metrics`
                          : `System running optimally - all metrics within normal range`}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Timeline Summary */}
      <div
        className="mt-4 p-3 rounded-lg"
        style={{
          background: "var(--button-bg)",
          border: "1px solid var(--button-border)",
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <div
              className="text-sm font-bold primary-text"
              style={{ fontFamily: "var(--font-mono)", fontWeight: 700 }}
            >
              Activity Summary
            </div>
            <div className="text-xs secondary-text">
              {historicalData.filter((d) => d.cpu > 85 || d.memory > 80).length}{" "}
              high activity events
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div
                className="text-sm font-bold"
                style={{
                  color: colors.accent.teal,
                  fontFamily: "var(--font-mono)",
                  fontWeight: 700,
                }}
              >
                {Math.round(
                  historicalData.reduce((sum, d) => sum + d.cpu, 0) /
                    historicalData.length
                )}
                %
              </div>
              <div className="text-xs secondary-text">Avg CPU</div>
            </div>
            <div className="text-center">
              <div
                className="text-sm font-bold"
                style={{
                  color: colors.accent.blue,
                  fontFamily: "var(--font-mono)",
                  fontWeight: 700,
                }}
              >
                {Math.round(
                  historicalData.reduce((sum, d) => sum + d.memory, 0) /
                    historicalData.length
                )}
                %
              </div>
              <div className="text-xs secondary-text">Avg Memory</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAlertsView = () => (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`flex items-start space-x-3 p-3 mb-3 rounded-lg border-l-4 ${
              alert.status === "active" ? "opacity-100" : "opacity-60"
            }`}
            style={{
              background: "var(--button-bg)",
              borderLeftColor:
                alert.severity === "high"
                  ? colors.accent.red
                  : alert.severity === "medium"
                    ? colors.accent.yellow
                    : colors.accent.blue,
            }}
          >
            <div className={`mt-1 ${getSeverityColor(alert.severity)}`}>
              {alert.status === "active" ? (
                <AlertCircle className="w-4 h-4" />
              ) : (
                <CheckCircle className="w-4 h-4" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span
                  className="text-sm font-bold primary-text"
                  style={{ fontFamily: "var(--font-mono)", fontWeight: 700 }}
                >
                  {alert.metric}
                </span>
                <span
                  className="text-xs secondary-text"
                  style={{ fontFamily: "var(--font-mono)", fontWeight: 700 }}
                >
                  {new Date(alert.time).toLocaleTimeString()}
                </span>
              </div>
              <p
                className="text-xs secondary-text"
                style={{ fontFamily: "var(--font-mono)", fontWeight: 700 }}
              >
                {alert.message}
              </p>
              <div className="flex items-center mt-2">
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    alert.severity === "high"
                      ? "bg-red-100 text-red-800"
                      : alert.severity === "medium"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-blue-100 text-blue-800"
                  }`}
                  style={{ fontFamily: "var(--font-mono)", fontWeight: 700 }}
                >
                  {alert.severity.toUpperCase()}
                </span>
                <span
                  className={`text-xs ml-2 px-2 py-1 rounded-full ${
                    alert.status === "active"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                  style={{ fontFamily: "var(--font-mono)", fontWeight: 700 }}
                >
                  {alert.status.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCapacityView = () => (
    <div className="flex flex-col h-full">
      {capacityData && (
        <>
          {/* Current vs Projected */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="space-y-3">
              <h4
                className="text-sm font-bold primary-text"
                style={{ fontFamily: "var(--font-mono)", fontWeight: 700 }}
              >
                Current Utilization
              </h4>
              {Object.entries(capacityData.currentUtilization).map(
                ([key, value]) => (
                  <div key={key} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="secondary-text capitalize">{key}</span>
                      <span className="primary-text font-bold">
                        {value as number}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${value as number}%`,
                          background:
                            (value as number) > 80
                              ? colors.accent.red
                              : (value as number) > 60
                                ? colors.accent.yellow
                                : colors.accent.teal,
                        }}
                      />
                    </div>
                  </div>
                )
              )}
            </div>

            <div className="space-y-3">
              <h4
                className="text-sm font-bold primary-text"
                style={{ fontFamily: "var(--font-mono)", fontWeight: 700 }}
              >
                Projected Growth
              </h4>
              {Object.entries(capacityData.projectedGrowth).map(
                ([key, value]) => (
                  <div key={key} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="secondary-text capitalize">{key}</span>
                      <span className="primary-text font-bold">
                        {value as number}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${value as number}%`,
                          background:
                            (value as number) > 90
                              ? colors.accent.red
                              : (value as number) > 75
                                ? colors.accent.yellow
                                : colors.accent.teal,
                        }}
                      />
                    </div>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Recommendations */}
          <div className="flex-1">
            <h4
              className="text-sm font-bold primary-text mb-3"
              style={{ fontFamily: "var(--font-mono)", fontWeight: 700 }}
            >
              Recommendations
            </h4>
            <div className="space-y-2">
              {capacityData.recommendations.map(
                (rec: string, index: number) => (
                  <div
                    key={index}
                    className="flex items-start space-x-2 p-2 rounded-lg"
                    style={{
                      background: "var(--button-bg)",
                      border: "1px solid var(--button-border)",
                    }}
                  >
                    <Clock
                      className="w-3 h-3 mt-0.5"
                      style={{ color: colors.accent.blue }}
                    />
                    <span
                      className="text-xs secondary-text"
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontWeight: 700,
                      }}
                    >
                      {rec}
                    </span>
                  </div>
                )
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );

  const renderView = () => {
    switch (currentView) {
      case "radar":
        return renderRadarView();
      case "timeline":
        return renderTimelineView();
      case "alerts":
        return renderAlertsView();
      case "capacity":
        return renderCapacityView();
      default:
        return renderRadarView();
    }
  };

  return <div className="flex-1 relative">{renderView()}</div>;
}
