"use client";

import React from "react";
import EnhancedSankeyDiagram from "./EnhancedSankeyDiagram";
import MigrationFlowHeader from "./MigrationFlowHeader";
import MigrationFlowControls from "./MigrationFlowControls";
import MigrationFlowStats from "./MigrationFlowStats";
import type { SankeyChartWidgetProps } from "../../../../interfaces/widgets";

export default function SankeyChartWidget({
  data,
  title,
  subtitle,
  onOpenSidebar,
  showSidebarButton = false,
  currentSlide,
  setCurrentSlide,
}: SankeyChartWidgetProps & {
  onOpenSidebar?: () => void;
  showSidebarButton?: boolean;
  currentSlide?: number;
  setCurrentSlide?: (slide: number) => void;
}) {
  // Detect mobile to apply full-screen sizing (only for phones, not tablets)
  const [isMobile, setIsMobile] = React.useState(false);
  const [selectedFlow, setSelectedFlow] = React.useState<string | null>(null);
  const [viewMode, setViewMode] = React.useState<"flow" | "stats" | "trends">(
    "flow"
  );
  const [animationSpeed, setAnimationSpeed] = React.useState<
    "slow" | "normal" | "fast"
  >("normal");
  const [showDetails, setShowDetails] = React.useState(false);

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
    <EnhancedSankeyDiagram
      data={data}
      title={title}
      subtitle={subtitle}
      isMobile={isMobile}
      selectedFlow={selectedFlow}
      setSelectedFlow={setSelectedFlow}
      viewMode={viewMode}
      setViewMode={setViewMode}
      animationSpeed={animationSpeed}
      setAnimationSpeed={setAnimationSpeed}
      showDetails={showDetails}
      setShowDetails={setShowDetails}
      onOpenSidebar={onOpenSidebar}
      showSidebarButton={showSidebarButton}
      currentSlide={currentSlide}
      setCurrentSlide={setCurrentSlide}
    />
  );
}
