import React from "react";
import { CommonComponentProps } from "@/interfaces";

interface WidgetContainerProps extends CommonComponentProps {
  children: React.ReactNode;
  className?: string;
}

export default function WidgetContainer({
  children,
  className = "",
  style = {},
}: WidgetContainerProps) {
  return (
    <div
      className={`widget-container ${className}`}
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
