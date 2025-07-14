import React from "react";
import { lightTheme } from "../../lib/theme-config";

interface WidgetCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: "default" | "compact" | "large";
  className?: string;
}

export default function WidgetCard({
  children,
  variant = "default",
  className = "",
  style = {},
  ...props
}: WidgetCardProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case "compact":
        return {
          padding: lightTheme.spacing.lg,
          minWidth: "auto",
          minHeight: "auto",
        };
      case "large":
        return {
          padding: lightTheme.spacing["2xl"],
          minWidth: "600px",
          minHeight: "480px",
          maxWidth: "800px",
        };
      default:
        return {
          padding: lightTheme.spacing.xl,
          minWidth: "auto",
          minHeight: "auto",
        };
    }
  };

  const variantStyles = getVariantStyles();

  return (
    <div
      className={`widget-card ${className}`}
      style={{
        background: lightTheme.colors.cardBackground,
        borderRadius: lightTheme.borderRadius["2xl"],
        boxShadow: lightTheme.shadows.none,
        color: lightTheme.colors.primary,
        fontFamily: lightTheme.typography.fontFamily.sans,
        ...variantStyles,
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
}
