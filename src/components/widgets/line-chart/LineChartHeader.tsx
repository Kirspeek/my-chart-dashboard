"use client";

import React from "react";
import { WidgetTitle } from "../../common";

interface LineChartHeaderProps {
  title: string;
}

export default function LineChartHeader({ title }: LineChartHeaderProps) {
  return <WidgetTitle title={title} variant="centered" size="md" />;
}
