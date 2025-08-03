"use client";

import React from "react";

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
  return (
    <form
      onSubmit={onSubmit}
      style={{
        position: "absolute",
        top: 16,
        left: 16,
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
        style={{
          minWidth: 180,
          maxWidth: 260,
          width: "100%",
          padding: "0.5rem 1rem",
          borderRadius: 12,
          border: "none",
          outline: "none",
          background: searchFocused
            ? "rgba(255,255,255,0.95)"
            : "rgba(255,255,255,0.5)",
          boxShadow: searchFocused
            ? "0 2px 12px 0 rgba(124,58,237,0.10)"
            : "0 1px 4px 0 rgba(124,58,237,0.04)",
          fontSize: 15,
          color: "#222",
          transition: "all 0.2s cubic-bezier(.4,0,.2,1)",
          pointerEvents: "auto",
          opacity: searchFocused ? 1 : 0.7,
          backdropFilter: "blur(4px)",
        }}
        className="map-search-input"
        autoComplete="off"
      />
    </form>
  );
}
