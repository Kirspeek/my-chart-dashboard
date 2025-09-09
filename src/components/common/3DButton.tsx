"use client";
import React from "react";
import { Button3DProps } from "@/interfaces/components";
import { useTheme } from "@/hooks/useTheme";

export default function Button3D({
  children,
  onClick,
  selected = false,
  className = "",
  style = {},
  disabled = false,
  customBackground,
  customAccentColor,
}: Button3DProps) {
  const { accent } = useTheme();
  const defaultAccentColor = accent.teal; // Default to teal for calendar
  const accentColor = customAccentColor || defaultAccentColor;

  const baseStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "1.5rem 2rem",
    borderRadius: "2rem",
    minWidth: 180,
    minHeight: 110,
    cursor: disabled ? "not-allowed" : "pointer",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    border: "none",
    outline: "none",
    position: "relative",
    fontFamily: "var(--font-mono)",
    fontWeight: 700,
    fontSize: "1rem",
    userSelect: "none",
    WebkitUserSelect: "none",
    MozUserSelect: "none",
    msUserSelect: "none",
    ...style,
  };

  const getBackground = (state: "normal" | "hover" | "active") => {
    if (customBackground) {
      // For custom backgrounds (like weather themes), use the same background in all states
      return customBackground;
    }

    if (selected) {
      return accentColor;
    }

    switch (state) {
      case "normal":
        return "var(--button-bg)";
      case "hover":
        return "var(--button-hover-bg)";
      case "active":
        return "var(--button-active-bg)";
      default:
        return "var(--button-bg)";
    }
  };

  const getBoxShadow = (state: "normal" | "hover" | "active") => {
    if (selected) {
      return "inset 0 4px 8px rgba(0, 0, 0, 0.2), inset 0 -1px 2px rgba(255, 255, 255, 0.1), 0 4px 8px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.1)";
    }

    switch (state) {
      case "normal":
        return "0 4px 8px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)";
      case "hover":
        return "0 6px 12px rgba(0, 0, 0, 0.18), 0 3px 6px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.15)";
      case "active":
        return "inset 0 4px 8px rgba(0, 0, 0, 0.3), inset 0 -1px 2px rgba(255, 255, 255, 0.1), 0 4px 8px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.1)";
      default:
        return "0 4px 8px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)";
    }
  };

  const getTransform = (state: "normal" | "hover" | "active") => {
    if (selected) {
      return "translateY(2px)";
    }

    switch (state) {
      case "normal":
        return "translateY(0)";
      case "hover":
        return "translateY(-1px)";
      case "active":
        return "translateY(2px)";
      default:
        return "translateY(0)";
    }
  };

  const normalStyle: React.CSSProperties = {
    ...baseStyle,
    background: getBackground("normal"),
    color: selected ? "#fff" : "var(--secondary-text)",
    boxShadow: getBoxShadow("normal"),
    transform: getTransform("normal"),
  };

  const hoverStyle: React.CSSProperties = {
    ...baseStyle,
    background: getBackground("hover"),
    color: selected ? "#fff" : "var(--secondary-text)",
    boxShadow: getBoxShadow("hover"),
    transform: getTransform("hover"),
  };

  const activeStyle: React.CSSProperties = {
    ...baseStyle,
    background: getBackground("active"),
    color: selected ? "#fff" : "var(--secondary-text)",
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
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled}
    >
      {children}
    </div>
  );
}
