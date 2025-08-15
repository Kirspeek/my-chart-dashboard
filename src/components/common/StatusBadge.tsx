"use client";

import React from "react";

interface StatusBadgeProps {
  children: React.ReactNode;
  variant?: "success" | "warning" | "error" | "info" | "default";
  size?: "sm" | "md" | "lg";
  className?: string;
  style?: React.CSSProperties;
}

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
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    error: "bg-red-100 text-red-800",
    info: "bg-blue-100 text-blue-800",
    default: "bg-gray-100 text-gray-800",
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
