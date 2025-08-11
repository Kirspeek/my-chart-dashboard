"use client";

import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import WidgetBase from "../../common/WidgetBase";
import { WidgetTitle } from "../../common";
import { useTheme } from "src/hooks/useTheme";
import type { WidgetBubbleChartData } from "../../../../interfaces/widgets";

interface CustomBubbleChartProps {
  data: WidgetBubbleChartData[];
  title: string;
  subtitle?: string;
  isMobile?: boolean;
}

export default function CustomBubbleChart({
  data,
  title,
  subtitle,
  onOpenSidebar,
  showSidebarButton = false,
}: CustomBubbleChartProps & {
  onOpenSidebar?: () => void;
  showSidebarButton?: boolean;
}) {
  const ref = useRef<SVGSVGElement>(null);
  const { accent, colors } = useTheme();
  const [hoveredBubble, setHoveredBubble] = useState<number | null>(null);
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    data: WidgetBubbleChartData;
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

  useEffect(() => {
    // Get the actual container dimensions
    const container = ref.current?.parentElement;
    if (!container) return;

    const updateChart = () => {
      const containerRect = container.getBoundingClientRect();
      const width = isMobile ? Math.min(containerRect.width * 0.95, 600) : 600;
      const height = isMobile ? Math.min(containerRect.height * 0.9, 400) : 400;
      // Increase margins for better label spacing
      const margin = { top: 20, right: 20, bottom: 56, left: 36 };

      const svg = d3
        .select(ref.current)
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("viewBox", [0, 0, width, height].join(" "))
        .attr("preserveAspectRatio", "xMidYMid meet");
      svg.selectAll("*").remove();

      // Calculate data extents with padding
      const xMin = d3.min(data, (d) => d.x) || 0;
      const xMax = d3.max(data, (d) => d.x) || 100;
      const yMin = d3.min(data, (d) => d.y) || 0;
      const yMax = d3.max(data, (d) => d.y) || 100;
      const xPad = (xMax - xMin) * 0.1;
      const yPad = (yMax - yMin) * 0.1;

      // Create scales with padding
      const xScale = d3
        .scaleLinear()
        .domain([xMin - xPad * 0.5, xMax + xPad])
        .range([margin.left, width - margin.right]);

      const yScale = d3
        .scaleLinear()
        .domain([yMin - yPad * 0.5, yMax + yPad])
        .range([height - margin.bottom, margin.top]);

      // Smaller bubble size range
      const sizeScale = d3
        .scaleSqrt()
        .domain([0, d3.max(data, (d) => d.size) || 100])
        .range([6, 28]); // Smaller bubbles

      // Color mapping to match Sankey/Chord string colors
      // Map categories to theme accent colors
      const categoryColorMap: Record<string, string> = {
        "Big Tech": accent.teal, // teal
        "AI & Cloud": accent.yellow, // yellow
        Fintech: accent.blue, // blue
        "Emerging Tech": accent.red, // red
      };
      const colorScale = (category: string) =>
        categoryColorMap[category] || accent.red;

      // Create categories
      const categories = [...new Set(data.map((d) => d.category))];

      // Draw bubbles with new color scale
      svg
        .append("g")
        .selectAll("circle")
        .data(data)
        .join("circle")
        .attr("cx", (d) => xScale(d.x))
        .attr("cy", (d) => yScale(d.y))
        .attr("r", (d) => sizeScale(d.size))
        .attr("fill", (d) => colorScale(d.category))
        .attr("stroke", (d) => colorScale(d.category))
        .attr("stroke-width", "2.5")
        .attr("opacity", (d, i) =>
          hoveredBubble === null || hoveredBubble === i ? 0.9 : 0.5
        )
        .attr("cursor", "pointer")
        .style("filter", (d, i) =>
          hoveredBubble === i
            ? "drop-shadow(0 4px 10px rgba(0,0,0,0.25))"
            : "drop-shadow(0 2px 4px rgba(0,0,0,0.10))"
        )
        .on("mousemove", function (event, d) {
          setHoveredBubble(data.indexOf(d));
          const [mx, my] = d3.pointer(event);
          setTooltip({
            x: mx,
            y: my,
            data: d,
          });
        })
        .on("mouseleave", function () {
          setHoveredBubble(null);
          setTooltip(null);
        });

      // Add X-axis
      svg
        .append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(
          d3
            .axisBottom(xScale)
            .tickFormat((d) => `$${d}B`)
            .ticks(5)
        )
        .style("font-family", "var(--font-mono)")
        .style("font-size", isMobile ? "10px" : "12px")
        .style("font-weight", "600")
        .style("fill", colors.primary)
        .style("letter-spacing", "0.02em");

      // Add Y-axis
      svg
        .append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(
          d3
            .axisLeft(yScale)
            .tickFormat((d) => `${d}%`)
            .ticks(5)
        )
        .style("font-family", "var(--font-mono)")
        .style("font-size", isMobile ? "10px" : "12px")
        .style("font-weight", "600")
        .style("fill", colors.primary)
        .style("letter-spacing", "0.02em");

      // Add legend
      const legend = svg
        .append("g")
        .attr(
          "transform",
          `translate(${width - margin.right - 120},${margin.top})`
        );

      legend
        .selectAll("rect")
        .data(categories)
        .join("rect")
        .attr("x", 0)
        .attr("y", (d, i) => i * 22)
        .attr("width", 14)
        .attr("height", 14)
        .attr("fill", (d) => colorScale(d))
        .attr("stroke", (d) => colorScale(d))
        .attr("stroke-width", "2")
        .attr("rx", "3")
        .style("filter", "drop-shadow(0 2px 4px rgba(0,0,0,0.1))");

      legend
        .selectAll("text")
        .data(categories)
        .join("text")
        .attr("x", 20)
        .attr("y", (d, i) => i * 22 + 10)
        .text((d) => d)
        .style("font-family", "var(--font-mono)")
        .style("font-size", isMobile ? "10px" : "12px")
        .style("font-weight", "700")
        .style("fill", colors.primary)
        .style("letter-spacing", "0.02em");
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
  }, [data, accent, colors, hoveredBubble, isMobile]);

  return (
    <WidgetBase
      className={`flex flex-col ${isMobile ? "bubble-chart-widget" : ""}`}
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
            maxWidth: "600px",
            maxHeight: "400px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
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
                <span>{tooltip.data.label || tooltip.data.category}</span>
              </div>
              <div style={{ marginTop: 8, fontWeight: 500, fontSize: 15 }}>
                Market Cap: ${tooltip.data.x}B | Growth: {tooltip.data.y}%
              </div>
              <div style={{ marginTop: 4, fontWeight: 500, fontSize: 15 }}>
                Employees: {tooltip.data.size}K
              </div>
            </div>
          )}
        </div>
      </div>
    </WidgetBase>
  );
}
