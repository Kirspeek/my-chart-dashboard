"use client";

import React from "react";

interface InteractiveButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: "default" | "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  icon?: React.ReactNode;
}

export default function InteractiveButton({
  children,
  onClick,
  className = "",
  variant = "default",
  size = "md",
  disabled = false,
  icon,
}: InteractiveButtonProps) {
  const baseClasses =
    "flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 cursor-pointer";

  const variantClasses = {
    default: "bg-gray-100 hover:bg-gray-200 text-gray-700",
    primary: "bg-blue-600 hover:bg-blue-700 text-white",
    secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800",
    ghost: "hover:bg-gray-100 text-gray-600",
  };

  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-base",
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  return (
    <button className={classes} onClick={onClick} disabled={disabled}>
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </button>
  );
}
