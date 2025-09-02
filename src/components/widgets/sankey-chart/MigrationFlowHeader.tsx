"use client";

import React from "react";
import { WidgetTitle } from "../../common";
import { useTheme } from "@/hooks/useTheme";
import { Globe, TrendingUp, Users, MapPin } from "lucide-react";

interface MigrationFlowHeaderProps {
  title: string;
  subtitle?: string;
  isMobile?: boolean;
  totalFlows?: number;
  totalMigration?: number;
  selectedFlow?: string | null;
}

export default function MigrationFlowHeader({
  title,
  subtitle,
  isMobile = false,
  totalFlows = 0,
  totalMigration = 0,
  selectedFlow,
}: MigrationFlowHeaderProps) {
  const { colors, isDark, colorsTheme } = useTheme();
  const sankeyChartColors = colorsTheme.widgets.sankeyChart;

  return (
    <div className="w-full">
      <WidgetTitle
        title={title}
        subtitle={subtitle}
        variant={isMobile ? "centered" : "default"}
        size="md"
      />

      {/* Enhanced Stats Bar */}
      <div
        className="mt-4 p-4 rounded-2xl relative overflow-hidden"
        style={{
          background: isDark
            ? "rgba(255, 255, 255, 0.08)"
            : "rgba(255, 255, 255, 0.05)",
          border: isDark
            ? "1px solid rgba(255, 255, 255, 0.15)"
            : "1px solid rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(8px)",
          boxShadow: isDark
            ? "0 4px 16px rgba(0, 0, 0, 0.2)"
            : "0 4px 16px rgba(0, 0, 0, 0.05)",
        }}
      >
        {/* Animated background effect */}
        <div className="absolute inset-0 opacity-3">
          <div
            className="absolute top-0 left-0 w-16 h-16 rounded-full animate-pulse"
            style={{
              backgroundColor: isDark
                ? sankeyChartColors.header.background.primary
                : sankeyChartColors.header.background.secondary,
              animationDelay: "0s",
            }}
          />
          <div
            className="absolute bottom-0 right-0 w-12 h-12 rounded-full animate-pulse"
            style={{
              backgroundColor: isDark
                ? sankeyChartColors.header.background.secondary
                : sankeyChartColors.header.background.primary,
              animationDelay: "1s",
            }}
          />
        </div>

        <div className="relative z-10 flex items-center justify-between">
          {/* Left side - Global stats */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3">
              <div
                className="flex items-center justify-center w-10 h-10 rounded-xl"
                style={{
                  background: colors.accent.blue,
                  boxShadow: `0 2px 8px ${colors.accent.blue}40`,
                }}
              >
                <Globe
                  className="w-5 h-5"
                  style={{ color: sankeyChartColors.header.icon.primary }}
                />
              </div>
              <div>
                <span
                  className="text-lg font-bold"
                  style={{
                    color: colors.primary,
                    fontFamily: "var(--font-mono)",
                    fontWeight: 800,
                  }}
                >
                  {totalFlows}
                </span>
                <div
                  className="text-xs font-medium"
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

            <div className="flex items-center space-x-3">
              <div
                className="flex items-center justify-center w-10 h-10 rounded-xl"
                style={{
                  background: colors.accent.teal,
                  boxShadow: `0 2px 8px ${colors.accent.teal}40`,
                }}
              >
                <Users
                  className="w-5 h-5"
                  style={{ color: sankeyChartColors.header.icon.primary }}
                />
              </div>
              <div>
                <span
                  className="text-lg font-bold"
                  style={{
                    color: colors.primary,
                    fontFamily: "var(--font-mono)",
                    fontWeight: 800,
                  }}
                >
                  {totalMigration.toFixed(1)}M
                </span>
                <div
                  className="text-xs font-medium"
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

          {/* Right side - Selected flow info */}
          {selectedFlow && (
            <div className="flex items-center space-x-3">
              <div
                className="flex items-center justify-center w-8 h-8 rounded-lg"
                style={{
                  background: colors.accent.yellow,
                  boxShadow: `0 1px 4px ${colors.accent.yellow}40`,
                }}
              >
                <MapPin
                  className="w-4 h-4"
                  style={{ color: sankeyChartColors.header.icon.secondary }}
                />
              </div>
              <div>
                <span
                  className="text-sm font-bold"
                  style={{
                    color: colors.primary,
                    fontFamily: "var(--font-mono)",
                    fontWeight: 700,
                  }}
                >
                  Selected Flow
                </span>
                <div
                  className="text-xs font-medium"
                  style={{
                    color: colors.secondary,
                    fontFamily: "var(--font-mono)",
                    fontWeight: 600,
                  }}
                >
                  {selectedFlow}
                </div>
              </div>
            </div>
          )}

          {/* Global trend indicator */}
          <div className="flex items-center space-x-2">
            <div
              className="flex items-center justify-center w-8 h-8 rounded-lg"
              style={{
                background: colors.accent.red,
                boxShadow: `0 1px 4px ${colors.accent.red}40`,
              }}
            >
              <TrendingUp
                className="w-4 h-4"
                style={{ color: sankeyChartColors.header.icon.primary }}
              />
            </div>
            <div>
              <span
                className="text-sm font-bold"
                style={{
                  color: colors.accent.red,
                  fontFamily: "var(--font-mono)",
                  fontWeight: 700,
                }}
              >
                +12.5%
              </span>
              <div
                className="text-xs font-medium"
                style={{
                  color: colors.secondary,
                  fontFamily: "var(--font-mono)",
                  fontWeight: 600,
                }}
              >
                Growth
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
