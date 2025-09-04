"use client";

import React from "react";
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import type { DeviceUsageData } from "@/interfaces/widgets";

export default function DeviceUsageChart({
  data,
  isMobile,
  complexColors,
  secondaryColors,
  tooltipStyle,
  formatTooltip,
}: {
  data: DeviceUsageData[];
  isMobile: boolean;
  complexColors: string[];
  secondaryColors: string[];
  tooltipStyle: React.CSSProperties;
  formatTooltip: (value: number, name: string) => [string, string];
}) {
  return (
    <ResponsiveContainer
      width="100%"
      height={isMobile ? "100%" : "100%"}
      minHeight={isMobile ? 200 : 300}
    >
      <RechartsPieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={isMobile ? 65 : 85}
          innerRadius={isMobile ? 25 : 35}
          fill="transparent"
          dataKey="value"
          stroke="var(--widget-bg)"
          strokeWidth={1}
          opacity={0.1}
        />

        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({
            name,
            percent,
            cx,
            cy,
            midAngle,
            innerRadius,
            outerRadius,
          }) => {
            const RADIAN = Math.PI / 180;
            const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
            const angle = midAngle || 0;
            const x = cx + radius * Math.cos(-angle * RADIAN);
            const y = cy + radius * Math.sin(-angle * RADIAN);
            return (
              <text
                x={x}
                y={y}
                fill="var(--primary-text)"
                textAnchor={x > cx ? "start" : "end"}
                dominantBaseline="central"
                style={{
                  fontSize: isMobile ? "0.6rem" : "0.75rem",
                  fontFamily: "var(--font-mono)",
                  fontWeight: 700,
                  filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.1))",
                  opacity: 0.9,
                }}
              >
                {`${name} ${Math.round((percent || 0) * 100)}%`}
              </text>
            );
          }}
          outerRadius={isMobile ? 60 : 80}
          innerRadius={isMobile ? 20 : 30}
          fill="var(--widget-bg)"
          dataKey="value"
          stroke="var(--widget-bg)"
          strokeWidth={4}
          paddingAngle={3}
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={complexColors[index % complexColors.length]}
              stroke="var(--widget-bg)"
              strokeWidth={2}
              opacity={0.8 + index * 0.05}
            />
          ))}
        </Pie>

        <Pie
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={isMobile ? 58 : 78}
          innerRadius={isMobile ? 22 : 32}
          fill="transparent"
          dataKey="value"
          stroke={secondaryColors[0]}
          strokeWidth={1}
          opacity={0.3}
        />

        <Tooltip
          contentStyle={tooltipStyle}
          formatter={formatTooltip}
          labelStyle={{
            fontSize: isMobile ? "0.8rem" : 12,
            color: "var(--primary-text)",
            fontFamily: "var(--font-mono)",
            fontWeight: 700,
          }}
        />
      </RechartsPieChart>
    </ResponsiveContainer>
  );
}
