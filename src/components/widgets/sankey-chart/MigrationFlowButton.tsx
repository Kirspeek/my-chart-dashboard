"use client";

import React from "react";
import { useTheme } from "@/hooks/useTheme";
import { useGlobalTooltip } from "@/hooks/useGlobalTooltip";
import type { MigrationFlowButtonProps } from "@/interfaces/components";

export default function MigrationFlowButton({
  children,
  onClick,
  selected = false,
  className = "",
  style = {},
  disabled = false,
  variant = "primary",
  size = "md",
  icon,
  tooltip,
  tooltipTitle,
  tooltipSubtitle,
}: MigrationFlowButtonProps) {
  const { colors, isDark, colorsTheme } = useTheme();
  const sankeyChartColors = colorsTheme.widgets.sankeyChart;
  const { createTooltipHandlers } = useGlobalTooltip({
    title: tooltipTitle,
    subtitle: tooltipSubtitle,
  });

  const getVariantColors = () => {
    switch (variant) {
      case "primary":
        return {
          bg: `${colors.accent.blue}80`,
          hover: `${colors.accent.blue}90`,
          active: colors.accent.blue,
          text: sankeyChartColors.button.text,
        };
      case "secondary":
        return {
          bg: isDark
            ? "rgba(255, 255, 255, 0.06)"
            : "rgba(255, 255, 255, 0.08)",
          hover: isDark
            ? "rgba(255, 255, 255, 0.12)"
            : "rgba(255, 255, 255, 0.15)",
          active: isDark
            ? "rgba(255, 255, 255, 0.2)"
            : "rgba(255, 255, 255, 0.25)",
          text: colors.primary,
        };
      case "accent":
        return {
          bg: `${colors.accent.teal}80`,
          hover: `${colors.accent.teal}90`,
          active: colors.accent.teal,
          text: sankeyChartColors.button.text,
        };
      case "danger":
        return {
          bg: `${colors.accent.red}80`,
          hover: `${colors.accent.red}90`,
          active: colors.accent.red,
          text: sankeyChartColors.button.text,
        };
      default:
        return {
          bg: `${colors.accent.blue}80`,
          hover: `${colors.accent.blue}90`,
          active: colors.accent.blue,
          text: sankeyChartColors.button.text,
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case "sm":
        return {
          padding: "0.375rem 0.75rem",
          fontSize: "0.75rem",
          minHeight: "1.75rem",
          borderRadius: "0.5rem",
        };
      case "md":
        return {
          padding: "0.5rem 1rem",
          fontSize: "0.875rem",
          minHeight: "2rem",
          borderRadius: "0.75rem",
        };
      case "lg":
        return {
          padding: "0.75rem 1.5rem",
          fontSize: "1rem",
          minHeight: "2.5rem",
          borderRadius: "1rem",
        };
      default:
        return {
          padding: "0.5rem 1rem",
          fontSize: "0.875rem",
          minHeight: "2rem",
          borderRadius: "0.75rem",
        };
    }
  };

  const variantColors = getVariantColors();
  const sizeStyles = getSizeStyles();

  const baseStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    cursor: disabled ? "not-allowed" : "pointer",
    transition: "all 0.2s ease",
    border: isDark
      ? "1px solid rgba(255, 255, 255, 0.1)"
      : "1px solid rgba(255, 255, 255, 0.08)",
    outline: "none",
    position: "relative",
    fontFamily: "var(--font-mono)",
    fontWeight: 600,
    userSelect: "none",
    WebkitUserSelect: "none",
    MozUserSelect: "none",
    msUserSelect: "none",
    backdropFilter: "blur(8px)",
    ...sizeStyles,
    ...style,
  };

  const getBackground = (state: "normal" | "hover" | "active") => {
    if (selected) {
      return variantColors.bg;
    }

    switch (state) {
      case "normal":
        return variantColors.bg;
      case "hover":
        return variantColors.hover;
      case "active":
        return variantColors.active;
      default:
        return variantColors.bg;
    }
  };

  const getBoxShadow = (state: "normal" | "hover" | "active") => {
    const baseShadow = "0 1px 2px rgba(0,0,0,0.03)";
    const hoverShadow = "0 2px 4px rgba(0,0,0,0.06)";
    const activeShadow = "0 1px 1px rgba(0,0,0,0.05)";

    switch (state) {
      case "normal":
        return baseShadow;
      case "hover":
        return hoverShadow;
      case "active":
        return activeShadow;
      default:
        return baseShadow;
    }
  };

  const getTransform = (state: "normal" | "hover" | "active") => {
    switch (state) {
      case "normal":
        return "translateY(0)";
      case "hover":
        return "translateY(-2px)";
      case "active":
        return "translateY(0)";
      default:
        return "translateY(0)";
    }
  };

  const normalStyle: React.CSSProperties = {
    ...baseStyle,
    background: getBackground("normal"),
    color: variantColors.text,
    boxShadow: getBoxShadow("normal"),
    transform: getTransform("normal"),
  };

  const hoverStyle: React.CSSProperties = {
    ...baseStyle,
    background: getBackground("hover"),
    color: variantColors.text,
    boxShadow: getBoxShadow("hover"),
    transform: getTransform("hover"),
  };

  const activeStyle: React.CSSProperties = {
    ...baseStyle,
    background: getBackground("active"),
    color: variantColors.text,
    boxShadow: getBoxShadow("active"),
    transform: getTransform("active"),
  };

  const [isHovered, setIsHovered] = React.useState(false);
  const [isPressed, setIsPressed] = React.useState(false);

  const currentStyle = isPressed
    ? activeStyle
    : isHovered
      ? hoverStyle
      : normalStyle;

  const handleMouseEnter = () => {
    if (!disabled) {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setIsPressed(false);
  };

  const handleMouseDown = () => {
    if (!disabled) {
      setIsPressed(true);
    }
  };

  const handleMouseUp = () => {
    setIsPressed(false);
  };

  const handleClick = () => {
    if (!disabled && onClick) {
      onClick();
    }
  };

  // Tooltip handlers
  const tooltipHandlers = tooltip ? createTooltipHandlers(tooltip) : {};

  return (
    <div
      className={className}
      style={currentStyle}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onTouchStart={handleMouseDown}
      onTouchEnd={handleMouseUp}
      {...tooltipHandlers}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </div>
  );
}
