"use client";

import React from "react";
import { useChartLogic } from "@/hooks/useChartLogic";

export default function ChartGradients({
  variant,
}: {
  variant: "line" | "area" | "composed";
}) {
  const { chartColors } = useChartLogic();
  if (variant === "composed") {
    return (
      <defs>
        <linearGradient
          id="revenueComposedGradient"
          x1="0"
          y1="0"
          x2="0"
          y2="1"
        >
          <stop offset="5%" stopColor={chartColors.revenue} stopOpacity={0.8} />
          <stop
            offset="95%"
            stopColor={chartColors.revenue}
            stopOpacity={0.3}
          />
        </linearGradient>
      </defs>
    );
  }

  return (
    <defs>
      <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor={chartColors.sales} stopOpacity={0.8} />
        <stop offset="95%" stopColor={chartColors.sales} stopOpacity={0.1} />
      </linearGradient>
      <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor={chartColors.revenue} stopOpacity={0.8} />
        <stop offset="95%" stopColor={chartColors.revenue} stopOpacity={0.1} />
      </linearGradient>
      <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor={chartColors.profit} stopOpacity={0.8} />
        <stop offset="95%" stopColor={chartColors.profit} stopOpacity={0.1} />
      </linearGradient>
    </defs>
  );
}
