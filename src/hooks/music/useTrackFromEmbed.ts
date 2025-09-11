"use client";

import React from "react";
import { API_ENDPOINTS } from "@/apis/constants";
import { getTrackIdFromEmbedUrl } from "@/utils/musicUtils";
import type { TrackItem } from "@/interfaces/music";

export function useTrackFromEmbed(
  embedUrl: string,
  initialTracks?: TrackItem[]
) {
  const [current, setCurrent] = React.useState<TrackItem | null>(null);
  const [playlist, setPlaylist] = React.useState<TrackItem[]>([]);
  const [currentArtistId, setCurrentArtistId] = React.useState<string | null>(
    null
  );

  React.useEffect(() => {
    (async () => {
      if (initialTracks && initialTracks.length) {
        setPlaylist(initialTracks);
        setCurrent(initialTracks[0]);
        return;
      }
      try {
        const trackId = getTrackIdFromEmbedUrl(embedUrl);
        if (!trackId) return;
        const res = await fetch(API_ENDPOINTS.SPOTIFY.TRACK(trackId), {
          cache: "no-store",
        });
        const json = await res.json();
        if (json?.track) {
          const t = json.track as TrackItem;
          setCurrent(t);
          if (t.artistId) setCurrentArtistId(t.artistId);
        }
      } catch {}
    })();
  }, [embedUrl, initialTracks]);

  React.useEffect(() => {
    if (current?.artistId) setCurrentArtistId(current.artistId);
  }, [current?.artistId]);

  return {
    current,
    setCurrent,
    playlist,
    setPlaylist,
    currentArtistId,
    setCurrentArtistId,
  } as const;
}
