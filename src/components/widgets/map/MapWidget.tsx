"use client";

import React from "react";
import WidgetBase from "../../common/WidgetBase";
import { MapWidgetProps } from "../../../../interfaces/widgets";
import { useMapLogic } from "src/hooks/useMapLogic";
import MapSearch from "./MapSearch";
import MapContainer from "./MapContainer";

export default function MapWidget({
  onMarkerChange,
  userLocation,
}: MapWidgetProps) {
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
        width: isMobile ? "100vw" : "100%",
        height: isMobile ? "82vh" : "40vh",
        minHeight: 0,
        padding: 0,
        paddingTop: isMobile ? "calc(var(--spacing) * 4)" : undefined,
        margin: isMobile ? "0 0 3rem 0" : undefined,
        position: "relative",
        overflow: "hidden",
        boxSizing: "border-box",
        borderRadius: isMobile ? "2rem" : undefined,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
      className="map-widget"
    >
      <MapSearch
        search={search}
        searchFocused={searchFocused}
        loading={loading}
        onSearchChange={setSearch}
        onSearchFocus={setSearchFocused}
        onSubmit={handleSearch}
      />
      <MapContainer
        internalLocation={internalLocation}
        searchResult={searchResult}
        onMarkerChange={onMarkerChange}
      />
    </WidgetBase>
  );
}
