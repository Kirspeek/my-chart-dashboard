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
import { Monitor, Smartphone, Tablet, Laptop, Activity } from "lucide-react";

interface DeviceUsageContainerProps {
  data: DeviceUsageData[];
}

function renderLegend(
  data: DeviceUsageData[],
  chartColors: string[],
  isMobile: boolean
) {
  const getDeviceIcon = (deviceName: string) => {
    const name = deviceName.toLowerCase();
    if (name.includes("mobile") || name.includes("phone"))
      return <Smartphone className="w-4 h-4" />;
    if (name.includes("tablet")) return <Tablet className="w-4 h-4" />;
    if (name.includes("laptop")) return <Laptop className="w-4 h-4" />;
    return <Monitor className="w-4 h-4" />;
  };

  return data.map((item: DeviceUsageData, index: number) => (
    <div
      key={index}
      className="flex items-center space-x-3 p-2 rounded-lg hover:bg-[var(--button-hover-bg)] transition-all duration-300 group cursor-pointer"
      style={{ animationDelay: `${index * 150}ms` }}
    >
      <div className="flex items-center space-x-2">
        <div
          className="w-4 h-4 rounded-full transition-transform duration-300 group-hover:scale-110 shadow-sm"
          style={{
            background: `linear-gradient(135deg, ${chartColors[index % chartColors.length]}80, ${chartColors[index % chartColors.length]})`,
            border: `1px solid ${chartColors[index % chartColors.length]}40`,
          }}
        />
        <div className="text-[var(--accent-color)] opacity-70 group-hover:opacity-100 transition-opacity duration-300">
          {getDeviceIcon(item.name)}
        </div>
      </div>
      <div className="flex flex-col">
        <span
          className="text-sm font-medium primary-text group-hover:text-[var(--accent-color)] transition-colors duration-300"
          style={{
            fontFamily: "var(--font-mono)",
            fontWeight: 700,
            fontSize: isMobile ? "0.6rem" : undefined,
          }}
        >
          {item.name}
        </span>
        <span
          className="text-xs secondary-text"
          style={{
            fontFamily: "var(--font-mono)",
            fontWeight: 700,
          }}
        >
          {Math.round(
            (item.value / data.reduce((sum, d) => sum + d.value, 0)) * 100
          )}
          %
        </span>
      </div>
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

  const { tooltipStyle, formatTooltip } = useDeviceUsageLogic();

  const totalUsage = data.reduce((sum, item) => sum + item.value, 0);

  // Complex color palette with opacity variations using theme accent
  const complexColors = [
    // Primary colors with opacity variations using theme accent
    "rgba(234, 122, 0, 0.6)", // Accent with lower opacity
    "rgba(234, 122, 0, 0.5)", // Accent with opacity
    "rgba(234, 122, 0, 0.4)", // Accent with opacity
    "rgba(234, 122, 0, 0.35)", // Accent with opacity
    "rgba(234, 122, 0, 0.3)", // Accent with opacity
    "rgba(234, 122, 0, 0.25)", // Accent with opacity
    "rgba(234, 122, 0, 0.2)", // Accent with opacity
    "rgba(234, 122, 0, 0.15)", // Accent with opacity
  ];

  // Secondary colors for gradients using theme accent
  const secondaryColors = [
    "rgba(234, 122, 0, 0.15)",
    "rgba(234, 122, 0, 0.12)",
    "rgba(234, 122, 0, 0.1)",
    "rgba(234, 122, 0, 0.08)",
    "rgba(234, 122, 0, 0.06)",
    "rgba(234, 122, 0, 0.04)",
    "rgba(234, 122, 0, 0.02)",
    "rgba(234, 122, 0, 0.01)",
  ];

  return (
    <div className="flex flex-col items-center justify-center flex-1 h-full relative group">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-4 left-4 w-2 h-2 bg-[var(--accent-color)] rounded-full"></div>
        <div className="absolute top-8 right-8 w-1 h-1 bg-[var(--accent-color)] rounded-full"></div>
        <div className="absolute bottom-6 left-8 w-1.5 h-1.5 bg-[var(--accent-color)] rounded-full"></div>
        <div className="absolute bottom-12 right-4 w-1 h-1 bg-[var(--accent-color)] rounded-full"></div>
      </div>

      {/* Chart container */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
        <ResponsiveContainer
          width="100%"
          height={isMobile ? "100%" : "100%"}
          minHeight={isMobile ? 200 : 300}
        >
          <RechartsPieChart>
            {/* Background pie for depth effect */}
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

            {/* Main pie chart */}
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
              fill="#8884d8"
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

            {/* Overlay pie for highlight effect */}
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
              contentStyle={{
                ...tooltipStyle,
                backgroundColor: "var(--widget-bg)",
                border: "2px solid var(--widget-border)",
                borderRadius: "12px",
                color: "var(--primary-text)",
                boxShadow: "0 8px 32px 0 rgba(35, 35, 35, 0.18)",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
                opacity: 0.95,
              }}
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

        {/* Enhanced legend */}
        <div className="w-full mt-6 px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {renderLegend(data, complexColors, isMobile)}
          </div>
        </div>

        {/* Summary footer */}
        <div className="mt-4 pt-4 border-t border-[var(--button-border)] opacity-60 w-full">
          <div className="flex justify-between items-center text-xs secondary-text">
            <div className="flex items-center space-x-2">
              <Activity className="w-3 h-3" />
              <span>Total Sessions: {totalUsage.toLocaleString()}</span>
            </div>
            <span>Devices: {data.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
