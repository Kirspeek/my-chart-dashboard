"use client";

import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import WidgetBase from "../../common/WidgetBase";
import { useTheme } from "@/hooks/useTheme";
import type { WidgetBubbleChartData } from "../../../../interfaces/widgets";

interface CustomBubbleChartProps {
  data: WidgetBubbleChartData[];
  title: string;
  subtitle?: string;
}

export default function CustomBubbleChart({
  data,
  title,
  subtitle,
}: CustomBubbleChartProps) {
  const ref = useRef<SVGSVGElement>(null);
  const { accent, colors } = useTheme();
  const [hoveredBubble, setHoveredBubble] = useState<number | null>(null);
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    data: WidgetBubbleChartData;
  } | null>(null);

  useEffect(() => {
    const width = 600;
    const height = 400;
    // Increase margins for better label spacing
    const margin = { top: 20, right: 20, bottom: 56, left: 36 };

    const svg = d3
      .select(ref.current)
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height].join(" "));
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
      .style("transition", "all 0.2s ease")
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

    // Add labels for bubbles with better styling
    svg
      .append("g")
      .selectAll("text")
      .data(data.filter((d) => d.label && d.size > 15)) // Show labels for medium+ bubbles
      .join("text")
      .attr("x", (d) => xScale(d.x))
      .attr("y", (d) => yScale(d.y))
      .attr("dy", "0.35em")
      .attr("text-anchor", "middle")
      .text((d) => d.label || "")
      .style("font-family", "var(--font-mono)")
      .style("font-size", "12px")
      .style("font-weight", "700")
      .style("fill", colors.primary)
      .style("pointer-events", "none")
      .style("text-shadow", "0 2px 4px rgba(255,255,255,0.9)")
      .style("letter-spacing", "0.02em");

    // Add axes with enhanced styling and tick padding
    const xAxis = d3.axisBottom(xScale).ticks(8).tickPadding(12);
    const yAxis = d3.axisLeft(yScale).ticks(8).tickPadding(12);

    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(xAxis)
      .style("font-family", "var(--font-mono)")
      .style("font-size", "11px")
      .style("color", colors.primary)
      .style("font-weight", "600");

    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(yAxis)
      .style("font-family", "var(--font-mono)")
      .style("font-size", "11px")
      .style("color", colors.primary)
      .style("font-weight", "600");

    // Add axis labels with extra gap
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", height - 16)
      .attr("text-anchor", "middle")
      .text("Market Cap (Billion USD)")
      .style("font-family", "var(--font-mono)")
      .style("font-size", "13px")
      .style("font-weight", "700")
      .style("fill", colors.primary)
      .style("letter-spacing", "0.02em");

    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", 24)
      .attr("text-anchor", "middle")
      .text("Revenue Growth (%)")
      .style("font-family", "var(--font-mono)")
      .style("font-size", "13px")
      .style("font-weight", "700")
      .style("fill", colors.primary)
      .style("letter-spacing", "0.02em");

    // Add legend with enhanced styling
    const legend = svg
      .append("g")
      .attr(
        "transform",
        `translate(${width - margin.right - 120}, ${margin.top + 10})`
      );

    // Update legend to use the same color mapping
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
      .style("font-size", "12px")
      .style("font-weight", "700")
      .style("fill", colors.primary)
      .style("letter-spacing", "0.02em");
  }, [data, accent, colors, hoveredBubble]);

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
      <div style={{ position: "relative", width: 600, height: 400 }}>
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
    </WidgetBase>
  );
}
