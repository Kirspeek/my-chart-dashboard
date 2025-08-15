"use client";

import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "elevated" | "outlined";
  size?: "sm" | "md" | "lg";
  hover?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
}

export default function Card({
  children,
  className = "",
  variant = "default",
  size = "md",
  hover = false,
  onClick,
  style,
}: CardProps) {
  const baseClasses = "bg-white dark:bg-gray-800 rounded-lg border";

  const variantClasses = {
    default: "border-gray-200 dark:border-gray-700",
    elevated: "border-gray-200 dark:border-gray-700 shadow-md",
    outlined: "border-gray-300 dark:border-gray-600",
  };

  const sizeClasses = {
    sm: "p-3",
    md: "p-4",
    lg: "p-6",
  };

  const hoverClasses = hover
    ? "transition-all duration-300 hover:scale-[1.02] hover:shadow-lg cursor-pointer"
    : "";

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${hoverClasses} ${className}`;

  if (onClick) {
    return (
      <div className={classes} onClick={onClick} style={style}>
        {children}
      </div>
    );
  }

  return (
    <div className={classes} style={style}>
      {children}
    </div>
  );
}
