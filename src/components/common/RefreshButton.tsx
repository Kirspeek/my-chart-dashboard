import React from "react";

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
  const defaultStyle: React.CSSProperties = {
    border: "none",
    background: "rgba(0, 0, 0, 0.1)",
    color: "#333",
    borderRadius: "5px",
    padding: "0.25em 1em",
    fontSize: "1em",
    cursor: "pointer",
    transition: "background-color 0.2s ease",
    ...style,
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.background = "rgba(0, 0, 0, 0.2)";
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.background = "rgba(0, 0, 0, 0.1)";
  };

  return (
    <button
      className={`refresh-button ${className}`}
      style={defaultStyle}
      onClick={onRefresh}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      title={title}
    >
      <span style={{ fontSize: "1.2em", fontWeight: "bold" }}>{icon}</span>
    </button>
  );
}
