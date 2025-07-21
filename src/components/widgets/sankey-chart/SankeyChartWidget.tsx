"use client";

import React from "react";
import CustomSankeyDiagram from "./CustomSankeyDiagram";
import type { SankeyChartWidgetProps } from "../../../../interfaces/widgets";

export default function SankeyChartWidget({
  data,
  title,
  subtitle,
}: SankeyChartWidgetProps) {
  return <CustomSankeyDiagram data={data} title={title} subtitle={subtitle} />;
}
