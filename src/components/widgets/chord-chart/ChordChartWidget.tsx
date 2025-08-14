"use client";

import React from "react";
import EnhancedChordDiagram from "./EnhancedChordDiagram";
import MigrationFlowHeader from "../sankey-chart/MigrationFlowHeader";
import MigrationFlowControls from "../sankey-chart/MigrationFlowControls";
import MigrationFlowStats from "../sankey-chart/MigrationFlowStats";
import type { ChordChartWidgetProps } from "../../../../interfaces/widgets";

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
