"use client";

import { useMemo } from "react";

type Flow = { from: string; to: string; size: number };

export function useMigrationTrends(data: Flow[]) {
  const series = useMemo(() => {
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

    const flowsByKey = new Map<string, Flow>();
    data.forEach((f) => flowsByKey.set(`${f.from}→${f.to}`, f));

    const seededRandom = (seed: number) => {
      let x = seed;
      return () => {
        x ^= x << 13;
        x ^= x >> 17;
        x ^= x << 5;
        return ((x >>> 0) % 1000) / 1000;
      };
    };

    const lines: Array<{ key: string; colorIndex: number; values: number[] }> =
      [];
    let colorIndex = 0;
    flowsByKey.forEach((flow, key) => {
      const seed = key.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
      const rnd = seededRandom(seed);
      const base = flow.size;
      const values = months.map((_, i) => {
        const seasonal = Math.sin((i / 12) * Math.PI * 2) * 0.1 * base;
        const noise = (rnd() - 0.5) * 0.12 * base;
        return Math.max(0.1, base + seasonal + noise);
      });
      lines.push({ key, colorIndex: colorIndex++, values });
    });

    const stacked = months.map((m, idx) => {
      const point: Record<string, number | string> = { month: m };
      lines.forEach((l) => (point[l.key] = l.values[idx]));
      return point as { month: string; [k: string]: number | string };
    });

    return {
      months: months.slice(),
      lines: lines.slice(),
      stacked: stacked.slice(),
    };
  }, [data]);

  return series;
}
