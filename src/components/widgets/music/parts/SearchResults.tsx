"use client";

import React from "react";
import Image from "next/image";

export type SearchItem = {
  id: string;
  title: string;
  subtitle?: string;
  cover: string;
  kind: "tracks" | "albums" | "artists" | "playlists";
  artistId?: string;
};

type Props = {
  items: SearchItem[];
  label: string;
  onChoose: (item: SearchItem) => void;
};

export default function SearchResults({ items, label, onChoose }: Props) {
  if (!items.length) return null;
  return (
    <div className="flex flex-col gap-1">
      <div
        className="text-xs font-bold"
        style={{ color: "var(--secondary-text)" }}
      >
        {label}
      </div>
      <div
        className="rounded-xl overflow-hidden"
        style={{ border: "1px solid var(--button-border)" }}
      >
        {items.map((item) => (
          <button
            key={`${item.kind}-${item.id}`}
            onClick={() => onChoose(item)}
            className="w-full flex items-center gap-3 p-3 text-left"
            style={{ borderBottom: "1px solid var(--button-border)" }}
          >
            <Image
              src={item.cover || "/window.svg"}
              alt={item.title}
              width={56}
              height={56}
              style={{ borderRadius: 8, objectFit: "cover" }}
            />
            <div className="flex-1">
              <div
                className="font-bold"
                style={{ color: "var(--primary-text)" }}
              >
                {item.title}
              </div>
              {item.subtitle && (
                <div
                  className="text-xs"
                  style={{ color: "var(--secondary-text)" }}
                >
                  {item.subtitle}
                </div>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
