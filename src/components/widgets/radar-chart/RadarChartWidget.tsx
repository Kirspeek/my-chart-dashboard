"use client";

import React from "react";
import { RadarChartWidgetProps } from "../../../../interfaces/widgets";
import WidgetBase from "../../common/WidgetBase";
import RadarChartHeader from "./RadarChartHeader";
import RadarChartContainer from "./RadarChartContainer";

export default function RadarChartWidget({
  data,
  title,
}: RadarChartWidgetProps) {
  return (
    <WidgetBase className="flex flex-col h-full">
      <RadarChartHeader title={title} />
      <RadarChartContainer data={data} />
    </WidgetBase>
  );
}
