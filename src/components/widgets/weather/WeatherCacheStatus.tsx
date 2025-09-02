"use client";

import React from "react";
import { useWeatherPreload } from "@/hooks";
import { WeatherCacheStatusProps } from "../../../../interfaces/components";

export default function WeatherCacheStatus({
  cities,
  className = "",
}: WeatherCacheStatusProps) {
  const { isCached, isPreloading, getStats, clearCache } = useWeatherPreload(
    cities,
    { autoPreload: true, preloadOnMount: true }
  );

  const stats = getStats();

  return (
    <div
      className={`bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10 ${className}`}
      style={{ fontSize: 14 }}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-white/90">Weather Cache</h3>
        <button
          onClick={clearCache}
          className="text-xs px-2 py-1 bg-red-500/20 hover:bg-red-500/30 rounded transition-colors"
        >
          Clear
        </button>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-white/70">Cached cities:</span>
          <span className="text-green-400">{stats.cachedCities}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/70">Preloading:</span>
          <span className="text-yellow-400">{stats.preloadingCities}</span>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-white/10">
        <div className="text-xs text-white/60 mb-2">City Status:</div>
        <div className="space-y-1">
          {cities.map((city) => (
            <div key={city} className="flex justify-between text-xs">
              <span className="text-white/80">{city}</span>
              <span
                className={
                  isCached(city)
                    ? "text-green-400"
                    : isPreloading(city)
                      ? "text-yellow-400"
                      : "text-red-400"
                }
              >
                {isCached(city) ? "✓" : isPreloading(city) ? "⟳" : "✗"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
