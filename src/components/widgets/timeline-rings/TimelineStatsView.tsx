import React, { useMemo } from "react";
import { useTheme } from "@/hooks/useTheme";
import type { TimelineStatsViewProps } from "@/interfaces/timeline";

export default function TimelineStatsView({
  data,
  progressByIndex,
}: TimelineStatsViewProps) {
  const { colors, isDark } = useTheme();

  const stats = useMemo(() => {
    const total = data.length;
    const avg =
      total === 0 || !progressByIndex
        ? 0
        : (progressByIndex?.reduce((a, b) => (a ?? 0) + (b ?? 0), 0) ?? 0) / total;
    const completed = data.filter(
      (_, i) => (progressByIndex?.[i] ?? 0) >= (data[i]?.progress ?? 0.9)
    ).length;
    const byColor: Record<string, number> = {};
    data.forEach((d, i) => {
      const c = d.color ?? "unknown";
      byColor[c] = (byColor[c] ?? 0) + (progressByIndex?.[i] ?? 0);
    });
    const colorEntries = Object.entries(byColor).sort((a, b) => b[1] - a[1]);
    return { total, avg, completed, colorEntries };
  }, [data, progressByIndex]);

  const sparkPath = useMemo(() => {
    const w = 200;
    const h = 48;
    if (progressByIndex.length === 0) return { d: "", w, h };
    const pts = progressByIndex.map((p, i) => [
      (i / Math.max(1, progressByIndex.length - 1)) * w,
      h - (p ?? 0) * h,
    ]);
    const d = pts
      .map((p, i) => (i === 0 ? `M ${p[0]},${p[1]}` : `L ${p[0]},${p[1]}`))
      .join(" ");
    return { d, w, h };
  }, [progressByIndex]);

  const radial = useMemo(() => {
    const size = 140;
    const stroke = 14;
    const r = (size - stroke) / 2;
    const cx = size / 2;
    const cy = size / 2;
    const circ = 2 * Math.PI * r;
    const pct = Math.min(1, Math.max(0, stats.avg));
    const dash = circ * pct;
    const gap = circ - dash;
    return { size, stroke, r, cx, cy, circ, pct, dash, gap };
  }, [stats.avg]);

  return (
    <div
      className="grid grid-cols-3 gap-4 w-full"
      style={{ padding: "0.5rem 0" }}
    >
      <div
        className="rounded-xl p-4"
        style={{
          background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.03)",
          border: isDark
            ? "1px solid rgba(255,255,255,0.12)"
            : "1px solid rgba(0,0,0,0.06)",
        }}
      >
        <div className="text-xs mb-2" style={{ color: colors.secondary }}>
          Average Progress
        </div>
        <div className="flex items-center justify-center">
          <svg width={radial.size} height={radial.size}>
            <circle
              cx={radial.cx}
              cy={radial.cy}
              r={radial.r}
              fill="none"
              stroke={isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}
              strokeWidth={radial.stroke}
            />
            <circle
              cx={radial.cx}
              cy={radial.cy}
              r={radial.r}
              fill="none"
              stroke={colors.accent.teal}
              strokeWidth={radial.stroke}
              strokeDasharray={`${radial.dash} ${radial.gap}`}
              strokeLinecap="round"
              transform={`rotate(-90 ${radial.cx} ${radial.cy})`}
            />
            <text
              x={radial.cx}
              y={radial.cy + 6}
              textAnchor="middle"
              fontFamily="var(--font-mono)"
              fontWeight={800}
              fontSize="20"
              style={{ fill: colors.primary }}
            >
              {Math.round(radial.pct * 100)}%
            </text>
          </svg>
        </div>
      </div>
      <div
        className="rounded-xl p-4"
        style={{
          background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.03)",
          border: isDark
            ? "1px solid rgba(255,255,255,0.12)"
            : "1px solid rgba(0,0,0,0.06)",
        }}
      >
        <div className="text-xs mb-2" style={{ color: colors.secondary }}>
          Milestone Trend
        </div>
        <svg
          width={sparkPath.w}
          height={sparkPath.h}
          style={{ display: "block" }}
        >
          <defs>
            <linearGradient id="sparkGrad" x1="0" y1="0" x2="1" y2="0">
              <stop
                offset="0%"
                stopColor={colors.accent.blue}
                stopOpacity={0.9}
              />
              <stop
                offset="100%"
                stopColor={colors.accent.teal}
                stopOpacity={0.9}
              />
            </linearGradient>
          </defs>
          <path
            d={sparkPath.d}
            fill="none"
            stroke="url(#sparkGrad)"
            strokeWidth={3}
            strokeLinecap="round"
          />
        </svg>
        <div className="text-xs mt-2" style={{ color: colors.secondary }}>
          Completed:{" "}
          <span style={{ color: colors.primary, fontWeight: 700 }}>
            {stats.completed}
          </span>{" "}
          / {stats.total}
        </div>
      </div>
      <div
        className="rounded-xl p-4"
        style={{
          background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.03)",
          border: isDark
            ? "1px solid rgba(255,255,255,0.12)"
            : "1px solid rgba(0,0,0,0.06)",
        }}
      >
        <div className="text-xs mb-2" style={{ color: colors.secondary }}>
          Category Mix
        </div>
        <div className="space-y-2">
          {stats.colorEntries.slice(0, 4).map(([key, sum]) => {
            const pct = stats.avg === 0 ? 0 : (sum / (stats.total || 1)) * 100;
            const barBg =
              key === "yellow"
                ? colors.accent.yellow
                : key === "red"
                  ? colors.accent.red
                  : key === "blue"
                    ? colors.accent.blue
                    : key === "teal"
                      ? colors.accent.teal
                      : colors.primary;
            return (
              <div key={key} className="w-full">
                <div
                  className="flex items-center justify-between text-xs mb-1"
                  style={{ color: colors.secondary }}
                >
                  <span style={{ textTransform: "capitalize" }}>{key}</span>
                  <span style={{ color: colors.primary, fontWeight: 700 }}>
                    {pct.toFixed(0)}%
                  </span>
                </div>
                <div
                  className="w-full h-2 rounded-full"
                  style={{
                    background: isDark
                      ? "rgba(255,255,255,0.08)"
                      : "rgba(0,0,0,0.08)",
                  }}
                >
                  <div
                    className="h-2 rounded-full"
                    style={{ width: `${pct}%`, background: barBg }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
