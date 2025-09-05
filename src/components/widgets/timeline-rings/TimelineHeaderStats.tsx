import React from "react";
import { useTheme } from "@/hooks/useTheme";
import { Target, Award, TrendingUp } from "lucide-react";
import type { TimelineHeaderStatsProps } from "@/interfaces/timeline";

export default function TimelineHeaderStats({
  totalMilestones,
  completedMilestones,
  averageProgress,
}: TimelineHeaderStatsProps) {
  const { colors } = useTheme();

  return (
    <div className="grid grid-cols-3 gap-3 mb-4">
      <div
        className="relative p-3 rounded-lg overflow-hidden"
        style={{
          background: `linear-gradient(135deg, color-mix(in srgb, ${colors.accent.blue} 22%, transparent), var(--card-bg))`,
          border: `1px solid color-mix(in srgb, ${colors.accent.blue} 35%, var(--border-secondary))`,
          boxShadow: `0 1px 0 color-mix(in srgb, ${colors.accent.blue} 20%, transparent) inset, 0 6px 16px rgba(0,0,0,0.25)`,
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p
              className="text-xs font-medium mb-1"
              style={{
                color: "var(--primary-text)",
                fontWeight: 600,
                letterSpacing: 0.2,
              }}
            >
              Total Milestones
            </p>
            <p
              className="text-sm font-bold"
              style={{ color: "var(--primary-text)", letterSpacing: 0.2 }}
            >
              {totalMilestones}
            </p>
          </div>
          <div
            className="p-1.5 rounded-md"
            style={{
              background: `color-mix(in srgb, ${colors.accent.blue} 28%, transparent)`,
              border: `1px solid color-mix(in srgb, ${colors.accent.blue} 40%, var(--border-secondary))`,
              boxShadow: `0 0 0 1px color-mix(in srgb, ${colors.accent.blue} 10%, transparent) inset`,
            }}
          >
            <Target size={12} style={{ color: colors.accent.blue }} />
          </div>
        </div>
      </div>

      <div
        className="relative p-3 rounded-lg overflow-hidden"
        style={{
          background: `linear-gradient(135deg, color-mix(in srgb, ${colors.accent.teal} 22%, transparent), var(--card-bg))`,
          border: `1px solid color-mix(in srgb, ${colors.accent.teal} 35%, var(--border-secondary))`,
          boxShadow: `0 1px 0 color-mix(in srgb, ${colors.accent.teal} 20%, transparent) inset, 0 6px 16px rgba(0,0,0,0.25)`,
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p
              className="text-xs font-medium mb-1"
              style={{
                color: "var(--primary-text)",
                fontWeight: 600,
                letterSpacing: 0.2,
              }}
            >
              Completed
            </p>
            <p
              className="text-sm font-bold"
              style={{ color: "var(--primary-text)", letterSpacing: 0.2 }}
            >
              {completedMilestones}
            </p>
          </div>
          <div
            className="p-1.5 rounded-md"
            style={{
              background: `color-mix(in srgb, ${colors.accent.teal} 28%, transparent)`,
              border: `1px solid color-mix(in srgb, ${colors.accent.teal} 40%, var(--border-secondary))`,
              boxShadow: `0 0 0 1px color-mix(in srgb, ${colors.accent.teal} 10%, transparent) inset`,
            }}
          >
            <Award size={12} style={{ color: colors.accent.teal }} />
          </div>
        </div>
      </div>

      <div
        className="relative p-3 rounded-lg overflow-hidden"
        style={{
          background: `linear-gradient(135deg, color-mix(in srgb, ${colors.accent.yellow} 22%, transparent), var(--card-bg))`,
          border: `1px solid color-mix(in srgb, ${colors.accent.yellow} 35%, var(--border-secondary))`,
          boxShadow: `0 1px 0 color-mix(in srgb, ${colors.accent.yellow} 20%, transparent) inset, 0 6px 16px rgba(0,0,0,0.25)`,
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p
              className="text-xs font-medium mb-1"
              style={{
                color: "var(--primary-text)",
                fontWeight: 600,
                letterSpacing: 0.2,
              }}
            >
              Progress
            </p>
            <p
              className="text-sm font-bold"
              style={{ color: "var(--primary-text)", letterSpacing: 0.2 }}
            >
              {Math.round(averageProgress * 100)}%
            </p>
          </div>
          <div
            className="p-1.5 rounded-md"
            style={{
              background: `color-mix(in srgb, ${colors.accent.yellow} 28%, transparent)`,
              border: `1px solid color-mix(in srgb, ${colors.accent.yellow} 40%, var(--border-secondary))`,
              boxShadow: `0 0 0 1px color-mix(in srgb, ${colors.accent.yellow} 10%, transparent) inset`,
            }}
          >
            <TrendingUp size={12} style={{ color: colors.accent.yellow }} />
          </div>
        </div>
      </div>
    </div>
  );
}
