"use client";

import React, { useRef, useEffect, useState, useMemo } from "react";
import * as d3 from "d3";
import WidgetBase from "../../common/WidgetBase";
import { WidgetTitle } from "../../common";
import { useTheme } from "src/hooks/useTheme";
import type { WidgetChordChartData } from "../../../../interfaces/widgets";

interface CustomChordDiagramProps {
  data: WidgetChordChartData[];
  title: string;
  subtitle?: string;
  isMobile?: boolean;
}

const nodeOrder = ["Asia", "Europe", "Americas", "Africa", "Oceania"];

export default function CustomChordDiagram({
  data,
  title,
  subtitle,
  onOpenSidebar,
  showSidebarButton = false,
}: CustomChordDiagramProps & {
  onOpenSidebar?: () => void;
  showSidebarButton?: boolean;
}) {
  const ref = useRef<SVGSVGElement>(null);
  const { accent, colors } = useTheme();
  const arcColors = useMemo(
    () => [accent.blue, accent.yellow, accent.teal, accent.red, accent.yellow],
    [accent.blue, accent.yellow, accent.teal, accent.red]
  );
  const [hoveredRibbon, setHoveredRibbon] = useState<number | null>(null);
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    from: string;
    to: string;
    value: number;
    color: string;
  } | null>(null);

  // Detect mobile to apply full-screen sizing
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

  // Build a denser matrix if data is sparse
  const n = nodeOrder.length;
  const matrix = Array.from({ length: n }, () => Array(n).fill(0));
  data.forEach(({ from, to, size }) => {
    const i = nodeOrder.indexOf(from);
    const j = nodeOrder.indexOf(to);
    if (i !== -1 && j !== -1) matrix[i][j] = size;
  });

  useEffect(() => {
    // Get the actual container dimensions
    const container = ref.current?.parentElement;
    if (!container) return;

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
        .style("margin", "0 auto"); // Center the SVG
      svg.selectAll("*").remove();

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

      // Draw groups (arcs)
      svg
        .append("g")
        .attr("transform", `translate(${width / 2},${height / 2})`)
        .selectAll("path")
        .data(chord.groups)
        .join("path")
        .attr("d", arcGen)
        .attr("fill", accent.teal)
        .attr("stroke", accent.teal)
        .attr("stroke-width", 1.5)
        .attr("cursor", "pointer");

      // Draw ribbons (flows)
      svg
        .append("g")
        .attr("transform", `translate(${width / 2},${height / 2})`)
        .selectAll("path")
        .data(chord)
        .join("path")
        .attr("d", ribbonGen)
        .attr(
          "fill",
          (d: d3.Chord) => arcColors[d.source.index % arcColors.length]
        )
        .attr("opacity", (d, i) =>
          hoveredRibbon === null || hoveredRibbon === i ? 0.65 : 0.15
        )
        .attr("cursor", "pointer")
        .style("filter", (d, i) =>
          hoveredRibbon === i
            ? "drop-shadow(0 4px 10px rgba(0,0,0,0.25))"
            : "drop-shadow(0 2px 4px rgba(0,0,0,0.10))"
        )
        .on("mousemove", function (event, d) {
          setHoveredRibbon(chord.indexOf(d));
          const [mx, my] = d3.pointer(event);
          const sourceName = nodeOrder[d.source.index];
          const targetName = nodeOrder[d.target.index];
          setTooltip({
            x: mx,
            y: my,
            from: sourceName,
            to: targetName,
            value: d.source.value,
            color: arcColors[d.source.index % arcColors.length],
          });
        })
        .on("mouseleave", function () {
          setHoveredRibbon(null);
          setTooltip(null);
        });

      // Add labels
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
            .style("fill", colors.primary)
            .style("pointer-events", "none")
            .style("text-shadow", "0 1px 2px rgba(255,255,255,0.8)");
        });

      // Add filter for enhanced shadows
      svg
        .append("defs")
        .append("filter")
        .attr("id", "shadow")
        .append("feDropShadow")
        .attr("dx", "0")
        .attr("dy", "2")
        .attr("stdDeviation", "4")
        .attr("flood-color", "rgba(0,0,0,0.3)");
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
  }, [data, accent, colors, hoveredRibbon, arcColors, matrix, isMobile]);

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
          padding: isMobile ? "0 1rem 1rem 1rem" : "1.5rem", // Remove top padding for mobile
        }}
      >
        <WidgetTitle
          title={title}
          subtitle={subtitle}
          variant={isMobile ? "centered" : "default"}
          size="md"
        />
        <div
          className="mt-16"
          style={{
            position: "relative",
            width: "100%",
            height: isMobile ? "35vh" : "350px",
            maxWidth: "400px",
            maxHeight: "400px",
            margin: "0 auto", // Center the container horizontally
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden", // Ensure content doesn't overflow
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
                fontSize: isMobile ? 12 : 16,
                pointerEvents: "none",
                zIndex: 10,
                minWidth: 180,
                border: `2px solid ${tooltip.color}`,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span
                  style={{
                    display: "inline-block",
                    width: 18,
                    height: 18,
                    background: tooltip.color,
                    borderRadius: 4,
                    marginRight: 8,
                  }}
                />
                <span>
                  {tooltip.from} - {tooltip.to}
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
      </div>
    </WidgetBase>
  );
}
