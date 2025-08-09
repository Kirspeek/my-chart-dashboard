import React from "react";
import { useTheme } from "../../hooks/useTheme";

interface RefreshButtonProps {
  onRefresh?: () => void;
  className?: string;
  style?: React.CSSProperties;
  icon?: string;
  title?: string;
}

export default function RefreshButton({
  onRefresh,
  className = "",
  style = {},
  icon = "↻",
  title = "Refresh",
}: RefreshButtonProps) {
  const { isDark, colors } = useTheme();

  const baseBg = colors.cardBackground;
  const hoverBg = isDark ? "rgba(255,255,255,0.12)" : "rgba(35,35,35,0.12)";
  const activeBg = isDark ? "rgba(255,255,255,0.18)" : "rgba(35,35,35,0.18)";
  const textColor = colors.primary;

  const defaultStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: 36,
    height: 36,
    border: "0",
    background: baseBg,
    color: textColor,
    borderRadius: 10,
    boxShadow:
      "0 8px 14px rgba(0,0,0,0.06), 0 2px 5px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.2)",
    backdropFilter: "blur(2px)",
    cursor: "pointer",
    transition:
      "background-color 0.2s ease, transform 0.1s ease, box-shadow 0.2s ease",
    ...style,
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.background = hoverBg;
    e.currentTarget.style.boxShadow =
      "0 10px 18px rgba(0,0,0,0.08), 0 3px 8px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.25)";
    e.currentTarget.style.transform = "translateY(-1px)";
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.background = baseBg;
    e.currentTarget.style.boxShadow =
      "0 8px 14px rgba(0,0,0,0.06), 0 2px 5px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.2)";
    e.currentTarget.style.transform = "translateY(0)";
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.background = activeBg;
    e.currentTarget.style.transform = "translateY(0)";
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.background = hoverBg;
  };

  return (
    <button
      className={`refresh-button ${className}`}
      style={defaultStyle}
      onClick={onRefresh}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      title={title}
      aria-label={title}
    >
      <span
        style={{
          fontSize: "1em",
          fontWeight: 700,
          color: textColor,
        }}
      >
        {icon}
      </span>
    </button>
  );
}
