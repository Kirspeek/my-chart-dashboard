"use client";

import React from "react";
import { WidgetTitle } from "@/components/common";
import type { BarChartHeaderProps } from "@/interfaces/components";

export default function BarChartHeader({ title }: BarChartHeaderProps) {
  return <WidgetTitle title={title} variant="centered" size="md" />;
}
