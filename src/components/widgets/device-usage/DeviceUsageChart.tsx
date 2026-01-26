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
          label={(props) => {
            const p = props as {
              name?: string;
              percent?: number;
              cx?: number;
              cy?: number;
              midAngle?: number;
              innerRadius?: number;
              outerRadius?: number;
            };
            const RADIAN = Math.PI / 180;
            const innerR = p.innerRadius ?? 0;
            const outerR = p.outerRadius ?? 0;
            const radius = innerR + (outerR - innerR) * 0.5;
            const angle = p.midAngle ?? 0;
            const cxVal = p.cx ?? 0;
            const cyVal = p.cy ?? 0;
            const x = cxVal + radius * Math.cos(-angle * RADIAN);
            const y = cyVal + radius * Math.sin(-angle * RADIAN);
            return (
              <text
                x={x}
                y={y}
                fill="var(--primary-text)"
                textAnchor={x > cxVal ? "start" : "end"}
                dominantBaseline="central"
                style={{
                  fontSize: isMobile ? "0.6rem" : "0.75rem",
                  fontFamily: "var(--font-mono)",
                  fontWeight: 700,
                  filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.1))",
                  opacity: 0.9,
                }}
              >
                {`${p.name ?? ""} ${Math.round((p.percent ?? 0) * 100)}%`}
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
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              const data = payload[0].payload;
              const formattedValue = formatTooltip(
                data.value,
                data.name
              );
              return (
                <div style={tooltipStyle}>
                  <p
                    style={{
                      margin: 0,
                      color: "var(--primary-text)",
                      fontFamily: "var(--font-mono)",
                      fontWeight: 700,
                      fontSize: isMobile ? "0.8rem" : 12,
                    }}
                  >
                    {`${formattedValue[1]} : ${Math.round(data.value)}%`}
                  </p>
                </div>
              );
            }
            return null;
          }}
        />
      </RechartsPieChart>
    </ResponsiveContainer>
  );
}
