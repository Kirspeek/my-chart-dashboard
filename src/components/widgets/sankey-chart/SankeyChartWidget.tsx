"use client";

import React from "react";
import CustomSankeyDiagram from "./CustomSankeyDiagram";
import type { SankeyChartWidgetProps } from "../../../../interfaces/widgets";

export default function SankeyChartWidget({
  data,
  title,
  subtitle,
  onOpenSidebar,
  showSidebarButton = false,
}: SankeyChartWidgetProps & {
  onOpenSidebar?: () => void;
  showSidebarButton?: boolean;
}) {
  // Detect mobile to apply full-screen sizing (only for phones, not tablets)
  const [isMobile, setIsMobile] = React.useState(false);
  React.useEffect(() => {
    const check = () => {
      if (typeof window !== "undefined") {
        // Only apply mobile styling for phones (≤425px), tablets use desktop version
        setIsMobile(window.innerWidth <= 425);
      }
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <CustomSankeyDiagram
      data={data}
      title={title}
      subtitle={subtitle}
      isMobile={isMobile}
      onOpenSidebar={onOpenSidebar}
      showSidebarButton={showSidebarButton}
    />
  );
}
