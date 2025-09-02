"use client";

import React from "react";
import { useTheme } from "@/hooks/useTheme";
import { Globe, TrendingUp, Users, ArrowRight } from "lucide-react";

interface MigrationChordHeaderProps {
  title: string;
  subtitle?: string;
  isMobile?: boolean;
  totalFlows?: number;
  totalMigration?: number;
  selectedFlow?: string | null;
}

export default function MigrationChordHeader({
  title,
  subtitle,
  isMobile = false,
  totalFlows = 0,
  totalMigration = 0,
  selectedFlow,
}: MigrationChordHeaderProps) {
  const { colors } = useTheme();

  return (
    <div className="mb-4">
      {/* Main Title Section */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-3">
          <div
            className="relative p-2 rounded-xl"
            style={{
              background: `linear-gradient(135deg, ${colors.accent.blue}20, ${colors.accent.teal}20)`,
              border: `1px solid ${colors.accent.blue}30`,
            }}
          >
            <Globe
              size={isMobile ? 16 : 20}
              style={{ color: colors.accent.blue }}
            />
            <div
              className="absolute -top-1 -right-1 w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: colors.accent.teal }}
            />
          </div>
          <div>
            <h2
              className={`font-bold tracking-tight ${
                isMobile ? "text-lg" : "text-xl"
              }`}
              style={{ color: colors.primary }}
            >
              {title}
            </h2>
            {subtitle && (
              <p
                className="text-xs font-medium opacity-80"
                style={{ color: colors.secondary }}
              >
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Animated Status Indicator */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <div
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: colors.accent.teal }}
            />
            <span
              className="text-xs font-medium"
              style={{ color: colors.secondary }}
            >
              Live
            </span>
          </div>
        </div>
      </div>

      {/* Compact Stats Cards */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        {/* Total Flows Card */}
        <div
          className="relative p-3 rounded-lg overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${colors.accent.blue}15, ${colors.accent.blue}05)`,
            border: `1px solid ${colors.accent.blue}25`,
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p
                className="text-xs font-medium mb-1 opacity-70"
                style={{ color: colors.secondary }}
              >
                Total Flows
              </p>
              <p
                className="text-sm font-bold"
                style={{ color: colors.primary }}
              >
                {totalFlows.toLocaleString()}
              </p>
            </div>
            <div
              className="p-1.5 rounded-md"
              style={{ backgroundColor: `${colors.accent.blue}20` }}
            >
              <ArrowRight size={12} style={{ color: colors.accent.blue }} />
            </div>
          </div>
        </div>

        {/* Total Migration Card */}
        <div
          className="relative p-3 rounded-lg overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${colors.accent.teal}15, ${colors.accent.teal}05)`,
            border: `1px solid ${colors.accent.teal}25`,
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p
                className="text-xs font-medium mb-1 opacity-70"
                style={{ color: colors.secondary }}
              >
                Migration Volume
              </p>
              <p
                className="text-sm font-bold"
                style={{ color: colors.primary }}
              >
                {totalMigration.toFixed(1)}M
              </p>
            </div>
            <div
              className="p-1.5 rounded-md"
              style={{ backgroundColor: `${colors.accent.teal}20` }}
            >
              <Users size={12} style={{ color: colors.accent.teal }} />
            </div>
          </div>
        </div>
      </div>

      {/* Selected Flow Display */}
      {selectedFlow && (
        <div
          className="p-2 rounded-lg border border-dashed"
          style={{
            borderColor: `${colors.accent.yellow}40`,
            background: `linear-gradient(135deg, ${colors.accent.yellow}10, ${colors.accent.yellow}05)`,
          }}
        >
          <div className="flex items-center space-x-2">
            <TrendingUp size={14} style={{ color: colors.accent.yellow }} />
            <span
              className="text-xs font-medium"
              style={{ color: colors.primary }}
            >
              Selected: {selectedFlow}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
