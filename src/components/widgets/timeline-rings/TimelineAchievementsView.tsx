import React, { useMemo } from "react";
import { useTheme } from "@/hooks/useTheme";
import type { TimelineAchievementsViewProps } from "@/interfaces/timeline";

export default function TimelineAchievementsView({
  data,
  progressByIndex,
}: TimelineAchievementsViewProps) {
  const { colors, isDark } = useTheme();

  const achievements = useMemo(() => {
    const total = data.length;
    const avg =
      total === 0
        ? 0
        : progressByIndex.reduce((a, b) => a + (b ?? 0), 0) / total;
    const completed = data.filter(
      (_, i) => (progressByIndex[i] ?? 0) >= (data[i].progress ?? 0.9)
    ).length;

    const fastest = data
      .map((d, i) => ({
        key: i,
        speed:
          (d.progress ?? 0.9) / Math.max(0.01, progressByIndex[i] ?? 0.0001),
      }))
      .sort((a, b) => a.speed - b.speed)[0];

    const topCategory = (() => {
      const sum: Record<string, number> = {};
      data.forEach((d, i) => {
        sum[d.color] = (sum[d.color] ?? 0) + (progressByIndex[i] ?? 0);
      });
      return (
        Object.entries(sum).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "unknown"
      );
    })();

    return {
      total,
      avg,
      completed,
      fastestIndex: fastest?.key ?? 0,
      topCategory,
    };
  }, [data, progressByIndex]);

  const badge = (
    title: string,
    subtitle: string,
    accent: string,
    icon?: React.ReactNode
  ) => (
    <div
      className="flex items-center gap-3 rounded-xl p-3"
      style={{
        background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.03)",
        border: isDark
          ? "1px solid rgba(255,255,255,0.12)"
          : "1px solid rgba(0,0,0,0.06)",
      }}
    >
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center"
        style={{ background: `${accent}22`, border: `1px solid ${accent}55` }}
      >
        {icon ?? <span style={{ color: accent, fontWeight: 800 }}>★</span>}
      </div>
      <div>
        <div className="text-sm font-bold" style={{ color: colors.primary }}>
          {title}
        </div>
        <div className="text-xs" style={{ color: colors.secondary }}>
          {subtitle}
        </div>
      </div>
    </div>
  );

  const colorToAccent = (c: string) =>
    c === "yellow"
      ? colors.accent.yellow
      : c === "red"
        ? colors.accent.red
        : c === "blue"
          ? colors.accent.blue
          : c === "teal"
            ? colors.accent.teal
            : colors.accent.blue;

  const fastestItem = data[achievements.fastestIndex];
  const fastestAccent = colorToAccent(fastestItem?.color ?? "blue");
  const topAccent = colorToAccent(achievements.topCategory);

  return (
    <div className="grid grid-cols-2 gap-4">
      {badge(
        "Milestones Completed",
        `${achievements.completed} / ${achievements.total}`,
        colors.accent.teal
      )}
      {badge(
        "Average Progress",
        `${Math.round(achievements.avg * 100)}%`,
        colors.accent.blue
      )}
      {badge(
        "Fastest Reached",
        `${fastestItem?.year ?? "—"} • ${fastestItem?.title ?? "N/A"}`,
        fastestAccent
      )}
      {badge("Top Category", achievements.topCategory, topAccent)}
    </div>
  );
}
