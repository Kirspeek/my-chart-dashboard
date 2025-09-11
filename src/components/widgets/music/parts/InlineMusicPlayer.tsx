"use client";

import React from "react";
import {
  SkipBack,
  SkipForward,
  Heart,
  Repeat,
  Shuffle,
  Maximize2,
} from "lucide-react";

export type PlayerProps = {
  embedUrl: string;
  embedHeight: number;
  onPrev?: () => void;
  onNext?: () => void;
  onSave?: () => void;
  onShuffle?: () => void;
  onRepeat?: () => void;
  repeatActive?: boolean;
  likedActive?: boolean;
  isSearchMode?: boolean;
  onExpand?: () => void;
};

export default function InlineMusicPlayer({
  embedUrl,
  embedHeight,
  onPrev,
  onNext,
  onSave,
  onShuffle,
  onRepeat,
  repeatActive,
  likedActive,
  isSearchMode,
  onExpand,
}: PlayerProps) {
  return (
    <div style={{ position: "relative" }}>
      <iframe
        style={{ border: 0, width: "100%", height: embedHeight }}
        src={embedUrl}
        loading="lazy"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      />
      <div
        style={
          isSearchMode
            ? {
                position: "absolute",
                top: 4,
                right: 110,
                display: "flex",
                gap: 8,
                zIndex: 2,
              }
            : {
                position: "absolute",
                top: 15,
                left: 185,
                display: "flex",
                gap: 8,
                zIndex: 2,
              }
        }
      >
        {isSearchMode ? (
          <button
            className="px-2 py-1 rounded-lg"
            style={{
              border: "1px solid var(--button-border)",
              color: "#fff",
            }}
            aria-label="Expand"
            title="Expand"
            onClick={() => onExpand?.()}
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        ) : null}
        <button
          className="px-2 py-1 rounded-lg"
          style={{
            border: repeatActive
              ? "1px solid var(--primary-accent, var(--button-border))"
              : "1px solid var(--button-border)",
            color: "#fff",
          }}
          aria-label="Toggle Repeat"
          title="Toggle Repeat"
          onClick={() => onRepeat?.()}
        >
          <Repeat className="w-4 h-4" />
        </button>
        <button
          className="px-2 py-1 rounded-lg"
          style={{
            border: "1px solid var(--button-border)",
            color: "#fff",
          }}
          aria-label="Shuffle"
          title="Shuffle"
          onClick={() => onShuffle?.()}
        >
          <Shuffle className="w-4 h-4" />
        </button>
        <button
          className="px-2 py-1 rounded-lg"
          style={{
            border: "1px solid var(--button-border)",
            color: likedActive ? "#ef4444" : "#fff",
          }}
          aria-label={likedActive ? "Unlike" : "Like"}
          title={likedActive ? "Unlike" : "Like"}
          onClick={() => onSave?.()}
        >
          <Heart
            className="w-4 h-4"
            fill={likedActive ? "currentColor" : "none"}
          />
        </button>
      </div>
      <div
        style={
          isSearchMode
            ? {
                position: "absolute",
                top: 4,
                right: 30,
                display: "flex",
                gap: 8,
                zIndex: 2,
              }
            : {
                position: "absolute",
                bottom: 108,
                right: 15,
                display: "flex",
                gap: 8,
                zIndex: 2,
              }
        }
      >
        <button
          className="px-2 py-1 rounded-lg"
          style={{
            border: "1px solid var(--button-border)",
            color: "#fff",
          }}
          aria-label="Previous"
          title="Previous"
          onClick={() => onPrev?.()}
        >
          <SkipBack className="w-4 h-4" />
        </button>
        <button
          className="px-2 py-1 rounded-lg"
          style={{
            border: "1px solid var(--button-border)",
            color: "#fff",
          }}
          aria-label="Next"
          title="Next"
          onClick={() => onNext?.()}
        >
          <SkipForward className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
