"use client";

import React from "react";
import WidgetBase from "../../common/WidgetBase";
import { TimerWidgetProps } from "../../../../interfaces/components";

export default function TimerWidget({
  className = "",
  onOpenSidebar,
  showSidebarButton = false,
}: TimerWidgetProps & {
  onOpenSidebar?: () => void;
  showSidebarButton?: boolean;
}) {
  const isMobile = typeof window !== "undefined" && window.innerWidth <= 425;

  return (
    <WidgetBase
      style={{
        width: isMobile ? "100vw" : "100%",
        padding: isMobile ? "0rem" : "0.75rem 1rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        height: isMobile ? "82vh" : "100%",
        margin: isMobile ? "0 1rem 3rem 1rem" : undefined,
        boxSizing: "border-box",
        borderRadius: isMobile ? "2rem" : undefined,
      }}
      className={className}
      onOpenSidebar={onOpenSidebar}
      showSidebarButton={showSidebarButton}
    >
      <div
        style={{
          fontSize: isMobile ? "1.2rem" : "3rem",
          fontWeight: 700,
          fontStyle: "italic",
          color: "rgb(252, 128, 159)",
          padding: "0.1rem 0.3rem",
          whiteSpace: "nowrap",
          lineHeight: 1,
          overflow: "hidden",
        }}
      >
        Timer Coming Soon!
      </div>
    </WidgetBase>
  );
}
