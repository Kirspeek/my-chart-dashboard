"use client";

import React from "react";

export function useLikedTracks() {
  const [likedIds, setLikedIds] = React.useState<Set<string>>(new Set());

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem("music_liked_track_ids");
      if (raw) {
        const arr = JSON.parse(raw);
        if (Array.isArray(arr)) setLikedIds(new Set(arr as string[]));
      }
    } catch {}
  }, []);

  React.useEffect(() => {
    try {
      localStorage.setItem(
        "music_liked_track_ids",
        JSON.stringify(Array.from(likedIds))
      );
    } catch {}
  }, [likedIds]);

  const toggleLike = React.useCallback((id: string | null | undefined) => {
    if (!id) return;
    setLikedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const isLiked = React.useCallback(
    (id: string | null | undefined) => (id ? likedIds.has(id) : false),
    [likedIds]
  );

  return { likedIds, toggleLike, isLiked } as const;
}
