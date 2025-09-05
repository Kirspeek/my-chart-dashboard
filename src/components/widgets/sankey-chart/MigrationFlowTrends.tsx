"use client";

import React, { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  LineChart,
  Line,
} from "recharts";
import type { MigrationFlowTrendsProps } from "@/interfaces/charts";
import { useTheme } from "@/hooks/useTheme";
import { useMigrationTrends } from "@/hooks/useMigrationTrends";

function MigrationFlowTrends({
  data,
  isMobile,
  isPlaying,
}: MigrationFlowTrendsProps) {
  const { colors, isDark } = useTheme();
  const { months, lines, stacked } = useMigrationTrends(data);

  const palette = useMemo(
    () => [
      colors.accent.blue,
      colors.accent.teal,
      colors.accent.yellow,
      colors.accent.red,
      "#8b5cf6",
    ],
    [colors.accent]
  );

  return (
    <div
      className="w-full h-full grid gap-4"
      style={{ gridTemplateRows: isMobile ? "1fr 1fr" : "2fr 1fr" }}
    >
      {isPlaying && (
        <style>{`
          @keyframes dash-move { to { stroke-dashoffset: -12; } }
          .flow-stroke-animate { stroke-dasharray: 6 6; animation: dash-move 2s linear infinite; }
          @media (prefers-reduced-motion: reduce) { .flow-stroke-animate { animation: none; } }
        `}</style>
      )}
      <div
        className="rounded-2xl p-3"
        style={{
          background: isDark
            ? "rgba(255,255,255,0.04)"
            : "rgba(255,255,255,0.06)",
          border: isDark
            ? "1px solid rgba(255,255,255,0.12)"
            : "1px solid rgba(0,0,0,0.06)",
        }}
      >
        <ResponsiveContainer width="100%" height={isMobile ? 220 : 260}>
          <AreaChart
            data={stacked}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              {lines.map((l) => (
                <linearGradient
                  id={`grad-${l.key}`}
                  key={l.key}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor={palette[l.colorIndex % palette.length]}
                    stopOpacity={0.9}
                  />
                  <stop
                    offset="100%"
                    stopColor={palette[l.colorIndex % palette.length]}
                    stopOpacity={0.15}
                  />
                  {isPlaying ? (
                    <>
                      <animate
                        attributeName="y1"
                        values="0;0.02;0"
                        dur="6s"
                        repeatCount="indefinite"
                      />
                      <animate
                        attributeName="y2"
                        values="1;0.98;1"
                        dur="6s"
                        repeatCount="indefinite"
                      />
                    </>
                  ) : null}
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid
              vertical
              horizontal={false}
              stroke={colors.borderSecondary}
              strokeDasharray="3 3"
            />
            <XAxis
              dataKey="month"
              tick={{
                fill: colors.secondary,
                fontFamily: "var(--font-mono)",
                fontWeight: 700,
                fontSize: 10,
              }}
              interval={0}
              tickLine={false}
              axisLine={false}
              allowDuplicatedCategory={false}
              minTickGap={0}
              tickMargin={6}
              padding={{ left: 0, right: 0 }}
            />
            <YAxis
              tick={{
                fill: colors.secondary,
                fontFamily: "var(--font-mono)",
                fontWeight: 700,
                fontSize: 10,
              }}
              allowDecimals={false}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                background: "var(--widget-bg)",
                border: "1px solid var(--widget-border)",
                borderRadius: 12,
                color: colors.primary,
                fontFamily: "var(--font-mono)",
                fontWeight: 700,
              }}
            />
            {lines.map((l) => (
              <Area
                key={l.key}
                type="monotone"
                dataKey={l.key}
                stackId="1"
                stroke={palette[l.colorIndex % palette.length]}
                fill={`url(#grad-${l.key})`}
                strokeWidth={2}
                isAnimationActive={false}
                activeDot={{ r: 3, stroke: colors.primary, strokeWidth: 1 }}
                className={isPlaying ? "flow-stroke-animate" : undefined}
                strokeLinecap="round"
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {lines.slice(0, 4).map((l) => (
          <div
            key={`spark-${l.key}`}
            className="rounded-xl p-3"
            style={{
              background: isDark
                ? "rgba(255,255,255,0.04)"
                : "rgba(255,255,255,0.06)",
              border: isDark
                ? "1px solid rgba(255,255,255,0.12)"
                : "1px solid rgba(0,0,0,0.06)",
            }}
          >
            <div
              className="text-xs font-bold mb-2"
              style={{ color: colors.primary, fontFamily: "var(--font-mono)" }}
            >
              {l.key}
            </div>
            <ResponsiveContainer width="100%" height={80}>
              <LineChart
                data={months.map((m, i) => ({ m, v: l.values[i] }))}
                margin={{ top: 4, right: 6, left: 6, bottom: 0 }}
              >
                <XAxis dataKey="m" hide />
                <YAxis hide />
                <Line
                  type="monotone"
                  dataKey="v"
                  stroke={palette[l.colorIndex % palette.length]}
                  strokeWidth={2}
                  strokeOpacity={0.9}
                  dot={false}
                  activeDot={{ r: 3 }}
                  isAnimationActive={false}
                  className={isPlaying ? "flow-stroke-animate" : undefined}
                  strokeLinecap="round"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ))}
      </div>
    </div>
  );
}

export default React.memo(MigrationFlowTrends, (prev, next) => {
  return (
    prev.data === next.data &&
    prev.isMobile === next.isMobile &&
    prev.isPlaying === next.isPlaying
  );
});
