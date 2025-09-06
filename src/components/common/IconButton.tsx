"use client";

import React from "react";

interface IconButtonProps {
  icon: React.ReactNode;
  onClick?: () => void;
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "ghost" | "primary";
  disabled?: boolean;
  title?: string;
}

export default function IconButton({
  icon,
  onClick,
  className = "",
  size = "md",
  variant = "default",
  disabled = false,
  title,
}: IconButtonProps) {
  const baseClasses =
    "flex items-center justify-center rounded-lg transition-all duration-200 hover:scale-105 cursor-pointer";

  const sizeClasses = {
    sm: "w-6 h-6 p-1",
    md: "w-8 h-8 p-1.5",
    lg: "w-10 h-10 p-2",
  };

  const variantClasses = {
    default:
      "bg-[var(--button-bg)] hover:bg-[var(--button-hover-bg)] text-[var(--primary-text)] border border-[var(--button-border)]",
    ghost: "hover:bg-[var(--button-hover-bg)] text-[var(--primary-text)]",
    primary: "bg-blue-600 hover:bg-blue-700 text-white",
  };

  const classes = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`;

  return (
    <button
      className={classes}
      onClick={onClick}
      disabled={disabled}
      title={title}
    >
      {icon}
    </button>
  );
}
