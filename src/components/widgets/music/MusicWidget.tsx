"use client";

import React, { useState } from "react";
import WidgetBase from "@/components/common/WidgetBase";
import InlineMusicPlayer from "./parts/InlineMusicPlayer";
import { API_ENDPOINTS } from "@/apis/constants";
import SearchTabs from "./parts/SearchTabs";
import SearchResults from "./parts/SearchResults";
import {
  SearchItem as SearchItemPart,
  TrackItem,
  MusicWidgetProps,
} from "@/interfaces/music";
import Playlist from "./parts/Playlist";
import { useLikedTracks } from "@/hooks/music/useLikedTracks";
import { useSpotifySearch } from "@/hooks/music/useSpotifySearch";
import { useTrackFromEmbed } from "@/hooks/music/useTrackFromEmbed";
import { useArtistTopTracks } from "@/hooks/music/useArtistTopTracks";
import { useEmbedHeight } from "@/hooks/music/useEmbedHeight";

export default function MusicWidget({
  tracks,
  spotifyTrackUrl = "https://open.spotify.com/embed/track/1jDJFeK9x3OZboIAHsY9k2",
  compact = false,
}: MusicWidgetProps) {
  const [embedUrl, setEmbedUrl] = useState<string>(spotifyTrackUrl);
  const [repeatOne, setRepeatOne] = useState<boolean>(false);

  const { toggleLike, isLiked } = useLikedTracks();
  const {
    search,
    setSearch,
    results,
    activeTab,
    setActiveTab,
    isSearchMode,
    setIsSearchMode,
    doSearch,
  } = useSpotifySearch();
  const {
    current,
    setCurrent,
    playlist,
    setPlaylist,
    currentArtistId,
    setCurrentArtistId,
  } = useTrackFromEmbed(embedUrl, tracks);
  const topTracks = useArtistTopTracks(currentArtistId);
  const embedHeight = useEmbedHeight(embedUrl, isSearchMode);

  React.useEffect(() => {
    if (Array.isArray(topTracks) && topTracks.length) {
      setPlaylist(topTracks);
    }
  }, [topTracks, setPlaylist]);

  return (
    <WidgetBase
      className="w-full h-full"
      style={{ height: compact ? 280 : 600 }}
    >
      <div
        className={`${compact ? "p-2 md:p-3" : "p-4 md:p-6"} flex flex-col ${compact ? "gap-3" : "gap-4"} h-full overflow-hidden`}
        style={{
          background: "var(--widget-bg)",
          border: "2px solid var(--card-border)",
          position: "relative",
          borderRadius: "20px",
        }}
      >
        <div className="flex items-center gap-2">
          <input
            aria-label="Search music"
            placeholder="Search albums or tracks"
            className="flex-1 px-2 py-1.5 text-xs"
            style={{
              background: "var(--input-bg, var(--button-bg))",
              border: "1px solid var(--button-border)",
              color: "var(--primary-text)",
              outline: "none",
              borderRadius: "10px",
            }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") doSearch();
            }}
          />
          <button
            className="px-2 py-1.5 text-xs"
            style={{
              background: "var(--button-bg)",
              border: "1px solid var(--button-border)",
              color: "var(--secondary-text)",
              borderRadius: "10px",
            }}
            onClick={doSearch}
          >
            Search
          </button>
        </div>

        <div
          className={
            isSearchMode
              ? "flex flex-col gap-2 scrollbar-hide"
              : compact
                ? "flex flex-col gap-2 items-stretch"
                : "flex flex-col"
          }
          style={
            isSearchMode
              ? {
                flex: 1,
                minHeight: 0,
                overflowY: "auto",
                paddingBottom: embedHeight + 2,
              }
              : compact
                ? {
                  flex: 1,
                  minHeight: 0,
                  alignItems: "stretch",
                }
                : {
                  flex: 1,
                  minHeight: 0,
                }
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
                const items = results[activeTab] as SearchItemPart[];
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
                            API_ENDPOINTS.SPOTIFY_EMBED.track(item.id)
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
                            API_ENDPOINTS.SPOTIFY_EMBED.album(item.id)
                          );
                        } else if (item.kind === "artists") {
                          setEmbedUrl(
                            API_ENDPOINTS.SPOTIFY_EMBED.artist(item.id)
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
                  setEmbedUrl(API_ENDPOINTS.SPOTIFY_EMBED.track(prev.id));
                }}
                onNext={() => {
                  if (!playlist.length || !current) return;
                  const idx = playlist.findIndex((t) => t.id === current.id);
                  const next =
                    idx < playlist.length - 1 ? playlist[idx + 1] : playlist[0];
                  setCurrent(next);
                  setEmbedUrl(API_ENDPOINTS.SPOTIFY_EMBED.track(next.id));
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
                  setEmbedUrl(API_ENDPOINTS.SPOTIFY_EMBED.track(track.id));
                }}
                onRepeat={() => setRepeatOne((v) => !v)}
                repeatActive={repeatOne}
                onSave={() => toggleLike(current?.id)}
                likedActive={isLiked(current?.id)}
              />
            </div>
          ) : compact ? (
            <>
              <div
                className="flex-1"
                style={{
                  width: "100%",
                  height: "180px",
                }}
              >
                <InlineMusicPlayer
                  embedUrl={embedUrl}
                  embedHeight={180}
                  isSearchMode={isSearchMode}
                  onPrev={() => {
                    if (!playlist.length || !current) return;
                    const idx = playlist.findIndex((t) => t.id === current.id);
                    const prev =
                      idx > 0
                        ? playlist[idx - 1]
                        : playlist[playlist.length - 1];
                    setCurrent(prev);
                    setEmbedUrl(API_ENDPOINTS.SPOTIFY_EMBED.track(prev.id));
                  }}
                  onNext={() => {
                    if (!playlist.length || !current) return;
                    const idx = playlist.findIndex((t) => t.id === current.id);
                    const next =
                      idx < playlist.length - 1
                        ? playlist[idx + 1]
                        : playlist[0];
                    setCurrent(next);
                    setEmbedUrl(API_ENDPOINTS.SPOTIFY_EMBED.track(next.id));
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
                    setEmbedUrl(API_ENDPOINTS.SPOTIFY_EMBED.track(track.id));
                  }}
                  onRepeat={() => setRepeatOne((v) => !v)}
                  repeatActive={repeatOne}
                  onSave={() => toggleLike(current?.id)}
                  likedActive={isLiked(current?.id)}
                />
              </div>
              <div
                className="flex-1"
                style={{
                  width: "100%",
                  height: "150px",
                }}
              >
                <Playlist
                  tracks={playlist}
                  currentId={current?.id ?? null}
                  onSelect={(t) => {
                    setCurrent(t);
                    setEmbedUrl(API_ENDPOINTS.SPOTIFY_EMBED.track(t.id));
                  }}
                  compact={true}
                />
              </div>
            </>
          ) : (
            <>
              <div className="flex-1 overflow-hidden">
                <InlineMusicPlayer
                  embedUrl={embedUrl}
                  embedHeight={Math.min(embedHeight, 600)}
                  isSearchMode={isSearchMode}
                  onPrev={() => {
                    if (!playlist.length || !current) return;
                    const idx = playlist.findIndex((t) => t.id === current.id);
                    const prev =
                      idx > 0
                        ? playlist[idx - 1]
                        : playlist[playlist.length - 1];
                    setCurrent(prev);
                    setEmbedUrl(API_ENDPOINTS.SPOTIFY_EMBED.track(prev.id));
                  }}
                  onNext={() => {
                    if (!playlist.length || !current) return;
                    const idx = playlist.findIndex((t) => t.id === current.id);
                    const next =
                      idx < playlist.length - 1
                        ? playlist[idx + 1]
                        : playlist[0];
                    setCurrent(next);
                    setEmbedUrl(API_ENDPOINTS.SPOTIFY_EMBED.track(next.id));
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
                    setEmbedUrl(API_ENDPOINTS.SPOTIFY_EMBED.track(track.id));
                  }}
                  onRepeat={() => setRepeatOne((v) => !v)}
                  repeatActive={repeatOne}
                  onSave={() => toggleLike(current?.id)}
                  likedActive={isLiked(current?.id)}
                />
              </div>
              <div className="flex-1 overflow-hidden">
                <Playlist
                  tracks={playlist}
                  currentId={current?.id ?? null}
                  onSelect={(t) => {
                    setCurrent(t);
                    setEmbedUrl(API_ENDPOINTS.SPOTIFY_EMBED.track(t.id));
                  }}
                  compact={false}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </WidgetBase>
  );
}
