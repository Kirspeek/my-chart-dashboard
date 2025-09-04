"use client";

import React from "react";
import { WidgetTitle } from "@/components/common";
import type { DeviceUsageHeaderProps } from "@/interfaces/components";

export default function DeviceUsageHeader({ title }: DeviceUsageHeaderProps) {
  return <WidgetTitle title={title} variant="centered" size="md" />;
}
