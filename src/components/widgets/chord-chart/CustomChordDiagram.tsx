import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import WidgetBase from "../../common/WidgetBase";
import { useTheme } from "../../../hooks/useTheme";
import type { ChordChartData } from "../../../../interfaces/widgets";

interface CustomChordDiagramProps {
  data: ChordChartData[];
  title: string;
  subtitle?: string;
}

const nodeOrder = ["Asia", "Europe", "Americas", "Africa", "Oceania"];

export default function CustomChordDiagram({
  data,
  title,
  subtitle,
}: CustomChordDiagramProps) {
  const ref = useRef<SVGSVGElement>(null);
  const { accent, colors } = useTheme();
  const arcColors = [
    accent.blue,
    accent.yellow,
    accent.teal,
    accent.red,
    accent.yellow,
  ];
  const [hoveredRibbon, setHoveredRibbon] = useState<number | null>(null);
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    from: string;
    to: string;
    value: number;
    color: string;
  } | null>(null);

  // Build a denser matrix if data is sparse
  const n = nodeOrder.length;
  const matrix = Array.from({ length: n }, () => Array(n).fill(0));
  data.forEach(({ from, to, size }) => {
    const i = nodeOrder.indexOf(from);
    const j = nodeOrder.indexOf(to);
    if (i !== -1 && j !== -1) matrix[i][j] = size;
  });

  useEffect(() => {
    const width = 400,
      height = 400,
      innerRadius = 96,
      outerRadius = 100;
    const svg = d3
      .select(ref.current)
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height].join(" "));
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
      .attr("stroke", (d, i) =>
        hoveredRibbon === i
          ? arcColors[d.source.index % arcColors.length]
          : "none"
      )
      .attr("stroke-width", (d, i) => (hoveredRibbon === i ? 3 : 0))
      .attr("filter", (d, i) => (hoveredRibbon === i ? "url(#shadow)" : null))
      .on("mousemove", function (event, d) {
        setHoveredRibbon(chord.indexOf(d));
        const svgEl = (event.currentTarget as SVGPathElement).ownerSVGElement;
        if (!svgEl) return;
        const [mx, my] = d3.pointer(event, svgEl);
        setTooltip({
          x: mx,
          y: my,
          from: nodeOrder[d.source.index],
          to: nodeOrder[d.target.index],
          value: matrix[d.source.index][d.target.index],
          color: arcColors[d.source.index % arcColors.length],
        });
      })
      .on("mouseleave", function () {
        setHoveredRibbon(null);
        setTooltip(null);
      });

    // SVG filter for shadow
    svg.append("defs").html(`
      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="0" stdDeviation="2" flood-color="#000" flood-opacity="0.18"/>
      </filter>
    `);
  }, [data, accent, colors, hoveredRibbon]);

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
      <div style={{ position: "relative", width: 400, height: 400 }}>
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
    </WidgetBase>
  );
}
