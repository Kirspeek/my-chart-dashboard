"use client";

import React from "react";
import EnhancedChordDiagram from "./EnhancedChordDiagram";
import type { ChordChartWidgetProps } from "../../../../interfaces/widgets";
import { useMobileDetection } from "../../common";

export default function ChordChartWidget({
  data,
  title,
  subtitle,
  onOpenSidebar,
  showSidebarButton = false,
  currentSlide,
  setCurrentSlide,
}: ChordChartWidgetProps & {
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



  // Calculate totals for header
  const totalFlows = data.length;
  const totalMigration = data.reduce((sum, flow) => sum + flow.size, 0);

  return (
    <EnhancedChordDiagram
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
      totalFlows={totalFlows}
      totalMigration={totalMigration}
    />
  );
}
