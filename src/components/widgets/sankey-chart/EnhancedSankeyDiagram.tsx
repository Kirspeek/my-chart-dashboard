"use client";

import React, { useRef, useEffect, useState, useMemo } from "react";
import * as d3 from "d3";
import WidgetBase from "../../common/WidgetBase";
import SlideNavigation from "../../common/SlideNavigation";
import MigrationFlowHeader from "./MigrationFlowHeader";
import MigrationFlowControls from "./MigrationFlowControls";
import MigrationFlowStats from "./MigrationFlowStats";
import { useTheme } from "src/hooks/useTheme";
import type { WidgetSankeyChartData } from "../../../../interfaces/widgets";

interface EnhancedSankeyDiagramProps {
  data: WidgetSankeyChartData[];
  title: string;
  subtitle?: string;
  isMobile?: boolean;
  selectedFlow: string | null;
  setSelectedFlow: (flow: string | null) => void;
  viewMode: "flow" | "stats" | "trends";
  setViewMode: (mode: "flow" | "stats" | "trends") => void;
  animationSpeed: "slow" | "normal" | "fast";
  setAnimationSpeed: (speed: "slow" | "normal" | "fast") => void;
  showDetails: boolean;
  setShowDetails: (show: boolean) => void;
  onOpenSidebar?: () => void;
  showSidebarButton?: boolean;
  currentSlide?: number;
  setCurrentSlide?: (slide: number) => void;
}

interface SankeyNode {
  id: string;
  name: string;
  value: number;
  x0?: number;
  x1?: number;
  y0?: number;
  y1?: number;
  column: number;
}

interface SankeyLink {
  source: string | SankeyNode;
  target: string | SankeyNode;
  value: number;
  width?: number;
  flowKey?: string;
}

