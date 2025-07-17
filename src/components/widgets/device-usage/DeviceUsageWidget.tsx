"use client";

import React from "react";
import { DeviceUsageWidgetProps } from "../../../../interfaces/widgets";
import WidgetBase from "../../common/WidgetBase";
import DeviceUsageHeader from "./DeviceUsageHeader";
import DeviceUsageContainer from "./DeviceUsageContainer";

export default function DeviceUsageWidget({
  data,
  title,
}: DeviceUsageWidgetProps) {
  return (
    <WidgetBase className="flex flex-col h-full">
      <DeviceUsageHeader title={title} />
      <DeviceUsageContainer data={data} />
    </WidgetBase>
  );
}
