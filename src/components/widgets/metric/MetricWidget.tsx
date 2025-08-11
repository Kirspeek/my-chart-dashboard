"use client";

import React from "react";
import { MetricWidgetProps } from "../../../../interfaces/widgets";
import WidgetBase from "../../common/WidgetBase";
import { useMetricLogic } from "src/hooks/useMetricLogic";
import MetricIcon from "./MetricIcon";
import MetricContent from "./MetricContent";
import MetricTrend from "./MetricTrend";

export default function MetricWidget({
  metric,
  index = 0,
  onOpenSidebar,
  showSidebarButton = false,
}: MetricWidgetProps & {
  onOpenSidebar?: () => void;
  showSidebarButton?: boolean;
}) {
  const { accentColor, displayValue } = useMetricLogic(metric, index);

  return (
    <WidgetBase
      className="flex flex-col gap-2 relative p-4"
      onOpenSidebar={onOpenSidebar}
      showSidebarButton={showSidebarButton}
    >
      <MetricIcon icon={metric.icon} accentColor={accentColor} />

      <div className="flex items-start justify-between w-full">
        <MetricContent title={metric.title} value={displayValue} />
      </div>

      <MetricTrend change={metric.change} accentColor={accentColor} />
    </WidgetBase>
  );
}
