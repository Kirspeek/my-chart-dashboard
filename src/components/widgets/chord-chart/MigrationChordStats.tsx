"use client";

import React from "react";
import { useTheme } from "@/hooks/useTheme";
import { useGlobalTooltip } from "@/hooks/useGlobalTooltip";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Globe,
  Users,
  ArrowRight,
  Star,
  Activity,
} from "lucide-react";
import type { WidgetChordChartData } from "@/interfaces/widgets";

interface MigrationChordStatsProps {
  data: WidgetChordChartData[];
  selectedFlow?: string | null;
  setSelectedFlow?: (flow: string | null) => void;
}

export default function MigrationChordStats({
  data,
  selectedFlow,
  setSelectedFlow,
}: MigrationChordStatsProps) {
  const { colors } = useTheme();
  const { createTooltipHandlers } = useGlobalTooltip();

  // Calculate statistics
  const totalFlows = data.length;
  const totalMigration = data.reduce((sum, flow) => sum + flow.size, 0);
  const avgMigration = totalMigration / totalFlows;

  // Get top flows
  const topFlows = [...data].sort((a, b) => b.size - a.size).slice(0, 5);

  // Calculate net flows by continent
  const continentFlows = data.reduce(
    (acc, flow) => {
      acc[flow.from] = (acc[flow.from] || 0) - flow.size;
      acc[flow.to] = (acc[flow.to] || 0) + flow.size;
      return acc;
    },
    {} as Record<string, number>
  );

  const netFlows = Object.entries(continentFlows)
    .map(([continent, net]) => ({ continent, net }))
    .sort((a, b) => Math.abs(b.net) - Math.abs(a.net));

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Migration */}
        <div
          className="relative p-6 rounded-2xl overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${colors.accent.blue}15, ${colors.accent.blue}05)`,
            border: `1px solid ${colors.accent.blue}25`,
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <div
              className="p-3 rounded-xl"
              style={{ backgroundColor: `${colors.accent.blue}20` }}
            >
              <Globe size={20} style={{ color: colors.accent.blue }} />
            </div>
            <div
              className="w-3 h-3 rounded-full animate-pulse"
              style={{ backgroundColor: colors.accent.blue }}
            />
          </div>
          <h3
            className="text-2xl font-bold mb-1"
            style={{ color: colors.primary }}
          >
            {totalMigration.toFixed(1)}M
          </h3>
          <p
            className="text-sm font-medium"
            style={{ color: colors.secondary }}
          >
            Total Migration
          </p>
          {/* Decorative elements */}
          <div
            className="absolute -top-4 -right-4 w-16 h-16 rounded-full opacity-10"
            style={{ backgroundColor: colors.accent.blue }}
          />
        </div>

        {/* Average Flow */}
        <div
          className="relative p-6 rounded-2xl overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${colors.accent.teal}15, ${colors.accent.teal}05)`,
            border: `1px solid ${colors.accent.teal}25`,
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <div
              className="p-3 rounded-xl"
              style={{ backgroundColor: `${colors.accent.teal}20` }}
            >
              <Activity size={20} style={{ color: colors.accent.teal }} />
            </div>
            <div
              className="w-3 h-3 rounded-full animate-pulse"
              style={{ backgroundColor: colors.accent.teal }}
            />
          </div>
          <h3
            className="text-2xl font-bold mb-1"
            style={{ color: colors.primary }}
          >
            {avgMigration.toFixed(1)}M
          </h3>
          <p
            className="text-sm font-medium"
            style={{ color: colors.secondary }}
          >
            Average Flow
          </p>
          {/* Decorative elements */}
          <div
            className="absolute -bottom-4 -left-4 w-12 h-12 rounded-full opacity-10"
            style={{ backgroundColor: colors.accent.teal }}
          />
        </div>

        {/* Total Flows */}
        <div
          className="relative p-6 rounded-2xl overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${colors.accent.yellow}15, ${colors.accent.yellow}05)`,
            border: `1px solid ${colors.accent.yellow}25`,
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <div
              className="p-3 rounded-xl"
              style={{ backgroundColor: `${colors.accent.yellow}20` }}
            >
              <Users size={20} style={{ color: colors.accent.yellow }} />
            </div>
            <div
              className="w-3 h-3 rounded-full animate-pulse"
              style={{ backgroundColor: colors.accent.yellow }}
            />
          </div>
          <h3
            className="text-2xl font-bold mb-1"
            style={{ color: colors.primary }}
          >
            {totalFlows}
          </h3>
          <p
            className="text-sm font-medium"
            style={{ color: colors.secondary }}
          >
            Total Flows
          </p>
          {/* Decorative elements */}
          <div
            className="absolute -top-2 -right-2 w-8 h-8 rounded-full opacity-10"
            style={{ backgroundColor: colors.accent.yellow }}
          />
        </div>
      </div>

      {/* Top Migration Flows */}
      <div
        className="p-6 rounded-2xl"
        style={{
          background: `linear-gradient(135deg, ${colors.accent.blue}10, ${colors.accent.blue}05)`,
          border: `1px solid ${colors.accent.blue}20`,
        }}
      >
        <div className="flex items-center space-x-2 mb-4">
          <Star size={18} style={{ color: colors.accent.blue }} />
          <h3 className="text-lg font-bold" style={{ color: colors.primary }}>
            Top Migration Flows
          </h3>
        </div>
        <div className="space-y-3">
          {topFlows.map((flow, index) => {
            const isSelected = selectedFlow === `${flow.from}→${flow.to}`;
            const tooltipHandlers = createTooltipHandlers(
              `${flow.from} → ${flow.to}: ${flow.size}M people`
            );

            return (
              <button
                key={`${flow.from}-${flow.to}`}
                onClick={() =>
                  setSelectedFlow?.(
                    isSelected ? null : `${flow.from}→${flow.to}`
                  )
                }
                className={`w-full p-3 rounded-xl transition-all duration-200 ${
                  isSelected
                    ? "shadow-lg transform scale-102"
                    : "hover:scale-101 hover:shadow-md"
                }`}
                style={{
                  background: isSelected
                    ? `linear-gradient(135deg, ${colors.accent.blue}20, ${colors.accent.blue}10)`
                    : `linear-gradient(135deg, ${colors.accent.blue}10, ${colors.accent.blue}05)`,
                  border: `1px solid ${colors.accent.blue}30`,
                }}
                {...tooltipHandlers}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                      style={{
                        backgroundColor: `${colors.accent.blue}20`,
                        color: colors.accent.blue,
                      }}
                    >
                      {index + 1}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span
                        className="font-medium"
                        style={{ color: colors.primary }}
                      >
                        {flow.from}
                      </span>
                      <ArrowRight
                        size={14}
                        style={{ color: colors.secondary }}
                      />
                      <span
                        className="font-medium"
                        style={{ color: colors.primary }}
                      >
                        {flow.to}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span
                      className="text-lg font-bold"
                      style={{ color: colors.accent.blue }}
                    >
                      {flow.size}M
                    </span>
                    {isSelected && (
                      <div
                        className="w-2 h-2 rounded-full animate-pulse"
                        style={{ backgroundColor: colors.accent.blue }}
                      />
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Net Flow Analysis */}
      <div
        className="p-6 rounded-2xl"
        style={{
          background: `linear-gradient(135deg, ${colors.accent.red}10, ${colors.accent.red}05)`,
          border: `1px solid ${colors.accent.red}20`,
        }}
      >
        <div className="flex items-center space-x-2 mb-4">
          <TrendingUp size={18} style={{ color: colors.accent.red }} />
          <h3 className="text-lg font-bold" style={{ color: colors.primary }}>
            Net Flow Analysis
          </h3>
        </div>
        <div className="space-y-3">
          {netFlows.map(({ continent, net }) => {
            const isPositive = net > 0;
            const isNegative = net < 0;
            const isNeutral = net === 0;

            return (
              <div
                key={continent}
                className="flex items-center justify-between p-3 rounded-xl"
                style={{
                  background: `linear-gradient(135deg, ${
                    isPositive
                      ? colors.accent.teal
                      : isNegative
                        ? colors.accent.red
                        : colors.accent.yellow
                  }10, ${
                    isPositive
                      ? colors.accent.teal
                      : isNegative
                        ? colors.accent.red
                        : colors.accent.yellow
                  }05)`,
                  border: `1px solid ${
                    isPositive
                      ? colors.accent.teal
                      : isNegative
                        ? colors.accent.red
                        : colors.accent.yellow
                  }25`,
                }}
              >
                <span className="font-medium" style={{ color: colors.primary }}>
                  {continent}
                </span>
                <div className="flex items-center space-x-2">
                  {isPositive && (
                    <TrendingUp
                      size={16}
                      style={{ color: colors.accent.teal }}
                    />
                  )}
                  {isNegative && (
                    <TrendingDown
                      size={16}
                      style={{ color: colors.accent.red }}
                    />
                  )}
                  {isNeutral && (
                    <Minus size={16} style={{ color: colors.accent.yellow }} />
                  )}
                  <span
                    className="font-bold"
                    style={{
                      color: isPositive
                        ? colors.accent.teal
                        : isNegative
                          ? colors.accent.red
                          : colors.accent.yellow,
                    }}
                  >
                    {isPositive ? "+" : ""}
                    {net.toFixed(1)}M
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Legend */}
      <div
        className="p-4 rounded-xl"
        style={{
          background: `linear-gradient(135deg, ${colors.accent.blue}10, ${colors.accent.blue}05)`,
          border: `1px solid ${colors.accent.blue}25`,
        }}
      >
        <p
          className="text-sm font-medium text-center"
          style={{ color: colors.secondary }}
        >
          💡 Click on any flow above to highlight it in the visualization
        </p>
      </div>
    </div>
  );
}
