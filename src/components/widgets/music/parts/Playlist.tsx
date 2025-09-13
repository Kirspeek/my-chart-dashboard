"use client";

import React from "react";
import Image from "next/image";
import type { PlaylistProps } from "@/interfaces/music";

export default function Playlist({
  tracks,
  currentId,
  onSelect,
  compact = false,
}: PlaylistProps) {
  return (
    <div className="flex flex-col min-h-0" style={{ height: "100%" }}>
      <div
        className="min-h-0 overflow-auto scrollbar-hide"
        style={{
          border: "1px solid var(--button-border)",
          height: compact ? "100%" : "300px",
          maxHeight: compact ? "100%" : "300px",
          overflowY: "auto",
          borderRadius: "12px",
        }}
      >
        {tracks.map((t, i) => {
          const active = currentId ? t.id === currentId : false;
          const isLast = i === tracks.length - 1;
          return (
            <button
              key={`${t.id}-${i}`}
              onClick={() => onSelect(t)}
              className="w-full flex items-center gap-2 text-left"
              style={{
                background: active ? "var(--button-bg)" : "transparent",
                borderBottom: isLast
                  ? "none"
                  : "1px solid var(--button-border)",
                height: compact ? 38 : 75,
                padding: compact ? "6px" : "8px",
              }}
            >
              <Image
                src={t.cover || "/window.svg"}
                alt={t.title}
                width={compact ? 32 : 56}
                height={compact ? 32 : 56}
                style={{ borderRadius: 6, objectFit: "cover", flexShrink: 0 }}
              />
              <div className="flex-1 min-w-0">
                <div
                  className={`font-bold truncate ${compact ? "text-xs" : ""}`}
                  style={{ color: "var(--primary-text)" }}
                >
                  {t.title}
                </div>
                <div
                  className={`truncate ${compact ? "text-xs opacity-80" : "opacity-80"}`}
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
