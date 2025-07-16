"use client";
import React from "react";
import { Button3DProps } from "../../../interfaces/components";
import { useTheme } from "../../hooks/useTheme";

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
        return "rgba(35, 35, 35, 0.07)";
      case "hover":
        return "rgba(35, 35, 35, 0.12)";
      case "active":
        return "rgba(35, 35, 35, 0.18)";
      default:
        return "rgba(35, 35, 35, 0.07)";
    }
  };

  const normalStyle: React.CSSProperties = {
    ...baseStyle,
    background: getBackground("normal"),
    color: selected ? "#fff" : "#232323",
    boxShadow: selected
      ? "inset 0 4px 8px rgba(0, 0, 0, 0.2), inset 0 -1px 2px rgba(255, 255, 255, 0.1), 0 1px 2px rgba(0, 0, 0, 0.1)"
      : "0 4px 8px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
    transform: selected ? "translateY(2px)" : "translateY(0)",
  };

  const hoverStyle: React.CSSProperties = {
    ...baseStyle,
    background: getBackground("hover"),
    color: selected ? "#fff" : "#232323",
    boxShadow: selected
      ? "inset 0 4px 8px rgba(0, 0, 0, 0.2), inset 0 -1px 2px rgba(255, 255, 255, 0.1), 0 1px 2px rgba(0, 0, 0, 0.1)"
      : "0 6px 12px rgba(0, 0, 0, 0.15), 0 3px 6px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.15)",
    transform: selected ? "translateY(2px)" : "translateY(-1px)",
  };

  const activeStyle: React.CSSProperties = {
    ...baseStyle,
    background: getBackground("active"),
    color: selected ? "#fff" : "#232323",
    boxShadow:
      "inset 0 4px 8px rgba(0, 0, 0, 0.3), inset 0 -1px 2px rgba(255, 255, 255, 0.1), 0 1px 2px rgba(0, 0, 0, 0.1)",
    transform: "translateY(2px)",
  };

  const [isHovered, setIsHovered] = React.useState(false);
  const [isPressed, setIsPressed] = React.useState(false);

  const currentStyle = isPressed
    ? activeStyle
    : isHovered
      ? hoverStyle
      : normalStyle;

  return (
    <div
      className={className}
      style={currentStyle}
      onClick={disabled ? undefined : onClick}
      onMouseEnter={() => !disabled && setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsPressed(false);
      }}
      onMouseDown={() => !disabled && setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onTouchStart={() => !disabled && setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
    >
      {children}
    </div>
  );
}
