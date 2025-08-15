"use client";

import React from "react";

interface DividerProps {
  className?: string;
  variant?: "horizontal" | "vertical";
  size?: "sm" | "md" | "lg";
  color?: "default" | "light" | "dark";
}

export default function Divider({
  className = "",
  variant = "horizontal",
  size = "md",
  color = "default",
}: DividerProps) {
  const baseClasses = "border-gray-200 dark:border-gray-700";

  const sizeClasses = {
    sm: variant === "horizontal" ? "border-t" : "border-l",
    md: variant === "horizontal" ? "border-t" : "border-l",
    lg: variant === "horizontal" ? "border-t-2" : "border-l-2",
  };

  const colorClasses = {
    default: "border-gray-200 dark:border-gray-700",
    light: "border-gray-100 dark:border-gray-800",
    dark: "border-gray-300 dark:border-gray-600",
  };

  const classes = `${baseClasses} ${sizeClasses[size]} ${colorClasses[color]} ${className}`;

  return <div className={classes} />;
}
