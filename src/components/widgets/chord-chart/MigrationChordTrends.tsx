"use client";

import React, { useMemo } from "react";
import type { WidgetChordChartData } from "@/interfaces/widgets";
import { useTheme } from "@/hooks/useTheme";

export default function MigrationChordTrends({
  data,
}: {
  data: WidgetChordChartData[];
}) {
  const { colors } = useTheme();

  const series = useMemo(() => {
    const continents = Array.from(new Set(data.flatMap((f) => [f.from, f.to])));
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const seeded = (s: number) => {
      let x = s;
      return () => {
        x ^= x << 13;
        x ^= x >> 17;
        x ^= x << 5;
        return ((x >>> 0) % 1000) / 1000;
      };
    };
    return continents.map((c, idx) => {
      const r = seeded(c.split("").reduce((a, ch) => a + ch.charCodeAt(0), 0));
      const values = months.map(
        (_, i) =>
          0.4 +
          0.6 * (0.6 + 0.4 * Math.sin((i + idx) * 0.7) + (r() - 0.5) * 0.2)
      );
      return { key: c, values };
    });
  }, [data]);

  const palette = [
    colors.accent.blue,
    colors.accent.teal,
    colors.accent.yellow,
    colors.accent.red,
    "#8b5cf6",
  ];

  return (
    <div className="space-y-3">
      {series.map((s, idx) => {
        const W = 520;
        const H = 42;
        const step = W / (s.values.length - 1);
        const max = Math.max(...s.values);
        const min = Math.min(...s.values);
        const path = s.values
          .map(
            (v, i) =>
              `${i === 0 ? "M" : "L"} ${i * step} ${H - 6 - ((v - min) / (max - min || 1)) * (H - 10)}`
          )
          .join(" ");
        return (
          <div
            key={s.key}
            className="p-3 rounded-xl"
            style={{
              background: `linear-gradient(135deg, ${palette[idx % palette.length]}12, ${palette[idx % palette.length]}06)`,
              border: `1px solid ${palette[idx % palette.length]}22`,
            }}
          >
            <div className="flex items-center justify-between mb-1">
              <div
                className="text-xs font-bold"
                style={{ color: colors.primary }}
              >
                {s.key}
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
                stroke={palette[idx % palette.length]}
                strokeWidth={2}
              />
            </svg>
          </div>
        );
      })}
    </div>
  );
}
