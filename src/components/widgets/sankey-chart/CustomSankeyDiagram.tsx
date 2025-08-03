"use client";

import React, { useRef, useEffect, useState, useMemo } from "react";
import * as d3 from "d3";
import WidgetBase from "../../common/WidgetBase";
import { useTheme } from "src/hooks/useTheme";
import type { WidgetSankeyChartData } from "../../../../interfaces/widgets";

interface CustomSankeyDiagramProps {
  data: WidgetSankeyChartData[];
  title: string;
  subtitle?: string;
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
  flowKey?: string; // Added for tracking complete flow paths
}

export default function CustomSankeyDiagram({
  data,
  title,
  subtitle,
}: CustomSankeyDiagramProps) {
  const ref = useRef<SVGSVGElement>(null);
  const { accent, colors } = useTheme();
  const [hoveredFlow, setHoveredFlow] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    from: string;
    to: string;
    value: number;
  } | null>(null);

  // Extract unique source and target nodes
  const sourceNodes = useMemo(() => new Set(data.map((d) => d.from)), [data]);
  const targetNodes = useMemo(() => new Set(data.map((d) => d.to)), [data]);

  // Create nodes with column positioning
  const sankeyNodes: SankeyNode[] = useMemo(
    () => [
      // Column 0: Source continents
      ...Array.from(sourceNodes).map((name) => ({
        id: name,
        name,
        value: 0,
        column: 0,
      })),
      // Column 1: Intermediate categories (Major Flows, Minor Flows)
      { id: "Major Flows", name: "Major Flows", value: 0, column: 1 },
      { id: "Minor Flows", name: "Minor Flows", value: 0, column: 1 },
      // Column 2: Target continents
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
        // Source nodes - sum outgoing flows
        node.value = data
          .filter((d) => d.from === node.name)
          .reduce((sum, d) => sum + d.size, 0);
      } else if (node.column === 1) {
        // Intermediate nodes - categorize flows
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
        // Target nodes - sum incoming flows
        node.value = data
          .filter((d) => d.to === node.name)
          .reduce((sum, d) => sum + d.size, 0);
      }
    });
  }, [data, sankeyNodes]);

  useEffect(() => {
    const width = 800;
    const height = 400;
    const margin = { top: 20, right: 20, bottom: 20, left: 20 };

    const svg = d3
      .select(ref.current)
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height].join(" "));
    svg.selectAll("*").remove();

    // Multi-column Sankey layout
    const nodeWidth = 4; // Even thinner nodes
    const columnWidth =
      (width - margin.left - margin.right - nodeWidth * 3) / 2;

    // Position nodes by column
    const nodesByColumn = d3.group(sankeyNodes, (d) => d.column);

    nodesByColumn.forEach((nodes, column) => {
      const x = margin.left + column * (columnWidth + nodeWidth);
      const totalHeight = height - margin.top - margin.bottom;
      const nodeHeight = totalHeight / nodes.length;

      nodes.forEach((node, i) => {
        node.x0 = x;
        node.x1 = x + nodeWidth;
        node.y0 = margin.top + i * nodeHeight;
        node.y1 = node.y0 + nodeHeight * 0.8; // Leave some space between nodes
      });
    });

    // Create proper Sankey flows through intermediate nodes
    const sankeyLinksData: SankeyLink[] = [];

    // Create a mapping to track complete flow paths
    const flowPaths = new Map<
      string,
      { source: string; target: string; value: number }
    >();

    // Step 1: Source to Intermediate flows
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
          width: Math.max(8, link.size * 30), // Twice as large
          flowKey, // Add flow key for tracking
        });
      }
    });

    // Step 2: Intermediate to Target flows
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
          width: Math.max(8, link.size * 30), // Twice as large
          flowKey, // Add flow key for tracking
        });
      }
    });

    // Color scale - needed for flow strings
    const colorScale = d3.scaleOrdinal([
      accent.blue,
      accent.yellow,
      accent.teal,
      accent.red,
    ]);

    // Helper function to check if a link should be highlighted
    const shouldHighlight = (link: SankeyLink) => {
      if (!hoveredFlow) return false;
      return link.flowKey === hoveredFlow;
    };

    // Draw links (curved paths) - enhanced styling
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
      .attr("stroke", (d, i) => colorScale(String(i % 4))) // Restore colored flow strings
      .attr("stroke-width", (d) => String(d.width || 8))
      .attr("fill", "none")
      .attr("opacity", (d) => (shouldHighlight(d) ? 1.0 : 0.4))
      .attr("cursor", "pointer")
      .style("filter", (d) =>
        shouldHighlight(d) ? "drop-shadow(0 2px 4px rgba(0,0,0,0.3))" : "none"
      )
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
      .attr("fill", accent.teal) // Green color from theme
      .attr("stroke", accent.teal) // Green border
      .attr("stroke-width", "1") // Thinner border
      .attr("cursor", "pointer")
      .style("filter", "drop-shadow(0 2px 4px rgba(0,0,0,0.2))");

    // Add node labels with enhanced styling
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
      .style("font-size", "13px")
      .style("font-weight", "700")
      .style("fill", colors.primary)
      .style("pointer-events", "none")
      .style("text-shadow", "0 1px 2px rgba(255,255,255,0.8)");
  }, [data, accent, colors, hoveredFlow, sankeyNodes]);

  return (
    <WidgetBase className="flex flex-col items-center justify-center">
      <h3
        className="text-lg font-semibold mb-4"
        style={{
          color: colors.primary,
          fontFamily: "var(--font-mono)",
          fontWeight: 900,
          letterSpacing: "0.01em",
        }}
      >
        {title}
      </h3>
      {subtitle && (
        <div
          className="text-base mb-4"
          style={{
            color: "#888",
            fontFamily: "var(--font-mono)",
            fontWeight: 500,
          }}
        >
          {subtitle}
        </div>
      )}
      <div style={{ position: "relative", width: 800, height: 400 }}>
        <svg ref={ref} style={{ position: "absolute", top: 0, left: 0 }} />
        {tooltip && (
          <div
            style={{
              position: "absolute",
              left: tooltip.x + 10,
              top: tooltip.y - 10,
              background: "#fff",
              color: colors.primary,
              borderRadius: 12,
              boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
              padding: "12px 18px",
              fontFamily: "var(--font-mono)",
              fontWeight: 700,
              fontSize: 16,
              pointerEvents: "none",
              zIndex: 10,
              minWidth: 180,
              border: `2px solid ${accent.teal}`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span
                style={{
                  display: "inline-block",
                  width: 18,
                  height: 18,
                  background: accent.teal,
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
    </WidgetBase>
  );
}
