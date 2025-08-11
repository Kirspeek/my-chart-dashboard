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
import { useDeviceUsageLogic } from "src/hooks/useDeviceUsageLogic";
import { useTheme } from "src/hooks/useTheme";

interface DeviceUsageContainerProps {
  data: DeviceUsageData[];
}

function renderLegend(
  data: DeviceUsageData[],
  chartColors: string[],
  colors: Record<string, string>,
  isMobile: boolean
) {
  return data.map((item: DeviceUsageData, index: number) => (
    <div key={index} className="flex items-center space-x-2">
      <div
        className="w-3 h-3 rounded-sm"
        style={{ backgroundColor: chartColors[index % chartColors.length] }}
      />
      <span
        className="text-sm font-medium"
        style={{
          color: colors.primary,
          fontFamily: "var(--font-mono)",
          fontWeight: 700,
          fontSize: isMobile ? "0.6rem" : undefined, // Even smaller font for mobile
        }}
      >
        {item.name}
      </span>
    </div>
  ));
}

export default function DeviceUsageContainer({
  data,
}: DeviceUsageContainerProps) {
  // Detect mobile for responsive sizing and smaller graphic part
  const [isMobile, setIsMobile] = React.useState(false);
  React.useEffect(() => {
    const check = () => {
      if (typeof window !== "undefined") {
        setIsMobile(window.innerWidth <= 425);
      }
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const { tooltipStyle, formatTooltip, getChartColors } = useDeviceUsageLogic();
  const { colors } = useTheme();
  const chartColors = getChartColors;
  // Create a flat colors object with only string values
  const flatColors = Object.fromEntries(
    Object.entries(colors).filter(([, v]) => typeof v === "string")
  ) as Record<string, string>;

  return (
    <div className="flex flex-col items-center justify-center flex-1 h-full">
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
                  fill="#666"
                  textAnchor={x > cx ? "start" : "end"}
                  dominantBaseline="central"
                  style={{
                    fontSize: isMobile ? "0.6rem" : "0.75rem", // Smaller labels for mobile
                    fontFamily: "var(--font-mono)",
                    fontWeight: 700,
                  }}
                >
                  {`${name} ${Math.round((percent || 0) * 100)}%`}
                </text>
              );
            }}
            outerRadius={isMobile ? 60 : 80} // Smaller radius for mobile
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
          <Tooltip
            contentStyle={tooltipStyle}
            formatter={formatTooltip}
            labelStyle={{
              fontSize: isMobile ? "0.8rem" : 12, // Even smaller tooltip font for mobile
            }}
          />
        </RechartsPieChart>
      </ResponsiveContainer>
      <div className="flex justify-center mt-4 space-x-6">
        {renderLegend(data, chartColors, flatColors, isMobile)}
      </div>
    </div>
  );
}