export default function EnhancedSankeyDiagram({
  data,
  title,
  subtitle,
  isMobile = false,
  selectedFlow,
  setSelectedFlow,
  viewMode,
  setViewMode,
  animationSpeed,
  setAnimationSpeed,
  showDetails,
  setShowDetails,
  onOpenSidebar,
  showSidebarButton = false,
  currentSlide,
  setCurrentSlide,
}: EnhancedSankeyDiagramProps) {
  const ref = useRef<SVGSVGElement>(null);
  const { accent, colors, isDark, colorsTheme } = useTheme();
  const sankeyChartColors = colorsTheme.widgets.sankeyChart;
  const [hoveredFlow, setHoveredFlow] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    from: string;
    to: string;
    value: number;
  } | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [animationFrame, setAnimationFrame] = useState(0);

  // Calculate totals for header
  const totalFlows = data.length;
  const totalMigration = data.reduce((sum, flow) => sum + flow.size, 0);

  // Extract nodes and create Sankey structure
  const sourceNodes = useMemo(() => new Set(data.map((d) => d.from)), [data]);
  const targetNodes = useMemo(() => new Set(data.map((d) => d.to)), [data]);

  const sankeyNodes: SankeyNode[] = useMemo(
    () => [
      ...Array.from(sourceNodes).map((name) => ({
        id: name,
        name,
        value: 0,
        column: 0,
      })),
      { id: "Major Flows", name: "Major Flows", value: 0, column: 1 },
      { id: "Minor Flows", name: "Minor Flows", value: 0, column: 1 },
      ...Array.from(targetNodes).map((name) => ({
        id: name,
        name,
        value: 0,
        column: 2,
      })),
    ],
    [sourceNodes, targetNodes]
  );

  // Calculate node values
  useEffect(() => {
    sankeyNodes.forEach((node) => {
      if (node.column === 0) {
        node.value = data
          .filter((d) => d.from === node.name)
          .reduce((sum, d) => sum + d.size, 0);
      } else if (node.column === 1) {
        if (node.name === "Major Flows") {
          node.value = data
            .filter((d) => d.size > 1.0)
            .reduce((sum, d) => sum + d.size, 0);
        } else {
          node.value = data
            .filter((d) => d.size <= 1.0)
            .reduce((sum, d) => sum + d.size, 0);
        }
      } else {
        node.value = data
          .filter((d) => d.to === node.name)
          .reduce((sum, d) => sum + d.size, 0);
      }
    });
  }, [data, sankeyNodes]);

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
    setSelectedFlow(null);
    setHoveredFlow(null);
    setTooltip(null);
    setAnimationFrame(0);
  };

  // D3 Chart rendering
  useEffect(() => {
    const container = ref.current?.parentElement;
    if (!container || viewMode !== "flow") return;

    const updateChart = () => {
      const containerRect = container.getBoundingClientRect();
      const width = isMobile ? Math.min(containerRect.width * 0.9, 780) : 780;
      const height = isMobile
        ? Math.min(containerRect.height * 0.85, 380)
        : 380;
      const margin = { top: 30, right: 40, bottom: 30, left: 40 };

      const svg = d3
        .select(ref.current)
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("viewBox", [0, 0, width, height].join(" "))
        .attr("preserveAspectRatio", "xMidYMid meet")
        .style("display", "block")
        .style("margin", "0 auto")
        .on("mouseleave", function () {
          setHoveredFlow(null);
          setTooltip(null);
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
        .attr("fill", sankeyChartColors.background.pattern);

      // Layout nodes
      const nodeWidth = isMobile ? 1 : 2;
      const columnWidth =
        (width - margin.left - margin.right - nodeWidth * 3) / 2;
      const nodesByColumn = d3.group(sankeyNodes, (d) => d.column);

      nodesByColumn.forEach((nodes, column) => {
        const x = margin.left + column * (columnWidth + nodeWidth);
        const totalHeight = height - margin.top - margin.bottom;
        const nodeHeight = totalHeight / nodes.length;

        nodes.forEach((node, i) => {
          node.x0 = x;
          node.x1 = x + nodeWidth;
          node.y0 = margin.top + i * nodeHeight;
          // Increase height for side dividers (column 0 and 2)
          const heightMultiplier = node.column === 1 ? 0.6 : 1.5;
          node.y1 = node.y0 + nodeHeight * heightMultiplier;
        });
      });

      // Create links
      const sankeyLinksData: SankeyLink[] = [];
      const flowPaths = new Map<
        string,
        { source: string; target: string; value: number }
      >();

      data.forEach((link) => {
        const sourceNode = sankeyNodes.find(
          (n) => n.name === link.from && n.column === 0
        );
        const isMajorFlow = link.size > 1.0;
        const intermediateNode = sankeyNodes.find(
          (n) =>
            n.name === (isMajorFlow ? "Major Flows" : "Minor Flows") &&
            n.column === 1
        );

        if (sourceNode && intermediateNode) {
          const flowKey = `${link.from}→${link.to}`;
          flowPaths.set(flowKey, {
            source: link.from,
            target: link.to,
            value: link.size,
          });

          sankeyLinksData.push({
            source: sourceNode,
            target: intermediateNode,
            value: link.size,
            width: Math.max(
              isMobile ? 8 : 16,
              link.size * (isMobile ? 20 : 40)
            ),
            flowKey,
          });
        }
      });

      data.forEach((link) => {
        const isMajorFlow = link.size > 1.0;
        const intermediateNode = sankeyNodes.find(
          (n) =>
            n.name === (isMajorFlow ? "Major Flows" : "Minor Flows") &&
            n.column === 1
        );
        const targetNode = sankeyNodes.find(
          (n) => n.name === link.to && n.column === 2
        );

        if (intermediateNode && targetNode) {
          const flowKey = `${link.from}→${link.to}`;
          sankeyLinksData.push({
            source: intermediateNode,
            target: targetNode,
            value: link.size,
            width: Math.max(
              isMobile ? 8 : 16,
              link.size * (isMobile ? 20 : 40)
            ),
            flowKey,
          });
        }
      });

      // Theme accent color palette with reduced opacity - ensure same flow has same color
      const flowColorMap = new Map<string, string>();
      const flowColors = [
        `${colors.accent.blue}60`, // Blue with 60% opacity
        `${colors.accent.teal}60`, // Teal with 60% opacity
        `${colors.accent.yellow}60`, // Yellow with 60% opacity
        `${colors.accent.red}60`, // Red with 60% opacity
      ];

      // Assign colors to flows consistently
      data.forEach((link, index) => {
        const flowKey = `${link.from}→${link.to}`;
        if (!flowColorMap.has(flowKey)) {
          flowColorMap.set(flowKey, flowColors[index % flowColors.length]);
        }
      });

      const getFlowColor = (flowKey: string) => {
        return flowColorMap.get(flowKey) || `${colors.accent.blue}60`;
      };

      const shouldHighlight = (link: SankeyLink) => {
        if (selectedFlow) return link.flowKey === selectedFlow;
        if (hoveredFlow) return link.flowKey === hoveredFlow;
        return false;
      };

      const getFlowOpacity = (link: SankeyLink) => {
        if (shouldHighlight(link)) return 1.0;
        if (hoveredFlow && hoveredFlow !== link.flowKey) return 0.4;
        if (isPlaying) {
          const flowIndex = sankeyLinksData.indexOf(link);
          const phase = (animationFrame + flowIndex * 30) % 360;
          return 0.5 + 0.2 * Math.sin((phase * Math.PI) / 180);
        }
        return 0.6;
      };

      // Create gradient definitions
      const defs = svg.append("defs");

      // Flow gradients
      sankeyLinksData.forEach((link, i) => {
        const gradientId = `flowGradient${i}`;
        const gradient = defs
          .append("linearGradient")
          .attr("id", gradientId)
          .attr("gradientUnits", "userSpaceOnUse");

        const color = getFlowColor(link.flowKey!);
        gradient
          .append("stop")
          .attr("offset", "0%")
          .attr("stop-color", color)
          .attr("stop-opacity", 0.8);
        gradient
          .append("stop")
          .attr("offset", "50%")
          .attr("stop-color", color)
          .attr("stop-opacity", 1.0);
        gradient
          .append("stop")
          .attr("offset", "100%")
          .attr("stop-color", color)
          .attr("stop-opacity", 0.8);
      });

      // Draw links with enhanced styling
      svg
        .append("g")
        .selectAll("path")
        .data(sankeyLinksData)
        .join("path")
        .attr("d", (d) => {
          const source = d.source as SankeyNode;
          const target = d.target as SankeyNode;
          const midX = (source.x1! + target.x0!) / 2;
          return `M ${source.x1} ${(source.y0! + source.y1!) / 2} 
                C ${midX} ${(source.y0! + source.y1!) / 2} 
                  ${midX} ${(target.y0! + target.y1!) / 2} 
                  ${target.x0} ${(target.y0! + target.y1!) / 2}`;
        })
        .attr("stroke", (d, i) => `url(#flowGradient${i})`)
        .attr("stroke-width", (d) => {
          const baseWidth = Math.max(d.width || 8, 12);
          return hoveredFlow === d.flowKey
            ? String(baseWidth * 1.5)
            : String(baseWidth);
        })
        .attr("fill", "none")
        .attr("opacity", getFlowOpacity)
        .attr("filter", (d) =>
          hoveredFlow === d.flowKey
            ? "drop-shadow(0 0 12px rgba(0,0,0,0.4))"
            : "none"
        )
        .attr("cursor", "pointer")
        .style("filter", (d) =>
          shouldHighlight(d)
            ? "drop-shadow(0 3px 6px rgba(0,0,0,0.2))"
            : "drop-shadow(0 1px 2px rgba(0,0,0,0.1))"
        )
        .style("transition", "all 0.2s ease")
        .on("mousemove", function (event, d) {
          if (d.flowKey) {
            setHoveredFlow(d.flowKey);
            const [mx, my] = d3.pointer(event);
            const flowData = flowPaths.get(d.flowKey);
            if (flowData) {
              setTooltip({
                x: mx,
                y: my,
                from: flowData.source,
                to: flowData.target,
                value: flowData.value,
              });
            }
          }
        })
        .on("mouseleave", function () {
          setHoveredFlow(null);
          setTooltip(null);
        })
        .on("click", function (event, d) {
          if (d.flowKey) {
            setSelectedFlow(d.flowKey);
          }
        });

      // Node gradients
      sankeyNodes.forEach((node, i) => {
        const gradientId = `nodeGradient${i}`;
        const gradient = defs
          .append("linearGradient")
          .attr("id", gradientId)
          .attr("gradientUnits", "userSpaceOnUse");

        const baseColor = "rgb(66, 91, 89)";
        gradient
          .append("stop")
          .attr("offset", "0%")
          .attr("stop-color", baseColor)
          .attr("stop-opacity", 0.8);
        gradient
          .append("stop")
          .attr("offset", "100%")
          .attr("stop-color", baseColor)
          .attr("stop-opacity", 0.9);
      });

      // Draw nodes with enhanced styling
      svg
        .append("g")
        .selectAll("rect")
        .data(sankeyNodes)
        .join("rect")
        .attr("x", (d) => String(d.x0!))
        .attr("y", (d) => String(d.y0!))
        .attr("height", (d) => String(d.y1! - d.y0!))
        .attr("width", (d) => String(d.x1! - d.x0!))
        .attr("fill", (d, i) => `url(#nodeGradient${i})`)
        .attr("stroke", () => "rgb(66, 91, 89)")
        .attr("stroke-width", "1")
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
            .style("stroke-width", "2");
        });

      // Add labels with enhanced styling
      svg
        .append("g")
        .selectAll("text")
        .data(sankeyNodes)
        .join("text")
        .attr("x", (d) => String(d.x0! < width / 2 ? d.x1! + 8 : d.x0! - 8))
        .attr("y", (d) => String((d.y1! + d.y0!) / 2))
        .attr("dy", "0.35em")
        .attr("text-anchor", (d) => (d.x0! < width / 2 ? "start" : "end"))
        .text((d) => d.name)
        .style("font-family", "var(--font-mono)")
        .style("font-size", isMobile ? "8px" : "14px")
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
    };

    updateChart();

    const resizeObserver = new ResizeObserver(() => updateChart());
    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, [
    data,
    accent,
    colors,
    hoveredFlow,
    selectedFlow,
    sankeyNodes,
    isMobile,
    isPlaying,
    animationFrame,
    viewMode,
    isDark,
    setSelectedFlow,
  ]);

  return (
    <WidgetBase
      className={`flex flex-col ${isMobile ? "sankey-chart-widget" : ""}`}
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
        <MigrationFlowHeader
          title={title}
          subtitle={subtitle}
          isMobile={isMobile}
          totalFlows={totalFlows}
          totalMigration={totalMigration}
          selectedFlow={selectedFlow}
        />

        <MigrationFlowControls
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

        <div className="flex-1 min-h-0 mt-4">
          {viewMode === "flow" && (
            <div
              className="relative"
              style={{
                width: "100%",
                height: isMobile ? "35vh" : "380px",
                maxWidth: "800px",
                maxHeight: "450px",
                margin: "0 auto",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
              }}
              onMouseLeave={() => {
                setHoveredFlow(null);
                setTooltip(null);
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
              {tooltip && (
                <div
                  style={{
                    position: "fixed",
                    left: tooltip.x + 10,
                    top: tooltip.y - 10,
                    background: sankeyChartColors.background.tooltip,
                    color: colors.primary,
                    borderRadius: 12,
                    boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                    padding: "12px 18px",
                    fontFamily: "var(--font-mono)",
                    fontWeight: 700,
                    fontSize: isMobile ? 12 : 16,
                    pointerEvents: "none",
                    zIndex: 9999,
                    minWidth: 180,
                    border: `1px solid ${sankeyChartColors.button.border}`,
                  }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <span
                      style={{
                        display: "inline-block",
                        width: 18,
                        height: 18,
                        background: sankeyChartColors.button.background,
                        borderRadius: 4,
                        marginRight: 8,
                      }}
                    />
                    <span>
                      {tooltip.from} → {tooltip.to}
                    </span>
                  </div>
                  <div style={{ marginTop: 8, fontWeight: 500, fontSize: 15 }}>
                    Migration (millions){" "}
                    <span style={{ float: "right", fontWeight: 900 }}>
                      {tooltip.value}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {viewMode === "stats" && (
            <div className="h-full overflow-y-auto">
              <MigrationFlowStats
                data={data}
                selectedFlow={selectedFlow}
                isMobile={isMobile}
              />
            </div>
          )}

          {viewMode === "trends" && (
            <div
              className="h-full flex items-center justify-center"
              style={{
                background: "var(--button-bg)",
                border: "1px solid var(--button-border)",
                borderRadius: "1rem",
                backdropFilter: "blur(8px)",
              }}
            >
              <div className="text-center">
                <div
                  className="text-lg font-bold mb-2"
                  style={{
                    color: colors.primary,
                    fontFamily: "var(--font-mono)",
                    fontWeight: 700,
                  }}
                >
                  Trends Analysis
                </div>
                <div
                  className="text-sm"
                  style={{
                    color: colors.secondary,
                    fontFamily: "var(--font-mono)",
                    fontWeight: 600,
                  }}
                >
                  Coming soon...
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

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
