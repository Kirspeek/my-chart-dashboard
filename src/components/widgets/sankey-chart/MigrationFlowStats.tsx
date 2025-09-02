"use client";

import React from "react";
import { useTheme } from "@/hooks/useTheme";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Users,
  Globe,
  ArrowRight,
  Activity,
} from "lucide-react";

interface MigrationFlowStatsProps {
  data: Array<{ from: string; to: string; size: number }>;
  selectedFlow: string | null;
  isMobile?: boolean;
}

interface FlowStats {
  totalFlows: number;
  totalMigration: number;
  largestFlow: { from: string; to: string; size: number };
  smallestFlow: { from: string; to: string; size: number };
  topFlows: Array<{ from: string; to: string; size: number }>;
  continentStats: Record<
    string,
    { outgoing: number; incoming: number; net: number }
  >;
}

export default function MigrationFlowStats({
  data,
  selectedFlow,
}: MigrationFlowStatsProps) {
  const { colors, colorsTheme } = useTheme();
  const sankeyChartColors = colorsTheme.widgets.sankeyChart;

  // Calculate comprehensive statistics
  const stats: FlowStats = React.useMemo(() => {
    const totalFlows = data.length;
    const totalMigration = data.reduce((sum, flow) => sum + flow.size, 0);

    const largestFlow = data.reduce(
      (max, flow) => (flow.size > max.size ? flow : max),
      data[0]
    );
    const smallestFlow = data.reduce(
      (min, flow) => (flow.size < min.size ? flow : min),
      data[0]
    );

    const topFlows = [...data].sort((a, b) => b.size - a.size).slice(0, 5);

    // Calculate continent statistics
    const continentStats: Record<
      string,
      { outgoing: number; incoming: number; net: number }
    > = {};

    data.forEach((flow) => {
      // Initialize if not exists
      if (!continentStats[flow.from]) {
        continentStats[flow.from] = { outgoing: 0, incoming: 0, net: 0 };
      }
      if (!continentStats[flow.to]) {
        continentStats[flow.to] = { outgoing: 0, incoming: 0, net: 0 };
      }

      // Add flows
      continentStats[flow.from].outgoing += flow.size;
      continentStats[flow.to].incoming += flow.size;
    });

    // Calculate net flows
    Object.keys(continentStats).forEach((continent) => {
      continentStats[continent].net =
        continentStats[continent].incoming - continentStats[continent].outgoing;
    });

    return {
      totalFlows,
      totalMigration,
      largestFlow,
      smallestFlow,
      topFlows,
      continentStats,
    };
  }, [data]);

  const getTrendIcon = (value: number) => {
    if (value > 0)
      return (
        <TrendingUp
          className="w-4 h-4"
          style={{ color: sankeyChartColors.stats.trend.positive }}
        />
      );
    if (value < 0)
      return (
        <TrendingDown
          className="w-4 h-4"
          style={{ color: sankeyChartColors.stats.trend.negative }}
        />
      );
    return <Minus className="w-4 h-4" style={{ color: colors.secondary }} />;
  };

  const getContinentColor = (continent: string) => {
    const colors = [
      sankeyChartColors.stats.background.primary, // Very Light Indigo
      sankeyChartColors.stats.background.secondary, // Very Light Green
      sankeyChartColors.stats.background.tertiary, // Very Light Yellow
      sankeyChartColors.stats.background.quaternary, // Very Light Red
      sankeyChartColors.stats.background.quinary, // Very Light Purple
      sankeyChartColors.stats.background.senary, // Very Light Emerald
    ];
    const index = continent.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <div className="w-full space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-4">
        <div
          className="p-4 rounded-2xl relative overflow-hidden"
          style={{
            background: "rgba(255, 255, 255, 0.05)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(8px)",
            boxShadow: "0 4px 16px rgba(0, 0, 0, 0.05)",
          }}
        >
          <div className="flex items-center space-x-3">
            <div
              className="flex items-center justify-center w-12 h-12 rounded-xl"
              style={{
                background: sankeyChartColors.button.background,
                boxShadow: "0 2px 8px rgba(129, 140, 248, 0.2)",
              }}
            >
              <Globe
                className="w-6 h-6"
                style={{ color: sankeyChartColors.stats.text }}
              />
            </div>
            <div>
              <div
                className="text-2xl font-bold"
                style={{
                  color: colors.primary,
                  fontFamily: "var(--font-mono)",
                  fontWeight: 800,
                }}
              >
                {stats.totalFlows}
              </div>
              <div
                className="text-sm font-medium"
                style={{
                  color: colors.secondary,
                  fontFamily: "var(--font-mono)",
                  fontWeight: 600,
                }}
              >
                Total Flows
              </div>
            </div>
          </div>
        </div>

        <div
          className="p-4 rounded-2xl relative overflow-hidden"
          style={{
            background: "rgba(255, 255, 255, 0.05)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(8px)",
            boxShadow: "0 4px 16px rgba(0, 0, 0, 0.05)",
          }}
        >
          <div className="flex items-center space-x-3">
            <div
              className="flex items-center justify-center w-12 h-12 rounded-xl"
              style={{
                background: sankeyChartColors.stats.trend.positive,
                boxShadow: "0 2px 8px rgba(52, 211, 153, 0.2)",
              }}
            >
              <Users
                className="w-6 h-6"
                style={{ color: sankeyChartColors.stats.text }}
              />
            </div>
            <div>
              <div
                className="text-2xl font-bold"
                style={{
                  color: colors.primary,
                  fontFamily: "var(--font-mono)",
                  fontWeight: 800,
                }}
              >
                {stats.totalMigration.toFixed(1)}M
              </div>
              <div
                className="text-sm font-medium"
                style={{
                  color: colors.secondary,
                  fontFamily: "var(--font-mono)",
                  fontWeight: 600,
                }}
              >
                Total Migration
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Flows */}
      <div
        className="p-6 rounded-2xl"
        style={{
          background: "rgba(255, 255, 255, 0.05)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(8px)",
          boxShadow: "0 4px 16px rgba(0, 0, 0, 0.05)",
        }}
      >
        <div
          className="text-lg font-bold mb-4 flex items-center space-x-3"
          style={{
            color: colors.primary,
            fontFamily: "var(--font-mono)",
            fontWeight: 800,
          }}
        >
          <div
            className="flex items-center justify-center w-8 h-8 rounded-lg"
            style={{
              background: sankeyChartColors.stats.background.quinary,
              boxShadow: "0 1px 4px rgba(139, 92, 246, 0.2)",
            }}
          >
            <Activity
              className="w-4 h-4"
              style={{ color: sankeyChartColors.stats.text }}
            />
          </div>
          <span>Top Migration Flows</span>
        </div>

        <div className="space-y-3">
          {stats.topFlows.map((flow, index) => (
            <div
              key={`${flow.from}-${flow.to}`}
              className="flex items-center justify-between p-4 rounded-xl transition-all duration-300 hover:shadow-lg"
              style={{
                background:
                  selectedFlow === `${flow.from}→${flow.to}`
                    ? "rgba(129, 140, 248, 0.1)"
                    : "rgba(255, 255, 255, 0.05)",
                border:
                  selectedFlow === `${flow.from}→${flow.to}`
                    ? "1px solid rgba(129, 140, 248, 0.2)"
                    : "1px solid rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(8px)",
              }}
            >
              <div className="flex items-center space-x-3">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{
                    background: `linear-gradient(135deg, ${getContinentColor(flow.from)}, ${getContinentColor(flow.to)})`,
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                  }}
                />
                <span
                  className="text-sm font-bold"
                  style={{
                    color: colors.primary,
                    fontFamily: "var(--font-mono)",
                    fontWeight: 700,
                  }}
                >
                  {flow.from}
                </span>
                <ArrowRight
                  className="w-4 h-4"
                  style={{ color: colors.secondary }}
                />
                <span
                  className="text-sm font-bold"
                  style={{
                    color: colors.primary,
                    fontFamily: "var(--font-mono)",
                    fontWeight: 700,
                  }}
                >
                  {flow.to}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <span
                  className="text-lg font-bold"
                  style={{
                    color: colors.primary,
                    fontFamily: "var(--font-mono)",
                    fontWeight: 800,
                  }}
                >
                  {flow.size}M
                </span>
                {index === 0 && (
                  <div
                    className="px-3 py-1 rounded-full text-xs font-bold"
                    style={{
                      background: sankeyChartColors.button.background,
                      color: sankeyChartColors.stats.text,
                      fontFamily: "var(--font-mono)",
                      boxShadow: "0 1px 4px rgba(129, 140, 248, 0.2)",
                    }}
                  >
                    #1
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Continent Statistics */}
      <div
        className="p-6 rounded-2xl"
        style={{
          background:
            "linear-gradient(135deg, rgba(6, 182, 212, 0.1), rgba(14, 165, 233, 0.1))",
          border: "1px solid rgba(6, 182, 212, 0.2)",
          backdropFilter: "blur(12px)",
          boxShadow:
            "0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
        }}
      >
        <div
          className="text-lg font-bold mb-4"
          style={{
            color: colors.primary,
            fontFamily: "var(--font-mono)",
            fontWeight: 800,
          }}
        >
          Continent Net Flows
        </div>

        <div className="space-y-3">
          {Object.entries(stats.continentStats)
            .sort(([, a], [, b]) => Math.abs(b.net) - Math.abs(a.net))
            .map(([continent, stats]) => (
              <div
                key={continent}
                className="flex items-center justify-between p-4 rounded-xl transition-all duration-300 hover:shadow-lg"
                style={{
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  backdropFilter: "blur(8px)",
                }}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{
                      background: `linear-gradient(135deg, ${getContinentColor(continent)}, ${getContinentColor(continent)}dd)`,
                      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                    }}
                  />
                  <span
                    className="text-sm font-bold"
                    style={{
                      color: colors.primary,
                      fontFamily: "var(--font-mono)",
                      fontWeight: 700,
                    }}
                  >
                    {continent}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  {getTrendIcon(stats.net)}
                  <span
                    className="text-lg font-bold"
                    style={{
                      color:
                        stats.net > 0
                          ? sankeyChartColors.stats.trend.positive
                          : stats.net < 0
                            ? sankeyChartColors.stats.trend.negative
                            : colors.secondary,
                      fontFamily: "var(--font-mono)",
                      fontWeight: 800,
                    }}
                  >
                    {stats.net > 0 ? "+" : ""}
                    {stats.net.toFixed(1)}M
                  </span>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
