"use client";

import React from "react";
import { WidgetTitle } from "../../common";

interface BarChartHeaderProps {
  title: string;
}

export default function BarChartHeader({ title }: BarChartHeaderProps) {
  return <WidgetTitle title={title} variant="centered" size="md" />;
}
