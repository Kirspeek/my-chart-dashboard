"use client";

import React from "react";
import { API_ENDPOINTS } from "@/apis/constants";
import type { TrackItem } from "@/interfaces/music";

export function useArtistTopTracks(artistId: string | null) {
  const [tracks, setTracks] = React.useState<TrackItem[]>([]);

  React.useEffect(() => {
    if (!artistId) return;
    let cancelled = false;
    (async () => {
      try {
        const resp = await fetch(
          API_ENDPOINTS.SPOTIFY.ARTIST_TOP_TRACKS(artistId),
          {
            cache: "no-store",
          }
        );
        const json = await resp.json();
        if (!cancelled && Array.isArray(json.tracks) && json.tracks.length) {
          setTracks(json.tracks);
        }
      } catch {}
    })();
    return () => {
      cancelled = true;
    };
  }, [artistId]);

  return tracks;
}
