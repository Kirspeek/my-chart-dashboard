import { useEffect, useCallback } from "react";
import { weatherCache } from "../lib/weatherCache";

interface UseWeatherPreloadOptions {
  autoPreload?: boolean;
  preloadOnMount?: boolean;
}

interface UseWeatherPreloadReturn {
  preloadCities: (cities: string[]) => Promise<void>;
  isCached: (city: string) => boolean;
  isPreloading: (city: string) => boolean;
  getStats: () => { cachedCities: number; preloadingCities: number };
  clearCache: () => void;
}

export function useWeatherPreload(
  cities: string[] = [],
  options: UseWeatherPreloadOptions = {}
): UseWeatherPreloadReturn {
  const { autoPreload = true, preloadOnMount = true } = options;

  const preloadCities = useCallback(async (citiesToPreload: string[]) => {
    if (citiesToPreload.length === 0) return;

    try {
      await weatherCache.preloadCities(citiesToPreload);
    } catch (error) {
      console.error("Failed to preload cities:", error);
    }
  }, []);

  const isCached = useCallback((city: string) => {
    return weatherCache.isCached(city);
  }, []);

  const isPreloading = useCallback((city: string) => {
    return weatherCache.isPreloading(city);
  }, []);

  const getStats = useCallback(() => {
    return weatherCache.getStats();
  }, []);

  const clearCache = useCallback(() => {
    weatherCache.clearAll();
  }, []);

  // Auto-preload cities when they change
  useEffect(() => {
    if (autoPreload && cities.length > 0) {
      preloadCities(cities);
    }
  }, [cities, autoPreload, preloadCities]);

  // Preload on mount if specified
  useEffect(() => {
    if (preloadOnMount && cities.length > 0) {
      preloadCities(cities);
    }
  }, [preloadOnMount, cities, preloadCities]);

  return {
    preloadCities,
    isCached,
    isPreloading,
    getStats,
    clearCache,
  };
}
