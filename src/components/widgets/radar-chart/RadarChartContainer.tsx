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
import type { WidgetRadarChartData } from "../../../../interfaces/widgets";
import { useChartLogic } from "@/hooks/useChartLogic";
import { useTheme } from "@/hooks/useTheme";

interface RadarChartContainerProps {
  data: WidgetRadarChartData[];
}

export default function RadarChartContainer({
  data,
}: RadarChartContainerProps) {
  // Detect mobile for responsive height and smaller graphic part
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

  const { tooltipStyle, formatTooltip } = useChartLogic();
  const { colors } = useTheme();

  return (
    <div className="flex flex-col items-center justify-center flex-1">
      <ResponsiveContainer width="100%" height={isMobile ? "100%" : 300}>
        <RechartsRadarChart
          data={data}
          outerRadius={isMobile ? "50%" : "80%"} // Smaller radius for mobile
        >
          <PolarGrid stroke={colors.borderSecondary} />
          <PolarAngleAxis
            dataKey="subject"
            tick={{
              fill: colors.primary,
              fontSize: isMobile ? 8 : 12, // Smaller font for mobile
              fontFamily: "var(--font-mono)",
              fontWeight: 700,
            }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={{
              fill: colors.secondary,
              fontSize: isMobile ? 8 : 10, // Smaller font for mobile
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
            strokeWidth={isMobile ? 1 : 2} // Thinner stroke for mobile
          />
          <Tooltip
            contentStyle={tooltipStyle}
            formatter={formatTooltip}
            labelStyle={{
              fontFamily: "var(--font-mono)",
              fontWeight: 700,
              fontSize: isMobile ? 10 : 12, // Smaller tooltip font for mobile
            }}
          />
        </RechartsRadarChart>
      </ResponsiveContainer>
    </div>
  );
}
