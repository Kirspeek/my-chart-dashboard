"use client";

import React from "react";

interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
  barClassName?: string;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "success" | "warning" | "error";
}

export default function ProgressBar({
  value,
  max = 100,
  className = "",
  barClassName = "",
  showLabel = false,
  size = "md",
  variant = "default",
}: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100);

  const baseClasses = "w-full bg-gray-200 rounded-full overflow-hidden";
  const sizeClasses = {
    sm: "h-1",
    md: "h-1.5",
    lg: "h-2",
  };

  const variantClasses = {
    default: "bg-gradient-to-r from-gray-400 to-gray-500",
    success: "bg-gradient-to-r from-green-400 to-green-500",
    warning: "bg-gradient-to-r from-yellow-400 to-yellow-500",
    error: "bg-gradient-to-r from-red-400 to-red-500",
  };

  const barClasses = `h-full rounded-full transition-all duration-300 ${variantClasses[variant]} ${barClassName}`;

  return (
    <div className={`${baseClasses} ${sizeClasses[size]} ${className}`}>
      <div className={barClasses} style={{ width: `${percentage}%` }} />
      {showLabel && (
        <div className="text-xs text-gray-600 mt-1">
          {Math.round(percentage)}%
        </div>
      )}
    </div>
  );
}
