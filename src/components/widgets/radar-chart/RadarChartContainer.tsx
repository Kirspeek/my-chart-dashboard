"use client";

import React from "react";
import {
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import type { RadarChartData } from "../../../../interfaces/widgets";
import { useRadarChartLogic } from "../../../hooks/useRadarChartLogic";
import { useTheme } from "../../../hooks/useTheme";

interface RadarChartContainerProps {
  data: RadarChartData[];
}

export default function RadarChartContainer({
  data,
}: RadarChartContainerProps) {
  const { tooltipStyle, formatTooltip } = useRadarChartLogic();
  const { colors } = useTheme();

  return (
    <div className="flex flex-col items-center justify-center flex-1">
      <ResponsiveContainer width="100%" height={300}>
        <RechartsRadarChart data={data}>
          <PolarGrid stroke={colors.borderSecondary} />
          <PolarAngleAxis
            dataKey="subject"
            tick={{
              fill: colors.primary,
              fontSize: 12,
              fontFamily: "var(--font-mono)",
              fontWeight: 700,
            }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={{
              fill: colors.secondary,
              fontSize: 10,
              fontFamily: "var(--font-mono)",
              fontWeight: 700,
            }}
          />
          <Radar
            name="Performance"
            dataKey="value"
            stroke={colors.accent.blue}
            fill={colors.accent.blue}
            fillOpacity={0.3}
            strokeWidth={2}
          />
          <Tooltip
            contentStyle={tooltipStyle}
            formatter={formatTooltip}
            labelStyle={{
              fontFamily: "var(--font-mono)",
              fontWeight: 700,
            }}
          />
        </RechartsRadarChart>
      </ResponsiveContainer>
    </div>
  );
}
