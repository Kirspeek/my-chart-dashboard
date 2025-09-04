"use client";

import { useEffect } from "react";
import * as d3 from "d3";
import type { ChordFlowCanvasProps } from "@/interfaces/charts";

const nodeOrder = ["Asia", "Europe", "Americas", "Africa", "Oceania"];

export default function ChordFlowCanvas({
  container,
  isMobile,
  animationSpeed,
  isPlaying,
  hoveredRibbon,
  setHoveredRibbon,
  setSelectedFlow,
  getFlowColor,
  matrix,
  colors,
}: ChordFlowCanvasProps) {
  useEffect(() => {
    const parent = container?.parentElement;
    if (!container || !parent) return;
    const update = () => {
      const rect = parent.getBoundingClientRect();
      const width = isMobile ? Math.min(rect.width * 0.9, 400) : 400;
      const height = isMobile ? Math.min(rect.height * 0.85, 400) : 400;
      const innerRadius = isMobile ? Math.min(rect.width * 0.12, 96) : 96;
      const outerRadius = isMobile ? Math.min(rect.width * 0.13, 100) : 100;

      const svg = d3
        .select(container)
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
        .attr(
          "fill",
          colors.isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)"
        );

      svg
        .append("rect")
        .attr("width", width)
        .attr("height", height)
        .attr("fill", colors.pattern);

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
            const phase = (i * 30) % 360;
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
        })
        .on("mouseleave", function () {
          setHoveredRibbon(null);
        })
        .on("click", function (event, d) {
          const sourceName = nodeOrder[d.source.index];
          const targetName = nodeOrder[d.target.index];
          const flowKey = `${sourceName}→${targetName}`;
          setSelectedFlow?.(flowKey);
        });
    };

    update();
    const ro = new ResizeObserver(() => update());
    ro.observe(parent);
    return () => ro.disconnect();
  }, [
    container,
    isMobile,
    animationSpeed,
    isPlaying,
    hoveredRibbon,
    setHoveredRibbon,
    setSelectedFlow,
    getFlowColor,
    matrix,
    colors,
  ]);

  return null;
}
