"use client";

import React, { useMemo, useState } from "react";
import WidgetBase from "@/components/common/WidgetBase";
import InlineMusicPlayer from "./parts/InlineMusicPlayer";
import SearchTabs, { MainTab } from "./parts/SearchTabs";
import SearchResults, {
  SearchItem as SearchItemPart,
} from "./parts/SearchResults";
import Playlist from "./parts/Playlist";

interface TrackItem {
  id: string;
  title: string;
  artist: string;
  cover: string; // URL to artwork
  previewUrl?: string; // optional preview
  artistId?: string;
}

interface MusicWidgetProps {
  title?: string;
  tracks?: TrackItem[];
  spotifyTrackUrl?: string; // e.g., https://open.spotify.com/embed/track/{id}
}

// Simple player component with overlay prev/next buttons

export default function MusicWidget({
  tracks,
  spotifyTrackUrl = "https://open.spotify.com/embed/track/6Qb7YsAqH4wWFUMbGsCpap",
}: MusicWidgetProps) {
  const [playlist, setPlaylist] = useState<TrackItem[]>([]);
  const [current, setCurrent] = useState<TrackItem | null>(null);
  const [embedUrl, setEmbedUrl] = useState<string>(spotifyTrackUrl);
  const [repeatOne, setRepeatOne] = useState<boolean>(false);
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const [currentArtistId, setCurrentArtistId] = useState<string | null>(null);

  // Load liked track ids from localStorage on mount
  React.useEffect(() => {
    try {
      const raw = localStorage.getItem("music_liked_track_ids");
      if (raw) {
        const arr = JSON.parse(raw);
        if (Array.isArray(arr)) {
          setLikedIds(new Set(arr as string[]));
        }
      }
    } catch {}
  }, []);

  // Persist liked track ids whenever they change
  React.useEffect(() => {
    try {
      localStorage.setItem(
        "music_liked_track_ids",
        JSON.stringify(Array.from(likedIds))
      );
    } catch {}
  }, [likedIds]);

  // Search types and state
  type SearchResultType = "tracks" | "albums" | "artists" | "playlists";
  interface SearchItem {
    id: string;
    title: string;
    subtitle?: string;
    cover: string;
    kind: SearchResultType;
    artistId?: string;
  }

  const [search, setSearch] = useState<string>("");
  const [results, setResults] = useState<{
    tracks: SearchItem[];
    albums: SearchItem[];
    artists: SearchItem[];
    playlists: SearchItem[];
  }>({ tracks: [], albums: [], artists: [], playlists: [] });
  const [activeTab, setActiveTab] = useState<MainTab>("tracks");
  const [isSearchMode, setIsSearchMode] = useState<boolean>(false);

  const doSearch = React.useCallback(async () => {
    const q = search.trim();
    if (!q) return;
    try {
      const resp = await fetch(
        `/api/spotify/search?q=${encodeURIComponent(q)}`
      );
      const json = await resp.json();
      const mapped = {
        tracks: (json.tracks || []).map(
          (t: {
            id: string;
            title: string;
            artist: string;
            cover: string;
            artistId?: string;
          }) => ({
            id: t.id,
            title: t.title,
            subtitle: t.artist,
            cover: t.cover,
            kind: "tracks" as const,
            artistId: t.artistId,
          })
        ),
        albums: (json.albums || []).map(
          (a: {
            id: string;
            title: string;
            artist: string;
            cover: string;
          }) => ({
            id: a.id,
            title: a.title,
            subtitle: a.artist,
            cover: a.cover,
            kind: "albums" as const,
          })
        ),
        artists: (json.artists || []).map(
          (ar: { id: string; name: string; cover: string }) => ({
            id: ar.id,
            title: ar.name,
            subtitle: "Artist",
            cover: ar.cover,
            kind: "artists" as const,
          })
        ),
        playlists: (json.playlists || []).map(
          (p: { id: string; title: string; owner: string; cover: string }) => ({
            id: p.id,
            title: p.title,
            subtitle: p.owner,
            cover: p.cover,
            kind: "playlists" as const,
          })
        ),
      } as {
        tracks: SearchItem[];
        albums: SearchItem[];
        artists: SearchItem[];
        playlists: SearchItem[];
      };
      setResults(mapped);
      setActiveTab("tracks");
      setIsSearchMode(true);
    } catch {}
  }, [search]);

  // Compute embed height
  const embedHeight = useMemo(() => {
    try {
      if (isSearchMode) return 140;
      if (embedUrl.includes("/track/")) return 280;
      return 430;
    } catch {
      return isSearchMode ? 140 : 280;
    }
  }, [embedUrl, isSearchMode]);

  // Initialize from provided tracks or derive artist from embedUrl
  React.useEffect(() => {
    (async () => {
      if (tracks && tracks.length) {
        setPlaylist(tracks);
        setCurrent(tracks[0]);
        return;
      }
      try {
        const match = embedUrl.match(/embed\/track\/([^/?#]+)/);
        const trackId = match ? match[1] : null;
        if (!trackId) return;
        const res = await fetch(`/api/spotify/track?id=${trackId}`, {
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
  }, [tracks, embedUrl]);

  // Keep playlist in sync with current artist: when current or currentArtistId changes,
  // fetch that artist's top tracks and replace playlist.
  React.useEffect(() => {
    const artistId = currentArtistId;
    if (!artistId) return;
    let cancelled = false;
    (async () => {
      try {
        const resp = await fetch(`/api/spotify/artist?id=${artistId}`, {
          cache: "no-store",
        });
        const json = await resp.json();
        if (!cancelled && Array.isArray(json.tracks) && json.tracks.length) {
          setPlaylist(json.tracks);
        }
      } catch {}
    })();
    return () => {
      cancelled = true;
    };
  }, [currentArtistId]);

  // When current changes and it carries artistId, reflect it
  React.useEffect(() => {
    if (current?.artistId) setCurrentArtistId(current.artistId);
  }, [current?.artistId]);

  return (
    <WidgetBase className="w-full h-full" style={{ height: 720 }}>
      <div
        className="rounded-2xl p-4 md:p-6 flex flex-col gap-4 h-full overflow-hidden"
        style={{
          background: "var(--widget-bg)",
          border: "2px solid var(--card-border)",
          position: "relative",
        }}
      >
        {/* Search */}
        <div className="flex items-center gap-3">
          <input
            aria-label="Search music"
            placeholder="Search albums or tracks"
            className="flex-1 rounded-lg px-3 py-2 text-sm"
            style={{
              background: "var(--input-bg, var(--button-bg))",
              border: "1px solid var(--button-border)",
              color: "var(--primary-text)",
              outline: "none",
            }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") doSearch();
            }}
          />
          <button
            className="px-3 py-2 rounded-lg text-sm"
            style={{
              background: "var(--button-bg)",
              border: "1px solid var(--button-border)",
              color: "var(--secondary-text)",
            }}
            onClick={doSearch}
          >
            Search
          </button>
        </div>

        {/* Results */}
        <div
          className={
            "flex flex-col gap-4" + (isSearchMode ? " scrollbar-hide" : "")
          }
          style={
            isSearchMode
              ? {
                  flex: 1,
                  minHeight: 0,
                  overflowY: "auto",
                  paddingBottom: embedHeight + 24,
                }
              : undefined
          }
        >
          {isSearchMode &&
          (results.tracks.length ||
            results.albums.length ||
            results.artists.length ||
            results.playlists.length) ? (
            <SearchTabs activeTab={activeTab} onChange={setActiveTab} />
          ) : null}

          {isSearchMode &&
          (results.tracks.length ||
            results.albums.length ||
            results.artists.length ||
            results.playlists.length) ? (
            <div className="flex flex-col gap-4">
              {(() => {
                const items = results[activeTab] as SearchItem[];
                if (!items.length) return null;
                const label =
                  activeTab === "tracks"
                    ? "Songs"
                    : activeTab.charAt(0).toUpperCase() + activeTab.slice(1);
                return (
                  <div className="flex flex-col gap-1">
                    <div
                      className="text-xs font-bold"
                      style={{ color: "var(--secondary-text)" }}
                    >
                      {label}
                    </div>
                    <SearchResults
                      items={items as unknown as SearchItemPart[]}
                      label={label}
                      onChoose={(item) => {
                        if (item.kind === "tracks") {
                          setEmbedUrl(
                            `https://open.spotify.com/embed/track/${item.id}`
                          );
                          const asTrack: TrackItem = {
                            id: item.id,
                            title: item.title,
                            artist: item.subtitle || "",
                            cover: item.cover,
                            artistId: item.artistId,
                          };
                          setPlaylist((pl) =>
                            pl.some((x) => x.id === asTrack.id)
                              ? pl
                              : [asTrack, ...pl]
                          );
                          setCurrent(asTrack);
                          setIsSearchMode(false);
                          if (item.artistId) setCurrentArtistId(item.artistId);
                        } else if (item.kind === "albums") {
                          setEmbedUrl(
                            `https://open.spotify.com/embed/album/${item.id}`
                          );
                        } else if (item.kind === "artists") {
                          setEmbedUrl(
                            `https://open.spotify.com/embed/artist/${item.id}`
                          );
                          setCurrentArtistId(item.id);
                        }
                      }}
                    />
                  </div>
                );
              })()}
            </div>
          ) : null}

          {/* Player */}
          {isSearchMode ? (
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 3,
                background: "var(--widget-bg)",
                borderTop: "1px solid var(--button-border)",
              }}
              onClick={(e) => {
                const target = e.target as HTMLElement;
                if (target.closest("button")) return;
                setIsSearchMode(false);
              }}
            >
              <InlineMusicPlayer
                embedUrl={embedUrl}
                embedHeight={embedHeight}
                isSearchMode={isSearchMode}
                onExpand={() => setIsSearchMode(false)}
                onPrev={() => {
                  if (!playlist.length || !current) return;
                  const idx = playlist.findIndex((t) => t.id === current.id);
                  const prev =
                    idx > 0 ? playlist[idx - 1] : playlist[playlist.length - 1];
                  setCurrent(prev);
                  setEmbedUrl(
                    `https://open.spotify.com/embed/track/${prev.id}`
                  );
                }}
                onNext={() => {
                  if (!playlist.length || !current) return;
                  const idx = playlist.findIndex((t) => t.id === current.id);
                  const next =
                    idx < playlist.length - 1 ? playlist[idx + 1] : playlist[0];
                  setCurrent(next);
                  setEmbedUrl(
                    `https://open.spotify.com/embed/track/${next.id}`
                  );
                }}
                onShuffle={() => {
                  if (!playlist.length || !current) return;
                  if (playlist.length === 1) return;
                  const currentIndex = playlist.findIndex(
                    (t) => t.id === current.id
                  );
                  let idx = Math.floor(Math.random() * playlist.length);
                  if (idx === currentIndex) {
                    idx = (idx + 1) % playlist.length;
                  }
                  const track = playlist[idx];
                  setCurrent(track);
                  setEmbedUrl(
                    `https://open.spotify.com/embed/track/${track.id}`
                  );
                }}
                onRepeat={() => setRepeatOne((v) => !v)}
                repeatActive={repeatOne}
                onSave={() => {
                  if (!current?.id) return;
                  setLikedIds((prev) => {
                    const next = new Set(prev);
                    if (next.has(current.id)) next.delete(current.id);
                    else next.add(current.id);
                    return next;
                  });
                }}
                likedActive={current ? likedIds.has(current.id) : false}
              />
            </div>
          ) : (
            <InlineMusicPlayer
              embedUrl={embedUrl}
              embedHeight={embedHeight}
              isSearchMode={isSearchMode}
              onPrev={() => {
                if (!playlist.length || !current) return;
                const idx = playlist.findIndex((t) => t.id === current.id);
                const prev =
                  idx > 0 ? playlist[idx - 1] : playlist[playlist.length - 1];
                setCurrent(prev);
                setEmbedUrl(`https://open.spotify.com/embed/track/${prev.id}`);
              }}
              onNext={() => {
                if (!playlist.length || !current) return;
                const idx = playlist.findIndex((t) => t.id === current.id);
                const next =
                  idx < playlist.length - 1 ? playlist[idx + 1] : playlist[0];
                setCurrent(next);
                setEmbedUrl(`https://open.spotify.com/embed/track/${next.id}`);
              }}
              onShuffle={() => {
                if (!playlist.length || !current) return;
                if (playlist.length === 1) return;
                const currentIndex = playlist.findIndex(
                  (t) => t.id === current.id
                );
                let idx = Math.floor(Math.random() * playlist.length);
                if (idx === currentIndex) {
                  idx = (idx + 1) % playlist.length;
                }
                const track = playlist[idx];
                setCurrent(track);
                setEmbedUrl(`https://open.spotify.com/embed/track/${track.id}`);
              }}
              onRepeat={() => setRepeatOne((v) => !v)}
              repeatActive={repeatOne}
              onSave={() => {
                if (!current?.id) return;
                setLikedIds((prev) => {
                  const next = new Set(prev);
                  if (next.has(current.id)) next.delete(current.id);
                  else next.add(current.id);
                  return next;
                });
              }}
              likedActive={current ? likedIds.has(current.id) : false}
            />
          )}
        </div>

        {!isSearchMode && (
          <>
            <Playlist
              tracks={playlist}
              currentId={current?.id ?? null}
              onSelect={(t) => {
                setCurrent(t);
                setEmbedUrl(`https://open.spotify.com/embed/track/${t.id}`);
              }}
            />
          </>
        )}
      </div>
    </WidgetBase>
  );
}
