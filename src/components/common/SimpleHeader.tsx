"use client";

import React from "react";
import WidgetTitle from "./WidgetTitle";

interface SimpleHeaderProps {
  title: string;
  variant?: "default" | "centered" | "compact";
  size?: "sm" | "md" | "lg" | "xl";
}

export default function SimpleHeader({
  title,
  variant = "default",
  size = "md",
}: SimpleHeaderProps) {
  return <WidgetTitle title={title} variant={variant} size={size} />;
}
