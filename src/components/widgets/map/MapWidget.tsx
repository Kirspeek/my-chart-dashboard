"use client";

import React from "react";
import WidgetBase from "../../common/WidgetBase";
import SlideNavigation from "../../common/SlideNavigation";
import { MapWidgetProps } from "@/interfaces/widgets";
import { useMapLogic } from "@/hooks/useMapLogic";
import MapSearch from "./MapSearch";
import MapContainer from "./MapContainer";

export default function MapWidget({
  onMarkerChange,
  userLocation,
  onOpenSidebar,
  showSidebarButton = false,
  currentSlide,
  setCurrentSlide,
}: MapWidgetProps & {
  onOpenSidebar?: () => void;
  showSidebarButton?: boolean;
  currentSlide?: number;
  setCurrentSlide?: (slide: number) => void;
}) {
  const {
    search,
    searchFocused,
    loading,
    searchResult,
    internalLocation,
    setSearch,
    setSearchFocused,
    handleSearch,
  } = useMapLogic(onMarkerChange, userLocation);

  const isMobile = typeof window !== "undefined" && window.innerWidth <= 425;

  return (
    <WidgetBase
      style={{
        width: "100%",
        height: "100%",
        minHeight: 0,
        padding: 0,
        position: "relative",
        overflow: "hidden",
        boxSizing: "border-box",
        borderRadius: isMobile ? "1.25rem" : undefined,
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        justifyContent: "flex-start",
      }}
      className="map-widget"
      onOpenSidebar={onOpenSidebar}
      showSidebarButton={showSidebarButton}
    >
      <MapSearch
        search={search}
        searchFocused={searchFocused}
        loading={loading}
        onSearchChange={setSearch}
        onSearchFocus={setSearchFocused}
        onSubmit={handleSearch}
      />
      <div className="flex-1 relative w-full h-full">
        <MapContainer
          internalLocation={internalLocation}
          searchResult={searchResult}
          onMarkerChange={onMarkerChange}
        />
      </div>
      {currentSlide !== undefined && setCurrentSlide && (
        <SlideNavigation
          currentSlide={currentSlide}
          setCurrentSlide={setCurrentSlide}
          totalSlides={17}
        />
      )}
    </WidgetBase>
  );
}
