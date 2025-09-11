"use client";

import React from "react";
import { MainTab, SearchTabsProps as Props } from "@/interfaces/music";

export default function SearchTabs({ activeTab, onChange }: Props) {
  const tabs: MainTab[] = ["tracks", "albums", "artists"];
  return (
    <div className="flex items-center gap-2">
      {tabs.map((tab) => {
        const label =
          tab === "tracks"
            ? "Songs"
            : ((tab.charAt(0).toUpperCase() + tab.slice(1)) as string);
        const isActive = activeTab === tab;
        return (
          <button
            key={tab}
            onClick={() => onChange(tab)}
            className="px-3 py-1.5 rounded-md text-xs"
            style={{
              background: isActive ? "var(--button-bg)" : "transparent",
              border: "1px solid var(--button-border)",
              color: isActive ? "var(--primary-text)" : "var(--secondary-text)",
            }}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
