"use client";

import React, { useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

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

      // Disable scroll zoom (mouse wheel)
      map.scrollZoom.disable();

      // Enhanced touch handling for iPhone with swipe prevention
      const container = map.getContainer();
      let isMapInteracting = false;
      let touchStartY = 0;
      let touchStartX = 0;
      let isPinching = false;

      // Prevent parent swipe when map is being interacted with
      const preventParentSwipe = (e: TouchEvent) => {
        if (isMapInteracting || isPinching) {
          e.stopPropagation();
          e.preventDefault();
        }
      };

      // Enhanced touchstart handling
      container.addEventListener(
        "touchstart",
        (e) => {
          const touch = e.touches[0];
          touchStartY = touch.clientY;
          touchStartX = touch.clientX;

          if (e.touches.length === 1) {
            // Single finger - allow pan, mark as map interaction
            isMapInteracting = true;
            e.preventDefault();
          } else if (e.touches.length === 2) {
            // Two fingers - pinch to zoom, prevent parent swipe
            isPinching = true;
            isMapInteracting = true;
            e.stopPropagation();
            // Don't prevent default to allow natural pinch gesture
          }
        },
        { passive: false }
      );

      // Enhanced touchmove handling
      container.addEventListener(
        "touchmove",
        (e) => {
          if (e.touches.length === 1 && isMapInteracting) {
            // Single finger move - allow pan, prevent parent swipe
            e.preventDefault();
            e.stopPropagation();
          } else if (e.touches.length === 2 && isPinching) {
            // Two finger move - pinch zoom, prevent parent swipe
            e.stopPropagation();
            // Don't prevent default to allow natural pinch gesture
          }
        },
        { passive: false }
      );

      // Enhanced touchend handling
      container.addEventListener(
        "touchend",
        (e) => {
          // Reset interaction flags after a short delay
          setTimeout(() => {
            isMapInteracting = false;
            isPinching = false;
          }, 100);
        },
        { passive: true }
      );

      // Prevent touchcancel from propagating
      container.addEventListener(
        "touchcancel",
        (e) => {
          e.stopPropagation();
          isMapInteracting = false;
          isPinching = false;
        },
        { passive: false }
      );

      // Add touch event listeners to parent containers to prevent swipe
      const parentSlide = container.closest(".mobile-slide");
      if (parentSlide) {
        parentSlide.addEventListener("touchstart", preventParentSwipe, {
          passive: false,
        });
        parentSlide.addEventListener("touchmove", preventParentSwipe, {
          passive: false,
        });
      }

      const parentContainer = container.closest(".mobile-slides-container");
      if (parentContainer) {
        parentContainer.addEventListener("touchstart", preventParentSwipe, {
          passive: false,
        });
        parentContainer.addEventListener("touchmove", preventParentSwipe, {
          passive: false,
        });
      }
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
          <path d="M16 29C16 29 26 20.5 26 13C26 7.477 21.523 3 16 3C10.477 3 6 7.477 6 13C6 20.5 16 29 16 29Z" stroke="#222" stroke-width="2.5" fill="white"/>
          <circle cx="16" cy="13" r="4.5" stroke="#222" stroke-width="2.5" fill="none"/>
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
          <path d="M16 29C16 29 26 20.5 26 13C26 7.477 21.523 3 16 3C10.477 3 6 7.477 6 13C6 20.5 16 29 16 29Z" stroke="#222" stroke-width="2.5" fill="white"/>
          <circle cx="16" cy="13" r="4.5" stroke="#222" stroke-width="2.5" fill="none"/>
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
