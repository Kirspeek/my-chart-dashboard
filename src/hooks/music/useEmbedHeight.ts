"use client";

import React from "react";
import { computeEmbedHeight } from "@/utils/musicUtils";

export function useEmbedHeight(embedUrl: string, isSearchMode: boolean) {
  return React.useMemo(
    () => computeEmbedHeight(embedUrl, isSearchMode),
    [embedUrl, isSearchMode]
  );
}
