"use client";

import React from "react";
import { LineChartWidgetProps } from "../../../../interfaces/widgets";
import WidgetBase from "../../common/WidgetBase";
import LineChartHeader from "./LineChartHeader";
import LineChartContainer from "./LineChartContainer";

export default function LineChartWidget({ data, title }: LineChartWidgetProps) {
  return (
    <WidgetBase className="flex flex-col">
      <LineChartHeader title={title} />
      <LineChartContainer data={data} />
    </WidgetBase>
  );
}
