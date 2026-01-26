"use client";

import React from "react";
import { useTheme } from "@/hooks/useTheme";

interface MapSearchProps {
  search: string;
  searchFocused: boolean;
  loading: boolean;
  onSearchChange: (value: string) => void;
  onSearchFocus: (focused: boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function MapSearch({
  search,
  searchFocused,
  loading,
  onSearchChange,
  onSearchFocus,
  onSubmit,
}: MapSearchProps) {
  const { colorsTheme } = useTheme();
  const mapColors = colorsTheme.widgets.map;
  return (
    <form
      onSubmit={onSubmit}
      style={{
        position: "absolute",
        top: 8,
        left: 8,
        right: "auto",
        zIndex: 10,
        display: "flex",
        justifyContent: "flex-start",
        pointerEvents: "none",
      }}
      className="map-search-form"
    >
      <input
        type="text"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        onFocus={() => onSearchFocus(true)}
        onBlur={() => onSearchFocus(false)}
        placeholder={loading ? "Searching..." : "Search places..."}
        className={`map-search-input ${searchFocused ? "focused" : ""}`}
        autoComplete="off"
        style={{
          background: mapColors.searchColors.background,
          color: mapColors.searchColors.text,
          boxShadow: `0 1px 4px 0 ${mapColors.searchColors.shadow}`,
        }}
      />
    </form>
  );
}
