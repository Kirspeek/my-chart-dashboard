"use client";

import React from "react";
import CustomChordDiagram from "./CustomChordDiagram";
import type { ChordChartWidgetProps } from "../../../../interfaces/widgets";

export default function ChordChartWidget({
  data,
  title,
  subtitle,
}: ChordChartWidgetProps) {
  return <CustomChordDiagram data={data} title={title} subtitle={subtitle} />;
}
