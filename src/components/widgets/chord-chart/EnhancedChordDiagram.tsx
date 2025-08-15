"use client";

import React, {
  useRef,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import * as d3 from "d3";
import WidgetBase from "../../common/WidgetBase";
import SlideNavigation from "../../common/SlideNavigation";
import { WidgetTitle } from "../../common";
import { useTheme } from "src/hooks/useTheme";
import { useGlobalTooltip } from "src/hooks/useGlobalTooltip";
import { ArrowRight, Users, TrendingUp } from "lucide-react";
import MigrationChordControls from "./MigrationChordControls";
import MigrationChordStats from "./MigrationChordStats";
import type { WidgetChordChartData } from "../../../../interfaces/widgets";

interface EnhancedChordDiagramProps {
  data: WidgetChordChartData[];
  title: string;
  subtitle?: string;
  isMobile?: boolean;
  selectedFlow?: string | null;
  setSelectedFlow?: (flow: string | null) => void;
  viewMode?: "flow" | "stats" | "trends";
  setViewMode?: (mode: "flow" | "stats" | "trends") => void;
  animationSpeed?: "slow" | "normal" | "fast";
  setAnimationSpeed?: (speed: "slow" | "normal" | "fast") => void;
  showDetails?: boolean;
  setShowDetails?: (show: boolean) => void;
  onOpenSidebar?: () => void;
  showSidebarButton?: boolean;
  currentSlide?: number;
  setCurrentSlide?: (slide: number) => void;
  totalFlows?: number;
  totalMigration?: number;
}

const nodeOrder = ["Asia", "Europe", "Americas", "Africa", "Oceania"];

export default function EnhancedChordDiagram({
  data,
  title,
  subtitle,
  isMobile = false,
  selectedFlow,
  setSelectedFlow,
  viewMode = "flow",
  setViewMode,
  animationSpeed = "normal",
  setAnimationSpeed,
  showDetails = false,
  setShowDetails,
  onOpenSidebar,
  showSidebarButton = false,
  currentSlide,
  setCurrentSlide,
  totalFlows = 0,
  totalMigration = 0,
}: EnhancedChordDiagramProps) {
  const ref = useRef<SVGSVGElement>(null);
  const { accent, colors, isDark } = useTheme();
  const { createTooltipHandlers } = useGlobalTooltip();

  const flowColorMap = useMemo(() => {
    const flowColors = [
      `${colors.accent.blue}60`, // Blue with 60% opacity
      `${colors.accent.teal}60`, // Teal with 60% opacity
      `${colors.accent.yellow}60`, // Yellow with 60% opacity
      `${colors.accent.red}60`, // Red with 60% opacity
    ];

    const map = new Map<string, string>();
    // Assign colors to flows consistently
    data.forEach((link, index) => {
      const flowKey = `${link.from}→${link.to}`;
      if (!map.has(flowKey)) {
        map.set(flowKey, flowColors[index % flowColors.length]);
      }
    });
    return map;
  }, [
    data,
    colors.accent.blue,
    colors.accent.teal,
    colors.accent.yellow,
    colors.accent.red,
  ]);

  const getFlowColor = useCallback(
    (flowKey: string) => {
      return flowColorMap.get(flowKey) || `${colors.accent.blue}60`;
    },
    [flowColorMap, colors.accent.blue]
  );

  const [hoveredRibbon, setHoveredRibbon] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [animationFrame, setAnimationFrame] = useState(0);

  // Build a denser matrix if data is sparse
  const n = nodeOrder.length;
  const matrix = Array.from({ length: n }, () => Array(n).fill(0));
  data.forEach(({ from, to, size }) => {
    const i = nodeOrder.indexOf(from);
    const j = nodeOrder.indexOf(to);
    if (i !== -1 && j !== -1) matrix[i][j] = size;
  });

  // Animation loop
  useEffect(() => {
    if (!isPlaying) return;
    const speedMultiplier = { slow: 0.5, normal: 1, fast: 2 }[animationSpeed];
    const interval = setInterval(() => {
      setAnimationFrame((prev) => (prev + 1) % 360);
    }, 50 / speedMultiplier);
    return () => clearInterval(interval);
  }, [isPlaying, animationSpeed]);

  // Reset function
  const handleReset = () => {
    setSelectedFlow?.(null);
    setHoveredRibbon(null);
    setIsPlaying(true);
    setAnimationFrame(0);
  };

  useEffect(() => {
    // Get the actual container dimensions
    const container = ref.current?.parentElement;
    if (!container || viewMode !== "flow") return;

    const updateChart = () => {
      const containerRect = container.getBoundingClientRect();
      const width = isMobile ? Math.min(containerRect.width * 0.9, 400) : 400;
      const height = isMobile
        ? Math.min(containerRect.height * 0.85, 400)
        : 400;
      const innerRadius = isMobile
        ? Math.min(containerRect.width * 0.12, 96)
        : 96;
      const outerRadius = isMobile
        ? Math.min(containerRect.width * 0.13, 100)
        : 100;

      const svg = d3
        .select(ref.current)
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("viewBox", [0, 0, width, height].join(" "))
        .attr("preserveAspectRatio", "xMidYMid meet")
        .style("display", "block")
        .style("margin", "0 auto")
        .on("mouseleave", function () {
          setHoveredRibbon(null);
        });
      svg.selectAll("*").remove();

      // Add subtle background pattern
      const bgDefs = svg.append("defs");
      const pattern = bgDefs
        .append("pattern")
        .attr("id", "backgroundPattern")
        .attr("patternUnits", "userSpaceOnUse")
        .attr("width", "20")
        .attr("height", "20");

      pattern
        .append("circle")
        .attr("cx", "10")
        .attr("cy", "10")
        .attr("r", "1")
        .attr("fill", isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)");

      // Add background
      svg
        .append("rect")
        .attr("width", width)
        .attr("height", height)
        .attr("fill", "url(#backgroundPattern)");

      const chord = d3.chord().padAngle(0.05).sortSubgroups(d3.descending)(
        matrix
      );
      const arcGen = d3
        .arc<d3.ChordGroup>()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius);
      const ribbonGen = d3
        .ribbon<d3.Chord, d3.ChordSubgroup>()
        .radius(innerRadius);

      // Draw groups (arcs) with enhanced styling
      svg
        .append("g")
        .attr("transform", `translate(${width / 2},${height / 2})`)
        .selectAll("path")
        .data(chord.groups)
        .join("path")
        .attr("d", arcGen)
        .attr("fill", "rgb(66, 91, 89)")
        .attr("stroke", "rgb(66, 91, 89)")
        .attr("stroke-width", 1)
        .attr("cursor", "pointer")
        .style("filter", "drop-shadow(0 3px 6px rgba(0,0,0,0.15))")
        .style("transition", "all 0.3s ease")
        .on("mouseenter", function () {
          d3.select(this)
            .style("filter", "drop-shadow(0 4px 8px rgba(0,0,0,0.2))")
            .style("transform", "scale(1.03)")
            .style("stroke-width", "3");
        })
        .on("mouseleave", function () {
          d3.select(this)
            .style("filter", "drop-shadow(0 3px 6px rgba(0,0,0,0.15))")
            .style("transform", "scale(1)")
            .style("stroke-width", "1");
        });

      // Draw ribbons (flows) with enhanced styling
      svg
        .append("g")
        .attr("transform", `translate(${width / 2},${height / 2})`)
        .selectAll("path")
        .data(chord)
        .join("path")
        .attr("d", ribbonGen)
        .attr("fill", (d: d3.Chord) => {
          const sourceName = nodeOrder[d.source.index];
          const targetName = nodeOrder[d.target.index];
          const flowKey = `${sourceName}→${targetName}`;
          return getFlowColor(flowKey);
        })
        .attr("opacity", (d, i) => {
          if (hoveredRibbon === i) return 1.0;
          if (hoveredRibbon !== null && hoveredRibbon !== i) return 0.4;
          if (isPlaying) {
            const phase = (animationFrame + i * 30) % 360;
            return 0.5 + 0.2 * Math.sin((phase * Math.PI) / 180);
          }
          return 0.6;
        })
        .attr("cursor", "pointer")
        .style("filter", (d, i) =>
          hoveredRibbon === i
            ? "drop-shadow(0 4px 8px rgba(0,0,0,0.25))"
            : "drop-shadow(0 2px 4px rgba(0,0,0,0.15))"
        )
        .style("transition", "all 0.2s ease")
        .on("mousemove", function (event, d) {
          setHoveredRibbon(chord.indexOf(d));
          const sourceName = nodeOrder[d.source.index];
          const targetName = nodeOrder[d.target.index];

          // Show global tooltip
          const tooltipHandlers = createTooltipHandlers(
            `${sourceName} - ${targetName}`
          );
          tooltipHandlers.onMouseEnter?.(event);
        })
        .on("mouseleave", function () {
          setHoveredRibbon(null);
          const tooltipHandlers = createTooltipHandlers("");
          tooltipHandlers.onMouseLeave?.();
        })
        .on("click", function (event, d) {
          const sourceName = nodeOrder[d.source.index];
          const targetName = nodeOrder[d.target.index];
          const flowKey = `${sourceName}→${targetName}`;
          setSelectedFlow?.(flowKey);
        });

      // Add labels with enhanced styling
      svg
        .append("g")
        .attr("transform", `translate(${width / 2},${height / 2})`)
        .selectAll("text")
        .data(chord.groups)
        .join("text")
        .each(function (d) {
          const group = d3.select(this);
          const angle = (d.startAngle + d.endAngle) / 2;
          const x = Math.cos(angle - Math.PI / 2) * (outerRadius + 20);
          const y = Math.sin(angle - Math.PI / 2) * (outerRadius + 20);
          group
            .attr("x", x)
            .attr("y", y)
            .attr("dy", "0.35em")
            .attr("text-anchor", x < 0 ? "end" : "start")
            .text(nodeOrder[d.index])
            .style("font-family", "var(--font-mono)")
            .style("font-size", isMobile ? "8px" : "12px")
            .style("font-weight", "700")
            .style("fill", "rgb(66, 91, 89)")
            .style("pointer-events", "none")
            .style(
              "text-shadow",
              isDark
                ? "0 2px 4px rgba(0,0,0,0.8), 0 1px 2px rgba(0,0,0,0.5)"
                : "0 2px 4px rgba(255,255,255,0.9), 0 1px 2px rgba(0,0,0,0.3)"
            )
            .style("letter-spacing", "0.02em");
        });
    };

    updateChart(); // Initial call

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width > 0 && entry.contentRect.height > 0) {
          updateChart();
        }
      }
    });

    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
    };
  }, [
    data,
    accent,
    colors,
    hoveredRibbon,
    isPlaying,
    animationFrame,
    animationSpeed,
    viewMode,
    isMobile,
    getFlowColor,
    createTooltipHandlers,
    setSelectedFlow,
    isDark,
    matrix,
  ]);

  return (
    <WidgetBase
      className={`flex flex-col ${isMobile ? "chord-chart-widget" : ""}`}
      style={{
        width: isMobile ? "100vw" : undefined,
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
        }}
      >
        <WidgetTitle
          title={title}
          subtitle={subtitle}
          variant={isMobile ? "centered" : "default"}
          size="md"
        />

        {/* Compact Stats Cards */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          {/* Total Flows Card */}
          <div
            className="relative p-3 rounded-lg overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${colors.accent.blue}15, ${colors.accent.blue}05)`,
              border: `1px solid ${colors.accent.blue}25`,
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p
                  className="text-xs font-medium mb-1 opacity-70"
                  style={{ color: colors.secondary }}
                >
                  Total Flows
                </p>
                <p
                  className="text-sm font-bold"
                  style={{ color: colors.primary }}
                >
                  {totalFlows.toLocaleString()}
                </p>
              </div>
              <div
                className="p-1.5 rounded-md"
                style={{ backgroundColor: `${colors.accent.blue}20` }}
              >
                <ArrowRight size={12} style={{ color: colors.accent.blue }} />
              </div>
            </div>
          </div>

          {/* Total Migration Card */}
          <div
            className="relative p-3 rounded-lg overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${colors.accent.teal}15, ${colors.accent.teal}05)`,
              border: `1px solid ${colors.accent.teal}25`,
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p
                  className="text-xs font-medium mb-1 opacity-70"
                  style={{ color: colors.secondary }}
                >
                  Migration Volume
                </p>
                <p
                  className="text-sm font-bold"
                  style={{ color: colors.primary }}
                >
                  {totalMigration.toFixed(1)}M
                </p>
              </div>
              <div
                className="p-1.5 rounded-md"
                style={{ backgroundColor: `${colors.accent.teal}20` }}
              >
                <Users size={12} style={{ color: colors.accent.teal }} />
              </div>
            </div>
          </div>
        </div>

        {/* Selected Flow Display */}
        {selectedFlow && (
          <div
            className="p-2 rounded-lg border border-dashed mb-3"
            style={{
              borderColor: `${colors.accent.yellow}40`,
              background: `linear-gradient(135deg, ${colors.accent.yellow}10, ${colors.accent.yellow}05)`,
            }}
          >
            <div className="flex items-center space-x-2">
              <TrendingUp size={14} style={{ color: colors.accent.yellow }} />
              <span
                className="text-xs font-medium"
                style={{ color: colors.primary }}
              >
                Selected: {selectedFlow}
              </span>
            </div>
          </div>
        )}

        {setViewMode && setAnimationSpeed && setShowDetails && (
          <MigrationChordControls
            viewMode={viewMode}
            setViewMode={setViewMode}
            animationSpeed={animationSpeed}
            setAnimationSpeed={setAnimationSpeed}
            showDetails={showDetails}
            setShowDetails={setShowDetails}
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying}
            onReset={handleReset}
            isMobile={isMobile}
          />
        )}

        <div className="flex-1 min-h-0 mt-4">
          {viewMode === "flow" && (
            <div
              className="relative"
              style={{
                width: "100%",
                height: isMobile ? "35vh" : "350px",
                maxWidth: "400px",
                maxHeight: "400px",
                margin: "0 auto",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
              }}
              onMouseLeave={() => {
                setHoveredRibbon(null);
              }}
            >
              <svg
                ref={ref}
                style={{
                  width: "100%",
                  height: "100%",
                  maxWidth: "100%",
                  maxHeight: "100%",
                }}
              />
            </div>
          )}

          {viewMode === "stats" && (
            <MigrationChordStats
              data={data}
              selectedFlow={selectedFlow}
              setSelectedFlow={setSelectedFlow}
            />
          )}

          {viewMode === "trends" && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="text-lg font-bold mb-2">Migration Trends</div>
                <div className="text-sm text-gray-500">
                  Trend analysis coming soon...
                </div>
              </div>
            </div>
          )}
        </div>
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
