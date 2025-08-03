import React from "react";

interface ChartCanvasProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onMouseDown?: (e: React.MouseEvent<Element>) => void;
  onMouseMove?: (e: React.MouseEvent<Element>) => void;
  onMouseUp?: () => void;
  onMouseLeave?: () => void;
  onClick?: (e: React.MouseEvent<Element>) => void;
}

export default function ChartCanvas({
  children,
  className = "",
  style = {},
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onMouseLeave,
  onClick,
}: ChartCanvasProps) {
  const defaultStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: "1rem 0",
    filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.1))",
    transition: "all 0.3s ease-in-out",
    ...style,
  };

  return (
    <div
      className={`chart-canvas ${className}`}
      style={defaultStyle}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
