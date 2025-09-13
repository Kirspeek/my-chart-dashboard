"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  Cpu,
  Database,
  Network,
  HardDrive,
  Zap,
  Activity,
  AlertTriangle,
  CheckCircle,
  Info,
  Search,
  Calendar,
  BarChart3,
} from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import type { TimelineEvent, PerformanceTimelineProps } from "@/interfaces";

const PerformanceTimeline: React.FC<PerformanceTimelineProps> = ({
  data,
  isRealTime = false,
}) => {
  const { colors } = useTheme();
  const [filteredData, setFilteredData] = useState<TimelineEvent[]>(data);
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(
    null
  );
  const [filters, setFilters] = useState({
    severity: "all",
    type: "all",
    status: "all",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"timeline" | "compact">("timeline");
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let filtered = data;

    if (filters.severity !== "all") {
      filtered = filtered.filter(
        (event) => event.severity === filters.severity
      );
    }

    if (filters.type !== "all") {
      filtered = filtered.filter((event) => event.type === filters.type);
    }

    if (filters.status !== "all") {
      filtered = filtered.filter((event) => event.status === filters.status);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.tags.some((tag) =>
            tag.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    setFilteredData(filtered);
  }, [data, filters, searchTerm]);

  useEffect(() => {
    if (!isRealTime) return;

    const interval = setInterval(() => {
      const newEvent: TimelineEvent = {
        id: `event-${Date.now()}`,
        timestamp: new Date().toISOString(),
        time: new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        type: ["performance", "alert", "maintenance"][
          Math.floor(Math.random() * 3)
        ] as "performance" | "alert" | "maintenance",
        severity: ["low", "medium", "high"][Math.floor(Math.random() * 3)] as
          | "low"
          | "medium"
          | "high",
        title: "Real-time System Update",
        description: "System metrics updated in real-time",
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
        tags: ["real-time", "monitoring"],
        status: "active",
        impact: "low",
      };

      setFilteredData((prev) => [newEvent, ...prev.slice(0, 19)]);
    }, 15000);

    return () => clearInterval(interval);
  }, [isRealTime]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return colors.accent.red;
      case "high":
        return "#ff6b35";
      case "medium":
        return colors.accent.yellow;
      case "low":
        return colors.accent.teal;
      default:
        return colors.secondary;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "performance":
        return <Activity className="w-4 h-4" />;
      case "alert":
        return <AlertTriangle className="w-4 h-4" />;
      case "maintenance":
        return <CheckCircle className="w-4 h-4" />;
      case "deployment":
        return <Zap className="w-4 h-4" />;
      default:
        return <Info className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return colors.accent.red;
      case "resolved":
        return colors.accent.teal;
      case "investigating":
        return colors.accent.yellow;
      default:
        return colors.secondary;
    }
  };

  const getMetricIcon = (metric: string) => {
    switch (metric) {
      case "cpu":
        return <Cpu className="w-3 h-3" />;
      case "memory":
        return <Database className="w-3 h-3" />;
      case "network":
        return <Network className="w-3 h-3" />;
      case "disk":
        return <HardDrive className="w-3 h-3" />;
      default:
        return <BarChart3 className="w-3 h-3" />;
    }
  };

  const getMetricColor = (value: number, metric: string) => {
    const thresholds = {
      cpu: { high: 80, medium: 60 },
      memory: { high: 80, medium: 60 },
      network: { high: 80, medium: 60 },
      disk: { high: 80, medium: 60 },
      response: { high: 150, medium: 100 },
      errors: { high: 5, medium: 2 },
      throughput: { high: 80, medium: 60 },
      availability: { high: 99.5, medium: 99.0 },
    };

    const threshold = thresholds[metric as keyof typeof thresholds];
    if (!threshold) return colors.accent.teal;

    if (value >= threshold.high) return colors.accent.red;
    if (value >= threshold.medium) return colors.accent.yellow;
    return colors.accent.teal;
  };

  const formatMetricValue = (value: number, metric: string) => {
    switch (metric) {
      case "response":
        return `${value}ms`;
      case "errors":
        return `${value}`;
      case "throughput":
        return `${value} req/s`;
      case "availability":
        return `${value.toFixed(1)}%`;
      default:
        return `${value}%`;
    }
  };

  return (
    <div className="flex flex-col h-full">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div
          className="p-4 rounded-xl"
          style={{
            background: "var(--button-bg)",
            border: "1px solid var(--button-border)",
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3
                className="text-lg font-bold primary-text"
                style={{ fontFamily: "var(--font-mono)", fontWeight: 700 }}
              >
                Performance Timeline
              </h3>
              <p className="text-sm secondary-text">
                Real-time system events and performance metrics
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  isRealTime ? "bg-green-500 animate-pulse" : "bg-gray-400"
                }`}
              />
              <span className="text-xs secondary-text">
                {isRealTime ? "Live" : "Static"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 secondary-text" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 text-sm rounded-lg border"
                style={{
                  background: "var(--background)",
                  borderColor: "var(--button-border)",
                  color: "var(--primary-text)",
                }}
              />
            </div>

            <select
              value={filters.severity}
              onChange={(e) =>
                setFilters({ ...filters, severity: e.target.value })
              }
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
              <option value="low">Low</option>
            </select>

            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className="px-3 py-2 text-sm rounded-lg border"
              style={{
                background: "var(--background)",
                borderColor: "var(--button-border)",
                color: "var(--primary-text)",
              }}
            >
              <option value="all">All Types</option>
              <option value="performance">Performance</option>
              <option value="alert">Alert</option>
              <option value="maintenance">Maintenance</option>
              <option value="deployment">Deployment</option>
            </select>

            <div className="flex rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode("timeline")}
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  viewMode === "timeline" ? "primary-text" : "secondary-text"
                }`}
                style={{
                  background:
                    viewMode === "timeline"
                      ? "var(--accent-color)"
                      : "var(--button-bg)",
                }}
              >
                <Calendar className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("compact")}
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  viewMode === "compact" ? "primary-text" : "secondary-text"
                }`}
                style={{
                  background:
                    viewMode === "compact"
                      ? "var(--accent-color)"
                      : "var(--button-bg)",
                }}
              >
                <BarChart3 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="flex-1 overflow-y-auto scrollbar-hide" ref={timelineRef}>
        <AnimatePresence>
          {viewMode === "timeline" ? (
            <div className="relative">
              <div
                className="absolute left-6 top-0 bottom-0 w-0.5"
                style={{ background: colors.borderSecondary }}
              />

              {filteredData.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative mb-6"
                >
                  <motion.div
                    className="absolute left-4 w-4 h-4 rounded-full border-2 z-10"
                    style={{
                      background: getSeverityColor(event.severity),
                      borderColor: getSeverityColor(event.severity),
                    }}
                    whileHover={{ scale: 1.2 }}
                    onClick={() => setSelectedEvent(event)}
                  />

                  <motion.div
                    className="ml-12"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div
                      className="p-4 rounded-xl cursor-pointer"
                      style={{
                        background: "var(--button-bg)",
                        border: "1px solid var(--button-border)",
                        borderLeft: `4px solid ${getSeverityColor(event.severity)}`,
                      }}
                      onClick={() => setSelectedEvent(event)}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div
                            className="p-2 rounded-lg"
                            style={{
                              background: `${getSeverityColor(event.severity)}20`,
                              color: getSeverityColor(event.severity),
                            }}
                          >
                            {getTypeIcon(event.type)}
                          </div>
                          <div>
                            <h4
                              className="text-sm font-bold primary-text"
                              style={{ fontFamily: "var(--font-mono)" }}
                            >
                              {event.title}
                            </h4>
                            <div className="flex items-center space-x-2 text-xs secondary-text">
                              <Clock className="w-3 h-3" />
                              <span>{event.time}</span>
                              <span>•</span>
                              <span className="capitalize">{event.type}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <span
                            className="px-2 py-1 text-xs font-bold rounded-full"
                            style={{
                              background: `${getSeverityColor(event.severity)}20`,
                              color: getSeverityColor(event.severity),
                            }}
                          >
                            {event.severity.toUpperCase()}
                          </span>
                          <span
                            className="px-2 py-1 text-xs font-bold rounded-full"
                            style={{
                              background: `${getStatusColor(event.status)}20`,
                              color: getStatusColor(event.status),
                            }}
                          >
                            {event.status.toUpperCase()}
                          </span>
                        </div>
                      </div>

                      <p
                        className="text-sm secondary-text mb-3"
                        style={{ fontFamily: "var(--font-mono)" }}
                      >
                        {event.description}
                      </p>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                        {Object.entries(event.metrics).map(
                          ([metric, value]) => (
                            <div
                              key={metric}
                              className="flex items-center space-x-2 p-2 rounded-lg"
                              style={{
                                background: "var(--background)",
                                border: "1px solid var(--button-border)",
                              }}
                            >
                              <div
                                style={{
                                  color: getMetricColor(value, metric),
                                }}
                              >
                                {getMetricIcon(metric)}
                              </div>
                              <div className="flex-1">
                                <div className="text-xs secondary-text capitalize">
                                  {metric}
                                </div>
                                <div
                                  className="text-sm font-bold"
                                  style={{
                                    color: getMetricColor(value, metric),
                                    fontFamily: "var(--font-mono)",
                                  }}
                                >
                                  {formatMetricValue(value, metric)}
                                </div>
                              </div>
                            </div>
                          )
                        )}
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {event.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 text-xs rounded-full"
                            style={{
                              background: "var(--accent-color)20",
                              color: "var(--accent-color)",
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredData.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-3 rounded-lg cursor-pointer"
                  style={{
                    background: "var(--button-bg)",
                    border: "1px solid var(--button-border)",
                    borderLeft: `4px solid ${getSeverityColor(event.severity)}`,
                  }}
                  onClick={() => setSelectedEvent(event)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div
                        style={{
                          color: getSeverityColor(event.severity),
                        }}
                      >
                        {getTypeIcon(event.type)}
                      </div>
                      <div>
                        <div
                          className="text-sm font-bold primary-text"
                          style={{ fontFamily: "var(--font-mono)" }}
                        >
                          {event.title}
                        </div>
                        <div className="text-xs secondary-text">
                          {event.time} • {event.type}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div
                        className="text-sm font-bold"
                        style={{
                          color: getMetricColor(event.metrics.cpu, "cpu"),
                          fontFamily: "var(--font-mono)",
                        }}
                      >
                        CPU: {event.metrics.cpu}%
                      </div>
                      <div
                        className="text-sm font-bold"
                        style={{
                          color: getMetricColor(event.metrics.memory, "memory"),
                          fontFamily: "var(--font-mono)",
                        }}
                      >
                        MEM: {event.metrics.memory}%
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedEvent(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-2xl max-h-[80vh] overflow-y-auto p-6 rounded-xl"
              style={{
                background: "var(--background)",
                border: "1px solid var(--button-border)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3
                  className="text-xl font-bold primary-text"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  Event Details
                </h3>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="text-2xl secondary-text hover:primary-text"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h4
                    className="text-lg font-bold primary-text mb-2"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    {selectedEvent.title}
                  </h4>
                  <p className="text-sm secondary-text">
                    {selectedEvent.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-bold primary-text mb-2">
                      Details
                    </div>
                    <div className="space-y-1 text-sm secondary-text">
                      <div>Time: {selectedEvent.time}</div>
                      <div>Type: {selectedEvent.type}</div>
                      <div>Severity: {selectedEvent.severity}</div>
                      <div>Status: {selectedEvent.status}</div>
                      <div>Impact: {selectedEvent.impact}</div>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-bold primary-text mb-2">
                      Metrics
                    </div>
                    <div className="space-y-1">
                      {Object.entries(selectedEvent.metrics).map(
                        ([metric, value]) => (
                          <div
                            key={metric}
                            className="flex justify-between text-sm"
                          >
                            <span className="secondary-text capitalize">
                              {metric}:
                            </span>
                            <span
                              className="font-bold"
                              style={{
                                color: getMetricColor(value, metric),
                                fontFamily: "var(--font-mono)",
                              }}
                            >
                              {formatMetricValue(value, metric)}
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PerformanceTimeline;
