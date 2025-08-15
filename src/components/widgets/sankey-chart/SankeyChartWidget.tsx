"use client";

import React from "react";
import EnhancedSankeyDiagram from "./EnhancedSankeyDiagram";
import type { SankeyChartWidgetProps } from "../../../../interfaces/widgets";
import { useMobileDetection } from "../../common";

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
  const isMobile = useMobileDetection();
  const [selectedFlow, setSelectedFlow] = React.useState<string | null>(null);
  const [viewMode, setViewMode] = React.useState<"flow" | "stats" | "trends">(
    "flow"
  );
  const [animationSpeed, setAnimationSpeed] = React.useState<
    "slow" | "normal" | "fast"
  >("normal");
  const [showDetails, setShowDetails] = React.useState(false);

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
