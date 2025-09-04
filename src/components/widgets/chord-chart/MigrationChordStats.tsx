"use client";

import React, { useMemo } from "react";
import { useTheme } from "@/hooks/useTheme";
import { useGlobalTooltip } from "@/hooks/useGlobalTooltip";
import { TrendingUp } from "lucide-react";
import type { MigrationChordStatsProps } from "@/interfaces/charts";

export default function MigrationChordStats({
  data,
  selectedFlow,
  setSelectedFlow,
}: MigrationChordStatsProps) {
  const { colors } = useTheme();
  const { createTooltipHandlers } = useGlobalTooltip();

  const topFlows = useMemo(
    () => [...data].sort((a, b) => b.size - a.size).slice(0, 5),
    [data]
  );

  const { outgoingShare, incomingShare, netFlows } = useMemo(() => {
    const continents = new Set<string>();
    data.forEach((f) => {
      continents.add(f.from);
      continents.add(f.to);
    });
    const outgoing: Record<string, number> = {};
    const incoming: Record<string, number> = {};
    data.forEach((f) => {
      outgoing[f.from] = (outgoing[f.from] || 0) + f.size;
      incoming[f.to] = (incoming[f.to] || 0) + f.size;
    });
    const outTotal = Object.values(outgoing).reduce((a, b) => a + b, 0) || 1;
    const inTotal = Object.values(incoming).reduce((a, b) => a + b, 0) || 1;
    const outgoingShare = Array.from(continents).map((c) => ({
      key: c,
      value: (outgoing[c] || 0) / outTotal,
    }));
    const incomingShare = Array.from(continents).map((c) => ({
      key: c,
      value: (incoming[c] || 0) / inTotal,
    }));
    const net: Record<string, number> = {};
    Array.from(continents).forEach((c) => {
      net[c] = (incoming[c] || 0) - (outgoing[c] || 0);
    });
    const netFlows = Object.entries(net)
      .map(([continent, net]) => ({ continent, net }))
      .sort((a, b) => Math.abs(b.net) - Math.abs(a.net));
    return { outgoingShare, incomingShare, netFlows };
  }, [data]);

  const palette = [
    colors.accent.blue,
    colors.accent.teal,
    colors.accent.yellow,
    colors.accent.red,
    "#8b5cf6",
  ];

  const renderStackedBar = (items: { key: string; value: number }[]) => {
    return (
      <div
        className="w-full h-3 rounded-full overflow-hidden border"
        style={{
          borderColor: `${colors.accent.blue}25`,
          background: "var(--button-bg)",
        }}
      >
        <div className="flex h-full w-full">
          {items.map((it, idx) => {
            const width = `${Math.max(0, Math.min(100, it.value * 100))}%`;
            return (
              <div
                key={it.key}
                className="h-full"
                style={{
                  width,
                  background: `linear-gradient(135deg, ${palette[idx % palette.length]}40, ${palette[idx % palette.length]}90)`,
                }}
              />
            );
          })}
        </div>
      </div>
    );
  };

  const sparkFor = (seed: number) =>
    Array.from({ length: 12 }, (_, i) => {
      const s = Math.sin((i + seed) * 1.7) * 0.5 + 0.5;
      return 0.6 + s * 0.8;
    });

  return (
    <div className="space-y-6">
      <div
        className="p-6 rounded-2xl"
        style={{
          background: `linear-gradient(135deg, ${colors.accent.blue}10, ${colors.accent.teal}05)`,
          border: `1px solid ${colors.accent.blue}20`,
        }}
      >
        <div className="mb-3">
          <div className="text-sm font-bold" style={{ color: colors.primary }}>
            Mix Breakdown
          </div>
        </div>
        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between mb-1">
              <div
                className="text-xs font-medium"
                style={{ color: colors.secondary }}
              >
                Outgoing · by source
              </div>
            </div>
            {renderStackedBar(outgoingShare)}
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <div
                className="text-xs font-medium"
                style={{ color: colors.secondary }}
              >
                Incoming · by destination
              </div>
            </div>
            {renderStackedBar(incomingShare)}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {topFlows.slice(0, 4).map((flow, index) => {
          const series = sparkFor(index + 1);
          const max = Math.max(...series);
          const min = Math.min(...series);
          const W = 160;
          const H = 42;
          const step = W / (series.length - 1);
          const path = series
            .map(
              (v, i) =>
                `${i === 0 ? "M" : "L"} ${i * step} ${H - 6 - ((v - min) / (max - min || 1)) * (H - 10)}`
            )
            .join(" ");
          const isSelected = selectedFlow === `${flow.from}→${flow.to}`;
          const handlers = createTooltipHandlers(`${flow.from} → ${flow.to}`);
          return (
            <button
              key={`${flow.from}-${flow.to}`}
              className="p-3 rounded-xl text-left transition-all duration-200 hover:shadow-md overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${palette[index % palette.length]}15, ${palette[index % palette.length]}08)`,
                border: `1px solid ${palette[index % palette.length]}25`,
              }}
              onClick={() =>
                setSelectedFlow?.(isSelected ? null : `${flow.from}→${flow.to}`)
              }
              {...handlers}
            >
              <div className="relative mb-1 flex items-start justify-between gap-2">
                <div style={{ maxWidth: "72%" }}>
                  <div
                    className="text-[10px] font-bold truncate"
                    style={{ color: colors.primary }}
                  >
                    {flow.from}
                  </div>
                  <div
                    className="text-[10px] font-bold truncate"
                    style={{ color: colors.secondary }}
                  >
                    → {flow.to}
                  </div>
                </div>
                <div
                  className="text-[10px] font-bold px-1.5 py-0.5 rounded-md whitespace-nowrap"
                  style={{
                    color: palette[index % palette.length],
                    background: `${palette[index % palette.length]}14`,
                    border: `1px solid ${palette[index % palette.length]}30`,
                  }}
                >
                  {flow.size}M
                </div>
              </div>
              <svg
                width="100%"
                height="42"
                viewBox={`0 0 ${W} ${H}`}
                style={{ display: "block" }}
              >
                <path
                  d={path}
                  fill="none"
                  stroke={palette[index % palette.length]}
                  strokeWidth={2}
                />
              </svg>
            </button>
          );
        })}
      </div>

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
            Net Flow Leaders
          </h3>
        </div>
        <div className="space-y-3">
          {netFlows.map(({ continent, net }) => {
            const positive = net > 0;
            const negative = net < 0;
            const tone = positive
              ? colors.accent.teal
              : negative
                ? colors.accent.red
                : colors.accent.yellow;
            return (
              <div
                key={continent}
                className="flex items-center justify-between p-3 rounded-xl"
                style={{
                  background: `linear-gradient(135deg, ${tone}10, ${tone}05)`,
                  border: `1px solid ${tone}25`,
                }}
              >
                <span className="font-medium" style={{ color: colors.primary }}>
                  {continent}
                </span>
                <div className="flex items-center space-x-2">
                  <span className="font-bold" style={{ color: tone }}>
                    {positive ? "+" : ""}
                    {net.toFixed(1)}M
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
