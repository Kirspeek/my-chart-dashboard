"use client";

import React from "react";
import { WidgetTitle } from "@/components/common";
import type { LineChartHeaderProps } from "@/interfaces/components";

export default function LineChartHeader({ title }: LineChartHeaderProps) {
  return <WidgetTitle title={title} variant="centered" size="md" />;
}
