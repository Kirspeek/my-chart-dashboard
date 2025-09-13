"use client";

import React from "react";
import type { StatusBadgeProps } from "@/interfaces";

export default function StatusBadge({
  children,
  variant = "default",
  size = "md",
  className = "",
  style,
}: StatusBadgeProps) {
  const baseClasses =
    "inline-flex items-center space-x-1 px-3 py-1 text-xs font-semibold rounded-full transition-all duration-300 hover:scale-105";

  const variantClasses = {
    success:
      "bg-green-100 text-green-800 dark:!bg-transparent dark:!border dark:!border-transparent dark:!text-gray-600",
    warning:
      "bg-yellow-100 text-yellow-800 dark:!bg-transparent dark:!border dark:!border-transparent dark:!text-gray-600",
    error:
      "bg-red-100 text-red-800 dark:!bg-transparent dark:!border dark:!border-transparent dark:!text-gray-700",
    info: "bg-blue-100 text-blue-800 dark:!bg-transparent dark:!border dark:!border-transparent dark:!text-gray-600",
    default:
      "bg-gray-100 text-gray-800 dark:bg-[var(--button-bg)] dark:border dark:border-[var(--button-border)] dark:text-[var(--secondary-text)]",
  };

  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-xs",
    lg: "px-4 py-1.5 text-sm",
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  return (
    <span className={classes} style={style}>
      {children}
    </span>
  );
}
