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

  return (
    <WidgetBase
      style={{
        width: "100%",
        height: "40vh",
        minHeight: 0,
        padding: 0,
        position: "relative",
        overflow: "hidden",
      }}
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
