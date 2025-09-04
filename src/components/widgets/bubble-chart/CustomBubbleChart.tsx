"use client";

import React, { useRef, useState, useMemo, useCallback } from "react";
import { WidgetBase, SlideNavigation, WidgetTitle } from "@/components/common";
import type { CustomBubbleChartProps } from "@/interfaces/charts";
import BubbleChartControls from "./BubbleChartControls";
import BubbleMetricsPanel from "./BubbleMetricsPanel";
import BubbleChartLegend from "./BubbleChartLegend";
import BubbleHeaderActions from "./BubbleHeaderActions";
import BubbleTooltip from "./BubbleTooltip";
import BubbleSceneCanvas from "./BubbleSceneCanvas";
import type {
  BubbleSceneHandle,
  BubblePoint3D,
  ThreeDBubbleData,
} from "@/interfaces/charts";
import { useTheme } from "@/hooks/useTheme";

export default function CustomBubbleChart(props: CustomBubbleChartProps) {
  const {
    data,
    title = "Enhanced 3D Bubble Chart",
    subtitle = "Interactive 3D visualization with animations and filtering",
    isMobile = false,
    onOpenSidebar,
    showSidebarButton = false,
    currentSlide,
    setCurrentSlide,
  } = props;
  const { colorsTheme } = useTheme();
  const bubbleChartColors = colorsTheme.widgets.bubbleChart;
  const sceneHandleRef = useRef<BubbleSceneHandle | null>(null);

  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    data: BubblePoint3D;
  } | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showParticles, setShowParticles] = useState(true);
  const [animationSpeed, setAnimationSpeed] = useState(1);
  const [isZoomedOut, setIsZoomedOut] = useState(false);

  const threeDData: ThreeDBubbleData[] = useMemo(() => {
    const enhancedData: ThreeDBubbleData[] = [];

    data.forEach((item) => {
      enhancedData.push({
        ...item,
        z: Math.random() * 100,
        velocity: {
          x: (Math.random() - 0.5) * 0.02,
          y: (Math.random() - 0.5) * 0.02,
          z: (Math.random() - 0.5) * 0.02,
        },
        pulsePhase: Math.random() * Math.PI * 2,
        selected: false,
      });
    });

    const categories = [
      "Big Tech",
      "AI & Cloud",
      "Fintech",
      "Emerging Tech",
      "Healthcare",
      "Energy",
    ];
    for (let i = 0; i < 30; i++) {
      const category =
        categories[Math.floor(Math.random() * categories.length)];
      enhancedData.push({
        x: Math.random() * 3000,
        y: Math.random() * 70,
        z: Math.random() * 100,
        size: Math.random() * 60 + 15,
        category: category,
        label: `${category} Company ${i + 1}`,
        velocity: {
          x: (Math.random() - 0.5) * 0.015,
          y: (Math.random() - 0.5) * 0.015,
          z: (Math.random() - 0.5) * 0.015,
        },
        pulsePhase: Math.random() * Math.PI * 2,
        selected: false,
      });
    }

    return enhancedData;
  }, [data]);

  const filteredData = useMemo(() => {
    if (!selectedCategory) return threeDData;
    return threeDData.filter((item) => item.category === selectedCategory);
  }, [threeDData, selectedCategory]);

  const getBubbleColor = useCallback(
    (category: string) => {
      const categoryColorMap: Record<string, string> = {
        "Big Tech": bubbleChartColors.categoryColors.bigTech,
        "AI & Cloud": bubbleChartColors.categoryColors.aiCloud,
        Fintech: bubbleChartColors.categoryColors.fintech,
        "Emerging Tech": bubbleChartColors.categoryColors.emergingTech,
        Healthcare: bubbleChartColors.categoryColors.healthcare,
        Energy: bubbleChartColors.categoryColors.energy,
      };
      const baseColor =
        categoryColorMap[category] || bubbleChartColors.categoryColors.default;
      return baseColor.startsWith("#") ? baseColor : `#${baseColor}`;
    },
    [bubbleChartColors]
  );

  const handleResetRotation = () => {
    sceneHandleRef.current?.resetRotation();
    setSelectedCategory(null);
  };

  const handleToggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const categories = useMemo(() => {
    return Array.from(new Set(threeDData.map((d) => d.category)));
  }, [threeDData]);

  const stats = useMemo(() => {
    const total = filteredData.length;
    const avgSize = filteredData.reduce((sum, d) => sum + d.size, 0) / total;
    const avgGrowth = filteredData.reduce((sum, d) => sum + d.y, 0) / total;
    const avgMarketCap = filteredData.reduce((sum, d) => sum + d.x, 0) / total;

    return {
      total,
      avgSize: Math.round(avgSize),
      avgGrowth: Math.round(avgGrowth),
      avgMarketCap: Math.round(avgMarketCap),
    };
  }, [filteredData]);

  const sceneData = useMemo(
    () =>
      filteredData.map((d) => ({
        x: d.x,
        y: d.y,
        z: d.z,
        size: d.size,
        category: d.category,
        label: d.label,
      })),
    [filteredData]
  );

  return (
    <WidgetBase
      className={`flex flex-col w-full ${isMobile ? "bubble-chart-widget" : ""}`}
      style={{
        width: "100%",
        height: isMobile ? "82vh" : undefined,
        padding: isMobile ? 0 : undefined,
        borderRadius: isMobile ? 0 : undefined,
      }}
      onOpenSidebar={onOpenSidebar}
      showSidebarButton={showSidebarButton}
    >
      <div
        className="w-full h-full flex flex-col"
        style={{
          padding: isMobile ? "0 1rem 1rem 1rem" : "1.5rem",
          width: "100%",
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <WidgetTitle
              title={title}
              subtitle={subtitle}
              variant={isMobile ? "centered" : "default"}
              size="md"
            />
          </div>
          <BubbleHeaderActions
            showParticles={showParticles}
            onToggleParticles={() => setShowParticles(!showParticles)}
            onReset={handleResetRotation}
            isFullscreen={isFullscreen}
            onToggleFullscreen={handleToggleFullscreen}
          />
        </div>

        <BubbleChartControls
          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          animationSpeed={animationSpeed}
          setAnimationSpeed={setAnimationSpeed}
          isZoomedOut={isZoomedOut}
          setIsZoomedOut={setIsZoomedOut}
          getCategoryHex={(c) => getBubbleColor(c).replace(/^#/, "")}
          buttonColors={bubbleChartColors.button}
        />

        <BubbleMetricsPanel stats={stats} />

        <div
          className="relative w-full"
          style={{
            width: "100%",
            height: isMobile ? "80vh" : isFullscreen ? "95vh" : "1200px",
            maxWidth: "none",
            maxHeight: isFullscreen ? "100%" : "1400px",
            margin: "0",
            borderRadius: "12px",
            overflow: "visible",
            background: "transparent",
            padding: "80px 80px 300px 80px",
          }}
        >
          <BubbleSceneCanvas
            ref={sceneHandleRef}
            data={sceneData}
            isZoomedOut={isZoomedOut}
            showParticles={showParticles}
            animationSpeed={animationSpeed}
            onHover={setTooltip}
            getCategoryColor={(c) => getBubbleColor(c)}
          />

          <BubbleTooltip
            tooltip={tooltip}
            getCategoryHex={(c) => getBubbleColor(c).replace(/^#/, "")}
          />
        </div>

        <BubbleChartLegend
          categories={categories}
          getCategoryHex={(c) => getBubbleColor(c).replace(/^#/, "")}
        />
      </div>

      {/* Navigation buttons */}
      {currentSlide !== undefined && setCurrentSlide && (
        <SlideNavigation
          currentSlide={currentSlide}
          setCurrentSlide={setCurrentSlide}
          totalSlides={17}
        />
      )}
    </WidgetBase>
  );
}
