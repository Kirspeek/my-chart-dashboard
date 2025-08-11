"use client";

import React from "react";
import { WidgetTitle } from "../../common";

interface RadarChartHeaderProps {
  title: string;
}

export default function RadarChartHeader({ title }: RadarChartHeaderProps) {
  return <WidgetTitle title={title} variant="centered" size="md" />;
}
