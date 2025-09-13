"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Cpu,
  Database,
  Network,
  HardDrive,
  Zap,
  BarChart3,
  Search,
} from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import type {
  TimelineEvent,
  FlexiblePerformanceTimelineProps,
} from "@/interfaces";

const FlexiblePerformanceTimeline: React.FC<
  FlexiblePerformanceTimelineProps
> = ({ data, isRealTime = false }) => {
  const { colors } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(
    null
  );
  const [viewMode, setViewMode] = useState<
    "flow" | "grid" | "compact" | "list"
  >("flow");
  const [filteredData, setFilteredData] = useState<TimelineEvent[]>(data);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    severity: "all",
    type: "all",
  });
  const [sortBy, setSortBy] = useState<"time" | "severity" | "type">("time");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  useEffect(() => {
    if (containerWidth < 400) {
      setViewMode("compact");
    } else if (containerWidth < 600) {
      setViewMode("grid");
    } else {
      setViewMode("flow");
    }
  }, [containerWidth]);

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

    if (searchTerm) {
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    filtered.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case "time":
          comparison =
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
          break;
        case "severity":
          const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
          comparison = severityOrder[a.severity] - severityOrder[b.severity];
          break;
        case "type":
          comparison = a.type.localeCompare(b.type);
          break;
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });

    setFilteredData(filtered);
  }, [data, filters, searchTerm, sortBy, sortOrder]);

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
        title: "Live System Update",
        description: "Real-time performance metrics update",
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
        tags: ["live", "monitoring"],
        status: "active",
        impact: "low",
      };

      setFilteredData((prev) => [newEvent, ...prev.slice(0, 19)]);
    }, 20000);

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
        return <Activity className="w-4 h-4" />;
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

  const renderFlowView = () => (
    <div className="relative">
      <div
        className="absolute left-8 top-0 bottom-0 w-0.5 opacity-30"
        style={{
          background: `linear-gradient(to bottom, ${colors.accent.blue}, ${colors.accent.teal}, ${colors.accent.yellow}, ${colors.accent.red})`,
        }}
      />

      <div className="space-y-4">
        {filteredData.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative"
          >
            <motion.div
              className="absolute left-6 w-4 h-4 rounded-full border-2 z-10"
              style={{
                background: getSeverityColor(event.severity),
                borderColor: getSeverityColor(event.severity),
                boxShadow: `0 0 10px ${getSeverityColor(event.severity)}40`,
              }}
              whileHover={{ scale: 1.3 }}
              onClick={() => setSelectedEvent(event)}
            />

            <motion.div
              className="ml-16"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div
                className="p-4 rounded-xl cursor-pointer transition-all duration-300"
                style={{
                  background: "var(--button-bg)",
                  border: "1px solid var(--button-border)",
                  borderLeft: `4px solid ${getSeverityColor(event.severity)}`,
                }}
                onClick={() => setSelectedEvent(event)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-5 h-5 p-2 rounded-lg"
                      style={{
                        background: `${getSeverityColor(event.severity)}20`,
                        color: getSeverityColor(event.severity),
                      }}
                    >
                      {getTypeIcon(event.type)}
                    </div>
                    <div className="flex-1">
                      <h4
                        className="text-base font-bold primary-text"
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
                  </div>
                </div>

                <p
                  className="text-sm secondary-text mb-3"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {event.description}
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
                  {Object.entries(event.metrics)
                    .slice(0, 4)
                    .map(([metric, value]) => (
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
                    ))}
                </div>

                <div className="flex flex-wrap gap-1">
                  {event.tags.slice(0, 3).map((tag) => (
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
    </div>
  );

  const renderGridView = () => {
    const getGridConfig = () => {
      if (containerWidth < 400) {
        return {
          columns: 1,
          gap: "gap-2",
          cardPadding: "p-3",
          showMetrics: false,
          showDescription: false,
          iconSize: "w-4 h-4",
          textSize: "text-sm",
        };
      } else if (containerWidth < 600) {
        return {
          columns: 2,
          gap: "gap-3",
          cardPadding: "p-3",
          showMetrics: true,
          showDescription: false,
          iconSize: "w-4 h-4",
          textSize: "text-sm",
        };
      } else if (containerWidth < 800) {
        return {
          columns: 3,
          gap: "gap-4",
          cardPadding: "p-4",
          showMetrics: true,
          showDescription: true,
          iconSize: "w-5 h-5",
          textSize: "text-base",
        };
      } else if (containerWidth < 1200) {
        return {
          columns: 4,
          gap: "gap-4",
          cardPadding: "p-4",
          showMetrics: true,
          showDescription: true,
          iconSize: "w-5 h-5",
          textSize: "text-base",
        };
      } else {
        return {
          columns: 5,
          gap: "gap-4",
          cardPadding: "p-4",
          showMetrics: true,
          showDescription: true,
          iconSize: "w-5 h-5",
          textSize: "text-base",
        };
      }
    };

    const gridConfig = getGridConfig();

    return (
      <div
        className={`grid ${gridConfig.gap} auto-rows-fr`}
        style={{
          gridTemplateColumns: `repeat(${gridConfig.columns}, minmax(0, 1fr))`,
        }}
      >
        {filteredData.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`${gridConfig.cardPadding} rounded-lg cursor-pointer h-full flex flex-col`}
            style={{
              background: "var(--button-bg)",
              border: "1px solid var(--button-border)",
              borderLeft: `4px solid ${getSeverityColor(event.severity)}`,
              minHeight: "120px",
            }}
            onClick={() => setSelectedEvent(event)}
          >
            <div className="flex items-start space-x-3 mb-3 flex-shrink-0">
              <div
                className={`${gridConfig.iconSize} p-2 rounded-lg flex-shrink-0`}
                style={{
                  color: getSeverityColor(event.severity),
                  background: `${getSeverityColor(event.severity)}20`,
                }}
              >
                {getTypeIcon(event.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div
                  className={`${gridConfig.textSize} font-bold primary-text leading-tight`}
                  style={{
                    fontFamily: "var(--font-mono)",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {event.title}
                </div>
                <div className="text-xs secondary-text mt-1">
                  {event.time} • {event.type}
                </div>
              </div>
            </div>

            {gridConfig.showDescription && (
              <div className="flex-1 mb-3">
                <p
                  className="text-xs secondary-text leading-relaxed"
                  style={{
                    fontFamily: "var(--font-mono)",
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {event.description}
                </p>
              </div>
            )}

            {gridConfig.showMetrics && (
              <div className="space-y-2 flex-shrink-0">
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <Cpu
                        className="w-3 h-3"
                        style={{
                          color: getMetricColor(event.metrics.cpu, "cpu"),
                        }}
                      />
                      <span className="text-xs secondary-text">CPU</span>
                    </div>
                    <span
                      className="text-xs font-bold"
                      style={{
                        color: getMetricColor(event.metrics.cpu, "cpu"),
                        fontFamily: "var(--font-mono)",
                      }}
                    >
                      {event.metrics.cpu}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <Database
                        className="w-3 h-3"
                        style={{
                          color: getMetricColor(event.metrics.memory, "memory"),
                        }}
                      />
                      <span className="text-xs secondary-text">Mem</span>
                    </div>
                    <span
                      className="text-xs font-bold"
                      style={{
                        color: getMetricColor(event.metrics.memory, "memory"),
                        fontFamily: "var(--font-mono)",
                      }}
                    >
                      {event.metrics.memory}%
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-1 mt-3 flex-shrink-0">
              {event.tags.slice(0, 2).map((tag) => (
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

            <div className="mt-3 flex justify-end flex-shrink-0">
              <span
                className="px-2 py-1 text-xs font-bold rounded-full"
                style={{
                  background: `${getSeverityColor(event.severity)}20`,
                  color: getSeverityColor(event.severity),
                }}
              >
                {event.severity.toUpperCase()}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    );
  };

  const renderCompactView = () => (
    <div className="space-y-2">
      {filteredData.map((event, index) => (
        <motion.div
          key={event.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.03 }}
          className="flex items-center justify-between p-2 rounded-lg cursor-pointer"
          style={{
            background: "var(--button-bg)",
            border: "1px solid var(--button-border)",
            borderLeft: `3px solid ${getSeverityColor(event.severity)}`,
          }}
          onClick={() => setSelectedEvent(event)}
        >
          <div className="flex items-center space-x-2">
            <div
              style={{
                color: getSeverityColor(event.severity),
              }}
            >
              {getTypeIcon(event.type)}
            </div>
            <div>
              <div
                className="text-sm font-bold primary-text truncate"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {event.title}
              </div>
              <div className="text-xs secondary-text">{event.time}</div>
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
              {event.metrics.cpu}%
            </div>
            <div
              className="text-sm font-bold"
              style={{
                color: getMetricColor(event.metrics.memory, "memory"),
                fontFamily: "var(--font-mono)",
              }}
            >
              {event.metrics.memory}%
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );

  const renderListView = () => {
    if (containerWidth < 600) {
      return (
        <div className="space-y-2">
          {filteredData.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.02 }}
              className="p-3 rounded-lg cursor-pointer"
              style={{
                background: "var(--button-bg)",
                border: "1px solid var(--button-border)",
                borderLeft: `4px solid ${getSeverityColor(event.severity)}`,
              }}
              onClick={() => setSelectedEvent(event)}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div
                    className="p-1 rounded"
                    style={{
                      color: getSeverityColor(event.severity),
                      background: `${getSeverityColor(event.severity)}20`,
                    }}
                  >
                    {getTypeIcon(event.type)}
                  </div>
                  <div>
                    <div
                      className="font-bold primary-text text-sm"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      {event.title}
                    </div>
                    <div className="text-xs secondary-text">{event.time}</div>
                  </div>
                </div>
                <span
                  className="px-2 py-1 text-xs font-bold rounded-full"
                  style={{
                    background: `${getSeverityColor(event.severity)}20`,
                    color: getSeverityColor(event.severity),
                  }}
                >
                  {event.severity.toUpperCase()}
                </span>
              </div>
              <div className="text-xs secondary-text mb-2">
                {event.description}
              </div>
              <div className="flex justify-between text-sm">
                <div className="flex items-center space-x-1">
                  <Cpu
                    className="w-3 h-3"
                    style={{ color: getMetricColor(event.metrics.cpu, "cpu") }}
                  />
                  <span
                    style={{
                      color: getMetricColor(event.metrics.cpu, "cpu"),
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    {event.metrics.cpu}%
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <Database
                    className="w-3 h-3"
                    style={{
                      color: getMetricColor(event.metrics.memory, "memory"),
                    }}
                  />
                  <span
                    style={{
                      color: getMetricColor(event.metrics.memory, "memory"),
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    {event.metrics.memory}%
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      );
    }

    return (
      <div className="space-y-1">
        <div
          className="grid grid-cols-12 gap-2 p-3 rounded-lg font-bold text-sm sticky top-0 z-20"
          style={{
            background: "var(--background)",
            border: "1px solid var(--button-border)",
            backdropFilter: "blur(10px)",
          }}
        >
          <div className="col-span-1 primary-text">Type</div>
          <div className="col-span-4 primary-text">Event</div>
          <div className="col-span-2 primary-text">Time</div>
          <div className="col-span-1 primary-text">Severity</div>
          <div className="col-span-2 primary-text">CPU</div>
          <div className="col-span-2 primary-text">Memory</div>
        </div>

        {filteredData.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.02 }}
            className="grid grid-cols-12 gap-2 p-3 rounded-lg cursor-pointer hover:scale-[1.01] transition-all duration-200 min-h-[60px]"
            style={{
              background: "var(--button-bg)",
              border: "1px solid var(--button-border)",
              borderLeft: `4px solid ${getSeverityColor(event.severity)}`,
            }}
            onClick={() => setSelectedEvent(event)}
          >
            <div className="col-span-1 flex items-center">
              <div
                className="p-1 rounded"
                style={{
                  color: getSeverityColor(event.severity),
                  background: `${getSeverityColor(event.severity)}20`,
                }}
              >
                {getTypeIcon(event.type)}
              </div>
            </div>

            <div className="col-span-4">
              <div
                className="font-bold primary-text truncate"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {event.title}
              </div>
              <div className="text-xs secondary-text truncate">
                {event.description}
              </div>
              <div className="flex flex-wrap gap-1 mt-1">
                {event.tags.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className="px-1 py-0.5 text-xs rounded"
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

            <div className="col-span-2 flex items-center">
              <div
                className="text-sm secondary-text"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {event.time}
              </div>
            </div>

            <div className="col-span-1 flex items-center">
              <span
                className="px-2 py-1 text-xs font-bold rounded-full"
                style={{
                  background: `${getSeverityColor(event.severity)}20`,
                  color: getSeverityColor(event.severity),
                }}
              >
                {event.severity.toUpperCase()}
              </span>
            </div>

            <div className="col-span-2 flex items-center">
              <div className="flex items-center space-x-2">
                <Cpu
                  className="w-3 h-3"
                  style={{ color: getMetricColor(event.metrics.cpu, "cpu") }}
                />
                <div
                  className="text-sm font-bold"
                  style={{
                    color: getMetricColor(event.metrics.cpu, "cpu"),
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  {event.metrics.cpu}%
                </div>
              </div>
            </div>

            <div className="col-span-2 flex items-center">
              <div className="flex items-center space-x-2">
                <Database
                  className="w-3 h-3"
                  style={{
                    color: getMetricColor(event.metrics.memory, "memory"),
                  }}
                />
                <div
                  className="text-sm font-bold"
                  style={{
                    color: getMetricColor(event.metrics.memory, "memory"),
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  {event.metrics.memory}%
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        {filteredData.length === 0 && (
          <div
            className="p-8 text-center rounded-lg"
            style={{
              background: "var(--button-bg)",
              border: "1px solid var(--button-border)",
            }}
          >
            <div className="text-lg primary-text mb-2">No events found</div>
            <div className="text-sm secondary-text">
              Try adjusting your search or filter criteria
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div ref={containerRef} className="flex flex-col h-full">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4"
      >
        <div
          className="p-3 rounded-xl"
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
                Performance Timeline
              </h3>
              <p className="text-sm secondary-text">
                {containerWidth < 400
                  ? "Compact view"
                  : "Real-time system events"}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  isRealTime ? "bg-green-500 animate-pulse" : "bg-gray-400"
                }`}
              />
              <span className="text-xs secondary-text">
                {isRealTime ? "Live" : "Static"}
              </span>
            </div>
          </div>

          {containerWidth >= 500 && (
            <div className="flex items-center space-x-1 mb-3">
              <button
                onClick={() => setViewMode("flow")}
                className={`px-3 py-2 text-sm font-medium transition-colors rounded-lg ${
                  viewMode === "flow" ? "primary-text" : "secondary-text"
                }`}
                style={{
                  background:
                    viewMode === "flow"
                      ? "var(--accent-color)20"
                      : "transparent",
                }}
              >
                Flow
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`px-3 py-2 text-sm font-medium transition-colors rounded-lg ${
                  viewMode === "grid" ? "primary-text" : "secondary-text"
                }`}
                style={{
                  background:
                    viewMode === "grid"
                      ? "var(--accent-color)20"
                      : "transparent",
                }}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`px-3 py-2 text-sm font-medium transition-colors rounded-lg ${
                  viewMode === "list" ? "primary-text" : "secondary-text"
                }`}
                style={{
                  background:
                    viewMode === "list"
                      ? "var(--accent-color)20"
                      : "transparent",
                }}
              >
                List
              </button>
              <button
                onClick={() => setViewMode("compact")}
                className={`px-3 py-2 text-sm font-medium transition-colors rounded-lg ${
                  viewMode === "compact" ? "primary-text" : "secondary-text"
                }`}
                style={{
                  background:
                    viewMode === "compact"
                      ? "var(--accent-color)20"
                      : "transparent",
                }}
              >
                Compact
              </button>
            </div>
          )}

          {containerWidth >= 400 && (
            <div className="flex flex-wrap gap-2">
              <div className="relative flex-1 min-w-0">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 secondary-text" />
                <input
                  type="text"
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 text-sm rounded-lg border"
                  style={{
                    background: "var(--background)",
                    borderColor: "var(--button-border)",
                    color: "var(--primary-text)",
                  }}
                />
              </div>

              {containerWidth >= 600 && (
                <>
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
                    onChange={(e) =>
                      setFilters({ ...filters, type: e.target.value })
                    }
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
                </>
              )}

              {viewMode === "list" && containerWidth >= 700 && (
                <>
                  <select
                    value={sortBy}
                    onChange={(e) =>
                      setSortBy(e.target.value as "time" | "severity" | "type")
                    }
                    className="px-3 py-2 text-sm rounded-lg border"
                    style={{
                      background: "var(--background)",
                      borderColor: "var(--button-border)",
                      color: "var(--primary-text)",
                    }}
                  >
                    <option value="time">Sort by Time</option>
                    <option value="severity">Sort by Severity</option>
                    <option value="type">Sort by Type</option>
                  </select>

                  <button
                    onClick={() =>
                      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                    }
                    className="px-3 py-2 text-sm rounded-lg border"
                    style={{
                      background: "var(--background)",
                      borderColor: "var(--button-border)",
                      color: "var(--primary-text)",
                    }}
                  >
                    {sortOrder === "asc" ? "↑" : "↓"}
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </motion.div>

      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <AnimatePresence mode="wait">
          {viewMode === "flow" && (
            <motion.div
              key="flow"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {renderFlowView()}
            </motion.div>
          )}
          {viewMode === "grid" && (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {renderGridView()}
            </motion.div>
          )}
          {viewMode === "list" && (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {renderListView()}
            </motion.div>
          )}
          {viewMode === "compact" && (
            <motion.div
              key="compact"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {renderCompactView()}
            </motion.div>
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
                </div>{" "}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FlexiblePerformanceTimeline;
