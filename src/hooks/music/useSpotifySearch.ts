"use client";

import React from "react";
import { API_ENDPOINTS } from "@/apis/constants";
import type { MainTab } from "@/interfaces/music";
import { mapSearchApiResponse } from "@/utils/musicUtils";

type SearchResultType = "tracks" | "albums" | "artists" | "playlists";
type SearchItem = {
  id: string;
  title: string;
  subtitle?: string;
  cover: string;
  kind: SearchResultType;
  artistId?: string;
};

export function useSpotifySearch() {
  const [search, setSearch] = React.useState("");
  const [activeTab, setActiveTab] = React.useState<MainTab>("tracks");
  const [isSearchMode, setIsSearchMode] = React.useState(false);
  const [results, setResults] = React.useState<{
    tracks: SearchItem[];
    albums: SearchItem[];
    artists: SearchItem[];
    playlists: SearchItem[];
  }>({ tracks: [], albums: [], artists: [], playlists: [] });

  const doSearch = React.useCallback(async () => {
    const q = search.trim();
    if (!q) return;
    try {
      const resp = await fetch(API_ENDPOINTS.SPOTIFY.SEARCH(q));
      const json = await resp.json();
      const mapped = mapSearchApiResponse(json);
      setResults(mapped);
      setActiveTab("tracks");
      setIsSearchMode(true);
    } catch {}
  }, [search]);

  return {
    search,
    setSearch,
    results,
    activeTab,
    setActiveTab,
    isSearchMode,
    setIsSearchMode,
    doSearch,
  } as const;
}
