"use client";

import React from "react";
import { BarChartWidgetProps } from "../../../../interfaces/widgets";
import WidgetBase from "../../common/WidgetBase";
import BarChartHeader from "./BarChartHeader";
import BarChartContainer from "./BarChartContainer";

export default function BarChartWidget({ data, title }: BarChartWidgetProps) {
  return (
    <WidgetBase className="flex flex-col">
      <BarChartHeader title={title} />
      <BarChartContainer data={data} />
    </WidgetBase>
  );
}
