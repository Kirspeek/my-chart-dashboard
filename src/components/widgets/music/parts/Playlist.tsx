"use client";

import React from "react";
import Image from "next/image";

export type TrackItem = {
  id: string;
  title: string;
  artist: string;
  cover: string;
};

type Props = {
  tracks: TrackItem[];
  currentId?: string | null;
  onSelect: (track: TrackItem) => void;
};

export default function Playlist({ tracks, currentId, onSelect }: Props) {
  return (
    <div className="flex flex-col min-h-0">
      <div
        className="text-sm font-bold"
        style={{ color: "var(--secondary-text)" }}
      >
        Playlist
      </div>
      <div
        className="min-h-0 overflow-auto rounded-xl scrollbar-hide"
        style={{
          border: "1px solid var(--button-border)",
          height: 240,
          maxHeight: 240,
          overflowY: "auto",
        }}
      >
        {tracks.map((t, i) => {
          const active = currentId ? t.id === currentId : false;
          const isLast = i === tracks.length - 1;
          return (
            <button
              key={`${t.id}-${i}`}
              onClick={() => onSelect(t)}
              className="w-full flex items-center gap-3 p-3 text-left"
              style={{
                background: active ? "var(--button-bg)" : "transparent",
                borderBottom: isLast
                  ? "none"
                  : "1px solid var(--button-border)",
                height: 80,
              }}
            >
              <Image
                src={t.cover || "/window.svg"}
                alt={t.title}
                width={56}
                height={56}
                style={{ borderRadius: 8, objectFit: "cover", flexShrink: 0 }}
              />
              <div className="flex-1 min-w-0">
                <div
                  className="font-bold truncate"
                  style={{ color: "var(--primary-text)" }}
                >
                  {t.title}
                </div>
                <div
                  className="text-xs truncate"
                  style={{ color: "var(--secondary-text)" }}
                >
                  {t.artist}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
