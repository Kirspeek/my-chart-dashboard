"use client";

import React from "react";
import CustomChordDiagram from "./CustomChordDiagram";
import type { ChordChartWidgetProps } from "../../../../interfaces/widgets";

export default function ChordChartWidget({
  data,
  title,
  subtitle,
  onOpenSidebar,
  showSidebarButton = false,
}: ChordChartWidgetProps & {
  onOpenSidebar?: () => void;
  showSidebarButton?: boolean;
}) {
  const [isMobile, setIsMobile] = React.useState(false);
  React.useEffect(() => {
    const check = () => {
      if (typeof window !== "undefined") {
        setIsMobile(window.innerWidth <= 425);
      }
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <CustomChordDiagram
      data={data}
      title={title}
      subtitle={subtitle}
      isMobile={isMobile}
      onOpenSidebar={onOpenSidebar}
      showSidebarButton={showSidebarButton}
    />
  );
}
