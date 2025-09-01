"use client";

import React, { useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useTheme } from "../../../hooks/useTheme";

const MAPBOX_TOKEN =
  "pk.eyJ1Ijoia2lyc3BlZWVrIiwiYSI6ImNtZDV1ZTV3cjAya2gybHM5dnd5aXN1NXkifQ.Vf1XkeuyhzH0TfaclbFOBw";
const MAP_STYLE = "mapbox://styles/mapbox/light-v11";
const DEFAULT_CENTER: [number, number] = [0, 0];

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

  // Initialize map
  useEffect(() => {
    mapboxgl.accessToken = MAPBOX_TOKEN;
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

      // Disable scroll zoom (mouse wheel) to prevent conflicts
      map.scrollZoom.disable();

      // Enable keyboard navigation for accessibility
      map.keyboard.enable();
    });

    const styleEl = document.createElement("style");
    styleEl.innerHTML = `.mapboxgl-ctrl-logo, .mapboxgl-ctrl-attrib { display: none !important; }`;
    document.head.appendChild(styleEl);

    return () => {
      map.remove();
      styleEl.remove();
    };
  }, [internalLocation]);

  // Update map center and marker when location changes
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
  }, [internalLocation, onMarkerChange]);

  // Handle search results
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
  }, [searchResult, onMarkerChange]);

  return (
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
  );
}
