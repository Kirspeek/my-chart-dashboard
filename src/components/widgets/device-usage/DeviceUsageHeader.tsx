"use client";

import React from "react";
import { WidgetTitle } from "../../common";

interface DeviceUsageHeaderProps {
  title: string;
}

export default function DeviceUsageHeader({ title }: DeviceUsageHeaderProps) {
  return <WidgetTitle title={title} variant="centered" size="md" />;
}
