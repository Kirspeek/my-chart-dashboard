"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
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
  Activity,
} from "lucide-react";
import type {
  WidgetRadarChartData,
  PerformanceMetricsData,
} from "@/interfaces/widgets";
import { useChartLogic } from "@/hooks/useChartLogic";
import { useTheme } from "@/hooks/useTheme";
import FlexiblePerformanceTimeline from "./FlexiblePerformanceTimeline";

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
    } else {
      setCurrentMetrics(data as WidgetRadarChartData[]);
    }
  }, [data]);

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
    }, 10000);

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

  const renderRadarView = () => {
    const comparisonData = currentMetrics.map((metric) => {
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

  const renderTimelineView = () => {
    const generateEvent = (index: number, baseTime: Date) => {
      const eventTypes = [
        "performance",
        "alert",
        "maintenance",
        "deployment",
      ] as const;
      const severities = ["low", "medium", "high", "critical"] as const;
      const statuses = ["active", "resolved", "investigating"] as const;
      const impacts = ["low", "medium", "high"] as const;

      const eventType =
        eventTypes[Math.floor(Math.random() * eventTypes.length)];
      const severity =
        severities[Math.floor(Math.random() * severities.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const impact = impacts[Math.floor(Math.random() * impacts.length)];

      const timeOffset = index * 15;
      const eventTime = new Date(baseTime.getTime() - timeOffset * 60000);

      const eventTitles = {
        performance: [
          "System Performance Update",
          "Resource Utilization Report",
          "Performance Metrics Analysis",
          "System Health Check",
          "Performance Optimization",
        ],
        alert: [
          "High CPU Usage Alert",
          "Memory Threshold Exceeded",
          "Network Latency Warning",
          "Disk Space Critical",
          "Service Response Time Alert",
        ],
        maintenance: [
          "Scheduled System Maintenance",
          "Database Optimization",
          "Cache Clearing",
          "Security Patch Applied",
          "System Reboot Completed",
        ],
        deployment: [
          "New Version Deployed",
          "Feature Rollout",
          "Configuration Update",
          "Service Restart",
          "Hotfix Applied",
        ],
      };

      const descriptions = {
        performance: [
          "System performance metrics updated with latest measurements",
          "Resource utilization within normal parameters",
          "Performance analysis completed successfully",
          "System health indicators show optimal status",
          "Performance optimization recommendations generated",
        ],
        alert: [
          "System alert triggered due to resource constraints",
          "Warning condition detected in system monitoring",
          "Alert condition resolved after investigation",
          "Critical threshold exceeded requiring attention",
          "Alert status updated after system intervention",
        ],
        maintenance: [
          "Scheduled maintenance window completed successfully",
          "System maintenance tasks executed without issues",
          "Maintenance procedures completed as planned",
          "System maintenance window closed",
          "Maintenance activities finished successfully",
        ],
        deployment: [
          "New deployment completed successfully",
          "Feature deployment rolled out to production",
          "Configuration changes applied successfully",
          "Service deployment completed without issues",
          "Deployment process finished successfully",
        ],
      };

      const title =
        eventTitles[eventType][
          Math.floor(Math.random() * eventTitles[eventType].length)
        ];
      const description =
        descriptions[eventType][
          Math.floor(Math.random() * descriptions[eventType].length)
        ];

      return {
        id: `event-${index}-${Date.now()}`,
        timestamp: eventTime.toISOString(),
        time: eventTime.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        type: eventType,
        severity: severity,
        title: title,
        description: description,
        metrics: {
          cpu: Math.floor(Math.random() * 100),
          memory: Math.floor(Math.random() * 100),
          network: Math.floor(Math.random() * 100),
          disk: Math.floor(Math.random() * 100),
          response: Math.floor(Math.random() * 200),
          errors: Math.floor(Math.random() * 10),
          throughput: Math.floor(Math.random() * 1000),
          availability: 99 + Math.random(),
        },
        tags: [
          eventType,
          severity,
          ...(severity === "critical" ? ["urgent"] : []),
          ...(eventType === "deployment" ? ["release"] : []),
          ...(eventType === "maintenance" ? ["scheduled"] : []),
        ],
        status: status,
        impact: impact,
      };
    };
    const now = new Date();
    const timelineEvents = Array.from({ length: 20 }, (_, index) =>
      generateEvent(index, now)
    );

    return (
      <FlexiblePerformanceTimeline
        data={timelineEvents}
        isRealTime={isRealTime}
      />
    );
  };

  const renderAlertsView = () => {
    const generateAlert = (index: number) => {
      const alertTypes = [
        {
          metric: "CPU Usage",
          message: "High CPU utilization detected",
          severity: "high",
          status: "active",
          value: "95%",
          threshold: "85%",
          duration: "5m",
          source: "System Monitor",
        },
        {
          metric: "Memory Usage",
          message: "Memory consumption approaching limit",
          severity: "medium",
          status: "active",
          value: "78%",
          threshold: "80%",
          duration: "12m",
          source: "Memory Monitor",
        },
        {
          metric: "Disk Space",
          message: "Disk space critically low",
          severity: "critical",
          status: "active",
          value: "5%",
          threshold: "10%",
          duration: "2h",
          source: "Storage Monitor",
        },
        {
          metric: "Network Latency",
          message: "Network response time elevated",
          severity: "medium",
          status: "resolved",
          value: "250ms",
          threshold: "200ms",
          duration: "30m",
          source: "Network Monitor",
        },
        {
          metric: "Database Connections",
          message: "Connection pool near capacity",
          severity: "high",
          status: "active",
          value: "95/100",
          threshold: "90/100",
          duration: "8m",
          source: "Database Monitor",
        },
        {
          metric: "Error Rate",
          message: "Application error rate spike",
          severity: "high",
          status: "investigating",
          value: "5.2%",
          threshold: "2%",
          duration: "15m",
          source: "Application Monitor",
        },
        {
          metric: "Response Time",
          message: "API response time degraded",
          severity: "medium",
          status: "resolved",
          value: "1.2s",
          threshold: "1s",
          duration: "45m",
          source: "API Monitor",
        },
        {
          metric: "Queue Depth",
          message: "Message queue backlog detected",
          severity: "medium",
          status: "active",
          value: "1,250",
          threshold: "1,000",
          duration: "20m",
          source: "Queue Monitor",
        },
      ];

      const alert = alertTypes[index % alertTypes.length];
      const timeOffset = index * 30;
      const alertTime = new Date(Date.now() - timeOffset * 60000);

      return {
        id: `alert-${index}`,
        metric: alert.metric,
        message: alert.message,
        severity: alert.severity,
        status: alert.status,
        value: alert.value,
        threshold: alert.threshold,
        duration: alert.duration,
        source: alert.source,
        time: alertTime.toISOString(),
        timestamp: alertTime.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        tags: [
          alert.severity,
          alert.status,
          alert.source.toLowerCase().replace(" ", "-"),
          ...(alert.severity === "critical" ? ["urgent"] : []),
          ...(alert.status === "active" ? ["ongoing"] : ["resolved"]),
        ],
      };
    };

    const alertData = Array.from({ length: 12 }, (_, index) =>
      generateAlert(index)
    );

    return (
      <div className="flex flex-col h-full">
        <div
          className="p-4 rounded-xl mb-4"
          style={{
            background: "var(--button-bg)",
            border: "1px solid var(--button-border)",
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3
                className="text-lg font-bold primary-text"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                System Alerts
              </h3>
              <p className="text-sm secondary-text">
                Real-time monitoring and alert management
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div
                  className="text-2xl font-bold"
                  style={{ color: colors.accent.red }}
                >
                  {alertData.filter((a) => a.severity === "critical").length}
                </div>
                <div className="text-xs secondary-text">Critical</div>
              </div>
              <div className="text-center">
                <div
                  className="text-2xl font-bold"
                  style={{ color: colors.accent.yellow }}
                >
                  {alertData.filter((a) => a.severity === "high").length}
                </div>
                <div className="text-xs secondary-text">High</div>
              </div>
              <div className="text-center">
                <div
                  className="text-2xl font-bold"
                  style={{ color: colors.accent.blue }}
                >
                  {alertData.filter((a) => a.severity === "medium").length}
                </div>
                <div className="text-xs secondary-text">Medium</div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <select
              className="px-3 py-2 text-sm rounded-lg border"
              style={{
                background: "var(--background)",
                borderColor: "var(--button-border)",
                color: "var(--primary-text)",
              }}
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
            </select>
            <select
              className="px-3 py-2 text-sm rounded-lg border"
              style={{
                background: "var(--background)",
                borderColor: "var(--button-border)",
                color: "var(--primary-text)",
              }}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="resolved">Resolved</option>
              <option value="investigating">Investigating</option>
            </select>
            <button
              className="px-3 py-2 text-sm rounded-lg border"
              style={{
                background: "var(--accent-color)20",
                borderColor: "var(--accent-color)",
                color: "var(--accent-color)",
              }}
            >
              <AlertCircle className="w-4 h-4 inline mr-1" />
              Acknowledge All
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-hide space-y-3">
          {alertData.map((alert, index) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`p-4 rounded-xl border-l-4 ${
                alert.status === "active" ? "opacity-100" : "opacity-70"
              }`}
              style={{
                background: "var(--button-bg)",
                borderLeftColor:
                  alert.severity === "critical"
                    ? colors.accent.red
                    : alert.severity === "high"
                      ? colors.accent.red
                      : alert.severity === "medium"
                        ? colors.accent.yellow
                        : colors.accent.blue,
              }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div
                    className="p-2 rounded-lg"
                    style={{
                      background: `${
                        alert.severity === "critical"
                          ? colors.accent.red
                          : alert.severity === "high"
                            ? colors.accent.red
                            : alert.severity === "medium"
                              ? colors.accent.yellow
                              : colors.accent.blue
                      }20`,
                      color:
                        alert.severity === "critical"
                          ? colors.accent.red
                          : alert.severity === "high"
                            ? colors.accent.red
                            : alert.severity === "medium"
                              ? colors.accent.yellow
                              : colors.accent.blue,
                    }}
                  >
                    {alert.status === "active" ? (
                      <AlertCircle className="w-5 h-5" />
                    ) : alert.status === "resolved" ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <Clock className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <h4
                      className="text-base font-bold primary-text"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      {alert.metric}
                    </h4>
                    <p className="text-sm secondary-text">{alert.message}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className="text-lg font-bold"
                    style={{
                      color:
                        alert.severity === "critical"
                          ? colors.accent.red
                          : alert.severity === "high"
                            ? colors.accent.red
                            : alert.severity === "medium"
                              ? colors.accent.yellow
                              : colors.accent.blue,
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    {alert.value}
                  </div>
                  <div className="text-xs secondary-text">
                    Threshold: {alert.threshold}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span
                    className="px-3 py-1 text-xs font-bold rounded-full"
                    style={{
                      background: `${
                        alert.severity === "critical"
                          ? colors.accent.red
                          : alert.severity === "high"
                            ? colors.accent.red
                            : alert.severity === "medium"
                              ? colors.accent.yellow
                              : colors.accent.blue
                      }20`,
                      color:
                        alert.severity === "critical"
                          ? colors.accent.red
                          : alert.severity === "high"
                            ? colors.accent.red
                            : alert.severity === "medium"
                              ? colors.accent.yellow
                              : colors.accent.blue,
                    }}
                  >
                    {alert.severity.toUpperCase()}
                  </span>
                  <span
                    className="px-3 py-1 text-xs font-bold rounded-full"
                    style={{
                      background:
                        alert.status === "active"
                          ? `${colors.accent.teal}20`
                          : alert.status === "resolved"
                            ? `${colors.accent.blue}20`
                            : `${colors.accent.yellow}20`,
                      color:
                        alert.status === "active"
                          ? colors.accent.teal
                          : alert.status === "resolved"
                            ? colors.accent.blue
                            : colors.accent.yellow,
                    }}
                  >
                    {alert.status.toUpperCase()}
                  </span>
                  <span className="text-xs secondary-text">
                    Duration: {alert.duration}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs secondary-text">
                    {alert.timestamp}
                  </span>
                  <button
                    className="px-2 py-1 text-xs rounded border"
                    style={{
                      background: "var(--background)",
                      borderColor: "var(--button-border)",
                      color: "var(--primary-text)",
                    }}
                  >
                    {alert.status === "active" ? "Acknowledge" : "View Details"}
                  </button>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-1">
                {alert.tags?.map((tag, tagIndex) => (
                  <span
                    key={`${alert.id}-${tag}-${tagIndex}`}
                    className="px-2 py-1 text-xs rounded"
                    style={{
                      background: "var(--accent-color)20",
                      color: "var(--accent-color)",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

  const renderCapacityView = () => {
    const generateCapacityData = () => {
      const resources = [
        {
          name: "CPU Cores",
          current: 75,
          projected: 85,
          unit: "cores",
          total: 16,
        },
        { name: "Memory", current: 68, projected: 78, unit: "GB", total: 64 },
        { name: "Storage", current: 45, projected: 52, unit: "TB", total: 10 },
        {
          name: "Network Bandwidth",
          current: 32,
          projected: 38,
          unit: "Gbps",
          total: 100,
        },
        {
          name: "Database Connections",
          current: 82,
          projected: 88,
          unit: "connections",
          total: 1000,
        },
        {
          name: "API Rate Limit",
          current: 28,
          projected: 35,
          unit: "req/s",
          total: 10000,
        },
        {
          name: "Cache Hit Rate",
          current: 94,
          projected: 92,
          unit: "%",
          total: 100,
        },
        {
          name: "Queue Depth",
          current: 15,
          projected: 22,
          unit: "messages",
          total: 10000,
        },
      ];

      const recommendations = [
        {
          priority: "high",
          category: "Infrastructure",
          title: "Scale CPU Resources",
          description:
            "CPU utilization projected to reach 85% within 30 days. Consider adding 4 additional cores.",
          impact: "Prevents performance degradation",
          effort: "Medium",
          timeline: "2 weeks",
        },
        {
          priority: "medium",
          category: "Database",
          title: "Optimize Connection Pool",
          description:
            "Database connections approaching capacity. Implement connection pooling optimization.",
          impact: "Improves database performance",
          effort: "Low",
          timeline: "1 week",
        },
        {
          priority: "high",
          category: "Storage",
          title: "Expand Storage Capacity",
          description:
            "Storage growth rate indicates need for additional capacity within 60 days.",
          impact: "Prevents storage exhaustion",
          effort: "High",
          timeline: "4 weeks",
        },
        {
          priority: "low",
          category: "Performance",
          title: "Cache Optimization",
          description:
            "Cache hit rate declining. Review and optimize caching strategies.",
          impact: "Improves response times",
          effort: "Medium",
          timeline: "3 weeks",
        },
        {
          priority: "medium",
          category: "Network",
          title: "Bandwidth Monitoring",
          description:
            "Network utilization trending upward. Implement advanced monitoring.",
          impact: "Better network visibility",
          effort: "Low",
          timeline: "1 week",
        },
      ];

      return { resources, recommendations };
    };

    const { resources, recommendations } = generateCapacityData();

    const getPriorityColor = (priority: string) => {
      switch (priority) {
        case "high":
          return colors.accent.red;
        case "medium":
          return colors.accent.yellow;
        case "low":
          return colors.accent.blue;
        default:
          return colors.accent.teal;
      }
    };

    const getPriorityIcon = (priority: string) => {
      switch (priority) {
        case "high":
          return <AlertCircle className="w-4 h-4" />;
        case "medium":
          return <Clock className="w-4 h-4" />;
        case "low":
          return <CheckCircle className="w-4 h-4" />;
        default:
          return <Activity className="w-4 h-4" />;
      }
    };

    return (
      <div className="flex flex-col h-full">
        <div
          className="p-4 rounded-xl mb-4"
          style={{
            background: "var(--button-bg)",
            border: "1px solid var(--button-border)",
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3
                className="text-lg font-bold primary-text"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                Capacity Planning
              </h3>
              <p className="text-sm secondary-text">
                Resource utilization and growth projections
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div
                  className="text-2xl font-bold"
                  style={{ color: colors.accent.red }}
                >
                  {resources.filter((r) => r.projected > 80).length}
                </div>
                <div className="text-xs secondary-text">Critical</div>
              </div>
              <div className="text-center">
                <div
                  className="text-2xl font-bold"
                  style={{ color: colors.accent.yellow }}
                >
                  {
                    resources.filter(
                      (r) => r.projected > 60 && r.projected <= 80
                    ).length
                  }
                </div>
                <div className="text-xs secondary-text">Warning</div>
              </div>
              <div className="text-center">
                <div
                  className="text-2xl font-bold"
                  style={{ color: colors.accent.teal }}
                >
                  {resources.filter((r) => r.projected <= 60).length}
                </div>
                <div className="text-xs secondary-text">Healthy</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {resources.map((resource, index) => (
            <motion.div
              key={resource.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 rounded-xl"
              style={{
                background: "var(--button-bg)",
                border: "1px solid var(--button-border)",
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <h4
                  className="text-sm font-bold primary-text"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {resource.name}
                </h4>
                <div className="text-right">
                  <div
                    className="text-lg font-bold"
                    style={{
                      color:
                        resource.projected > 80
                          ? colors.accent.red
                          : resource.projected > 60
                            ? colors.accent.yellow
                            : colors.accent.teal,
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    {resource.current}
                    {resource.unit}
                  </div>
                  <div className="text-xs secondary-text">
                    of {resource.total}
                    {resource.unit}
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <div className="flex justify-between text-xs mb-1">
                  <span className="secondary-text">Current</span>
                  <span className="primary-text font-bold">
                    {resource.current}%
                  </span>
                </div>
                <div
                  className="w-full rounded-full h-2"
                  style={{ background: "var(--background)" }}
                >
                  <div
                    className="h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${resource.current}%`,
                      background:
                        resource.current > 80
                          ? colors.accent.red
                          : resource.current > 60
                            ? colors.accent.yellow
                            : colors.accent.teal,
                    }}
                  />
                </div>
              </div>

              <div className="mb-3">
                <div className="flex justify-between text-xs mb-1">
                  <span className="secondary-text">Projected (30d)</span>
                  <span className="primary-text font-bold">
                    {resource.projected}%
                  </span>
                </div>
                <div
                  className="w-full rounded-full h-2"
                  style={{ background: "var(--background)" }}
                >
                  <div
                    className="h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${resource.projected}%`,
                      background:
                        resource.projected > 80
                          ? colors.accent.red
                          : resource.projected > 60
                            ? colors.accent.yellow
                            : colors.accent.teal,
                      opacity: 0.7,
                    }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  {resource.projected > resource.current ? (
                    <TrendingUp
                      className="w-3 h-3"
                      style={{ color: colors.accent.red }}
                    />
                  ) : (
                    <TrendingDown
                      className="w-3 h-3"
                      style={{ color: colors.accent.teal }}
                    />
                  )}
                  <span className="text-xs secondary-text">
                    {resource.projected > resource.current ? "+" : ""}
                    {resource.projected - resource.current}%
                  </span>
                </div>
                <span
                  className="px-2 py-1 text-xs rounded-full"
                  style={{
                    background:
                      resource.projected > 80
                        ? `${colors.accent.red}20`
                        : resource.projected > 60
                          ? `${colors.accent.yellow}20`
                          : `${colors.accent.teal}20`,
                    color:
                      resource.projected > 80
                        ? colors.accent.red
                        : resource.projected > 60
                          ? colors.accent.yellow
                          : colors.accent.teal,
                  }}
                >
                  {resource.projected > 80
                    ? "Critical"
                    : resource.projected > 60
                      ? "Warning"
                      : "Healthy"}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <div
            className="p-4 rounded-xl mb-4"
            style={{
              background: "var(--button-bg)",
              border: "1px solid var(--button-border)",
            }}
          >
            <h4
              className="text-lg font-bold primary-text mb-4"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Capacity Recommendations
            </h4>
            <div className="space-y-3">
              {recommendations.map((rec, index) => (
                <motion.div
                  key={rec.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 rounded-lg border-l-4"
                  style={{
                    background: "var(--background)",
                    borderLeftColor: getPriorityColor(rec.priority),
                  }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div
                        className="p-2 rounded-lg"
                        style={{
                          background: `${getPriorityColor(rec.priority)}20`,
                          color: getPriorityColor(rec.priority),
                        }}
                      >
                        {getPriorityIcon(rec.priority)}
                      </div>
                      <div>
                        <h5
                          className="text-sm font-bold primary-text"
                          style={{ fontFamily: "var(--font-mono)" }}
                        >
                          {rec.title}
                        </h5>
                        <p className="text-xs secondary-text">
                          {rec.description}
                        </p>
                      </div>
                    </div>
                    <span
                      className="px-2 py-1 text-xs font-bold rounded-full"
                      style={{
                        background: `${getPriorityColor(rec.priority)}20`,
                        color: getPriorityColor(rec.priority),
                      }}
                    >
                      {rec.priority.toUpperCase()}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mt-3">
                    <div>
                      <div className="text-xs secondary-text">Impact</div>
                      <div className="text-sm font-bold primary-text">
                        {rec.impact}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs secondary-text">Effort</div>
                      <div className="text-sm font-bold primary-text">
                        {rec.effort}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs secondary-text">Timeline</div>
                      <div className="text-sm font-bold primary-text">
                        {rec.timeline}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <span
                      className="px-2 py-1 text-xs rounded"
                      style={{
                        background: "var(--accent-color)20",
                        color: "var(--accent-color)",
                      }}
                    >
                      {rec.category}
                    </span>
                    <button
                      className="px-3 py-1 text-xs rounded border"
                      style={{
                        background: "var(--button-bg)",
                        borderColor: "var(--button-border)",
                        color: "var(--primary-text)",
                      }}
                    >
                      View Details
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

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
