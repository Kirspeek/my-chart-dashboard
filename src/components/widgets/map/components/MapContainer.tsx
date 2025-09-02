"use client";

import React, { useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useTheme } from "@/hooks/useTheme";
import { MAP_STYLE, DEFAULT_CENTER } from "@/data";

interface MapContainerProps {
  internalLocation: [number, number] | null;
  searchResult: [number, number] | null;
  onMarkerChange?: (pos: { lat: number; lon: number }) => void;
}

export default function MapContainer({
  internalLocation,
  searchResult,
  onMarkerChange,
}: MapContainerProps) {
  const { colorsTheme } = useTheme();
  const mapColors = colorsTheme.widgets.map;
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const MAPBOX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_API_KEY || "";

  useEffect(() => {
    if (!MAPBOX_ACCESS_TOKEN) {
      if (process.env.NODE_ENV !== "production") {
        console.warn(
          "Mapbox token missing. Set NEXT_PUBLIC_MAPBOX_API_KEY in your environment to enable the map."
        );
      }
    }
    if (!MAPBOX_ACCESS_TOKEN) return;
    mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;
    if (!mapContainer.current) return;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: MAP_STYLE,
      center: internalLocation || DEFAULT_CENTER,
      zoom: 13,
      attributionControl: false,
      logoPosition: "bottom-right",
      dragRotate: false,
      cooperativeGestures: false,
    });
    mapRef.current = map;

    // Configure touch interactions after map is loaded
    map.on("load", () => {
      // Disable rotation on touch
      map.touchZoomRotate.disableRotation();

      // Enable touch zoom and pan
      map.touchZoomRotate.enable();
      map.dragPan.enable();

      map.scrollZoom.disable();

      map.keyboard.enable();
    });

    const styleEl = document.createElement("style");
    styleEl.innerHTML = `.mapboxgl-ctrl-logo, .mapboxgl-ctrl-attrib { display: none !important; }`;
    document.head.appendChild(styleEl);

    return () => {
      map.remove();
      styleEl.remove();
    };
  }, [internalLocation, MAPBOX_ACCESS_TOKEN]);

  useEffect(() => {
    if (!mapRef.current || !internalLocation) return;

    mapRef.current.setCenter(internalLocation);
    if (markerRef.current) {
      markerRef.current.setLngLat(internalLocation);
    } else {
      const markerEl = document.createElement("div");
      markerEl.style.width = "32px";
      markerEl.style.height = "32px";
      markerEl.style.display = "block";
      markerEl.style.position = "relative";
      markerEl.style.animation = "pulse 1.5s infinite";
      markerEl.innerHTML = `
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <path d="M16 29C16 29 26 20.5 26 13C26 7.477 21.523 3 16 3C10.477 3 6 7.477 6 13C6 20.5 16 29 16 29Z" stroke="${mapColors.markerColors.stroke}" stroke-width="2.5" fill="${mapColors.markerColors.fill}"/>
          <circle cx="16" cy="13" r="4.5" stroke="${mapColors.markerColors.stroke}" stroke-width="2.5" fill="none"/>
        </svg>
      `;
      markerRef.current = new mapboxgl.Marker({
        element: markerEl,
        anchor: "center",
        draggable: true,
      })
        .setLngLat(internalLocation)
        .addTo(mapRef.current);
      markerRef.current.on("dragend", () => {
        const lngLat = markerRef.current!.getLngLat();
        mapRef.current!.setCenter([lngLat.lng, lngLat.lat]);
        if (onMarkerChange)
          onMarkerChange({ lat: lngLat.lat, lon: lngLat.lng });
      });
    }
    if (onMarkerChange && internalLocation)
      onMarkerChange({ lat: internalLocation[1], lon: internalLocation[0] });
  }, [
    internalLocation,
    onMarkerChange,
    mapColors.markerColors.fill,
    mapColors.markerColors.stroke,
  ]);

  useEffect(() => {
    if (!mapRef.current || !searchResult) return;

    mapRef.current.flyTo({ center: searchResult, zoom: 15 });
    if (markerRef.current) {
      markerRef.current.setLngLat(searchResult);
    } else {
      const markerEl = document.createElement("div");
      markerEl.style.width = "32px";
      markerEl.style.height = "32px";
      markerEl.style.display = "block";
      markerEl.style.position = "relative";
      markerEl.style.animation = "pulse 1.5s infinite";
      markerEl.innerHTML = `
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <path d="M16 29C16 29 26 20.5 26 13C26 7.477 21.523 3 16 3C10.477 3 6 7.477 6 13C6 20.5 16 29 16 29Z" stroke="${mapColors.markerColors.stroke}" stroke-width="2.5" fill="${mapColors.markerColors.fill}"/>
          <circle cx="16" cy="13" r="4.5" stroke="${mapColors.markerColors.stroke}" stroke-width="2.5" fill="none"/>
        </svg>
      `;
      markerRef.current = new mapboxgl.Marker({
        element: markerEl,
        anchor: "center",
        draggable: true,
      })
        .setLngLat(searchResult)
        .addTo(mapRef.current);
      markerRef.current.on("dragend", () => {
        const lngLat = markerRef.current!.getLngLat();
        mapRef.current!.setCenter([lngLat.lng, lngLat.lat]);
        if (onMarkerChange)
          onMarkerChange({ lat: lngLat.lat, lon: lngLat.lng });
      });
    }
    if (onMarkerChange && searchResult)
      onMarkerChange({ lat: searchResult[1], lon: searchResult[0] });
  }, [
    searchResult,
    onMarkerChange,
    mapColors.markerColors.fill,
    mapColors.markerColors.stroke,
  ]);

  return (
    <>
      <div
        ref={mapContainer}
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          borderRadius: "inherit",
          overflow: "hidden",
        }}
      />
      {!MAPBOX_ACCESS_TOKEN && (
        <div
          style={{
            position: "absolute",
            top: 12,
            left: 12,
            zIndex: 20,
            padding: "8px 10px",
            borderRadius: 8,
            fontSize: 12,
            background: "rgba(0,0,0,0.6)",
            color: "#fff",
          }}
        >
          Map disabled: set NEXT_PUBLIC_MAPBOX_API_KEY in .env.local
        </div>
      )}
    </>
  );
}
