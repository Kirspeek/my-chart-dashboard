"use client";

import { useEffect, useRef } from "react";
import WidgetBase from "../common/WidgetBase";
import { MapComponentProps } from "../../../interfaces/components";

export default function MapComponent({
  center,
  zoom,
  className = "",
  style = {},
}: MapComponentProps) {
  const mapContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Simple map placeholder - in a real implementation, you'd use a map library
    const canvas = document.createElement("canvas");
    canvas.width = mapContainer.current.clientWidth;
    canvas.height = mapContainer.current.clientHeight;
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.borderRadius = "1rem";
    canvas.style.background =
      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
      ctx.font = "16px var(--font-mono)";
      ctx.textAlign = "center";
      ctx.fillText(
        `Map: ${center[0].toFixed(2)}, ${center[1].toFixed(2)} (zoom: ${zoom})`,
        canvas.width / 2,
        canvas.height / 2
      );
    }

    mapContainer.current.appendChild(canvas);

    return () => {
      if (mapContainer.current) {
        mapContainer.current.innerHTML = "";
      }
    };
  }, [center, zoom]);

  return (
    <WidgetBase className={className} style={style}>
      <div
        ref={mapContainer}
        style={{
          width: "100%",
          height: "300px",
          borderRadius: "1rem",
          overflow: "hidden",
        }}
      />
    </WidgetBase>
  );
}
