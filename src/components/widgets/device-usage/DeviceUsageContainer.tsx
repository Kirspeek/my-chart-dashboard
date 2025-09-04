"use client";

import React from "react";
import type { DeviceUsageContainerProps } from "@/interfaces/widgets";
import { useDeviceUsageLogic } from "@/hooks/useDeviceUsageLogic";
import { Activity } from "lucide-react";
import { useMobileDetection } from "@/components/common";
import { useTheme } from "@/hooks/useTheme";
import DeviceUsageLegend from "./DeviceUsageLegend";
import DeviceUsageChart from "./DeviceUsageChart";

export default function DeviceUsageContainer({
  data,
}: DeviceUsageContainerProps) {
  const isMobile = useMobileDetection();
  const { colorsTheme } = useTheme();
  const deviceUsageColors = colorsTheme.widgets.deviceUsage;

  const { tooltipStyle, formatTooltip } = useDeviceUsageLogic();

  const totalUsage = data.reduce((sum, item) => sum + item.value, 0);

  const complexColors = deviceUsageColors.opacity.primary;
  const secondaryColors = deviceUsageColors.opacity.secondary;

  return (
    <div className="flex flex-col items-center justify-center flex-1 h-full relative group">
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-4 left-4 w-2 h-2 bg-[var(--accent-color)] rounded-full"></div>
        <div className="absolute top-8 right-8 w-1 h-1 bg-[var(--accent-color)] rounded-full"></div>
        <div className="absolute bottom-6 left-8 w-1.5 h-1.5 bg-[var(--accent-color)] rounded-full"></div>
        <div className="absolute bottom-12 right-4 w-1 h-1 bg-[var(--accent-color)] rounded-full"></div>
      </div>

      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
        <DeviceUsageChart
          data={data}
          isMobile={isMobile}
          complexColors={complexColors}
          secondaryColors={secondaryColors}
          tooltipStyle={{
            ...tooltipStyle,
            backgroundColor: "var(--widget-bg)",
            border: "2px solid var(--widget-border)",
            borderRadius: "12px",
            color: "var(--primary-text)",
            boxShadow: `0 8px 32px 0 ${deviceUsageColors.shadow}`,
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            opacity: 0.95,
          }}
          formatTooltip={formatTooltip}
        />

        <div className="w-full mt-6 px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <DeviceUsageLegend
              data={data}
              chartColors={complexColors}
              isMobile={isMobile}
            />
          </div>
        </div>

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
