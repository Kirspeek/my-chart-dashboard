"use client";

import React from "react";
import CustomBubbleChart from "./CustomBubbleChart";
import type { BubbleChartWidgetProps } from "../../../../interfaces/widgets";

export default function BubbleChartWidget({
  data,
  title,
  subtitle,
}: BubbleChartWidgetProps) {
  return <CustomBubbleChart data={data} title={title} subtitle={subtitle} />;
}
