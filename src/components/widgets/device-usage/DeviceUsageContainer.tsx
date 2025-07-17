"use client";

import React from "react";
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import type { DeviceUsageData } from "../../../../interfaces/widgets";
import { useDeviceUsageLogic } from "../../../hooks/useDeviceUsageLogic";
import { useTheme } from "../../../hooks/useTheme";

interface DeviceUsageContainerProps {
  data: DeviceUsageData[];
}

export default function DeviceUsageContainer({
  data,
}: DeviceUsageContainerProps) {
  const { tooltipStyle, formatTooltip, getChartColors } = useDeviceUsageLogic();
  const { colors } = useTheme();

  // Use theme colors for chart segments
  const chartColors = getChartColors;

  return (
    <div className="flex flex-col items-center justify-center flex-1 h-full">
      <ResponsiveContainer width="100%" height="100%" minHeight={300}>
        <RechartsPieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) =>
              `${name} ${Math.round((percent || 0) * 100)}%`
            }
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={chartColors[index % chartColors.length]}
              />
            ))}
          </Pie>
          <Tooltip contentStyle={tooltipStyle} formatter={formatTooltip} />
        </RechartsPieChart>
      </ResponsiveContainer>
      <div className="flex justify-center mt-4 space-x-6">
        {data.map((item, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div
              className="w-3 h-3 rounded-sm"
              style={{
                backgroundColor: chartColors[index % chartColors.length],
              }}
            />
            <span
              className="text-sm font-medium"
              style={{
                color: colors.primary,
                fontFamily: "var(--font-mono)",
                fontWeight: 700,
              }}
            >
              {item.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
