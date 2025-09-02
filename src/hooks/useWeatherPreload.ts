import { useCallback, useEffect } from "react";
import { weatherCache } from "../lib/weatherCache";
import {
  UseWeatherPreloadOptions,
  UseWeatherPreloadReturn,
} from "@/interfaces/hooks";

export function useWeatherPreload(
  cities: string[],
  options: UseWeatherPreloadOptions = {}
): UseWeatherPreloadReturn {
  const { autoPreload = true, preloadOnMount = true } = options;

  const preloadCities = useCallback(async (citiesToPreload: string[]) => {
    await weatherCache.preloadCities(citiesToPreload);
  }, []);

  const isCached = useCallback(
    (city: string) => weatherCache.isCached(city),
    []
  );

  const isPreloading = useCallback(
    (city: string) => weatherCache.isPreloading(city),
    []
  );

  const getStats = useCallback(() => weatherCache.getStats(), []);

  const clearCache = useCallback(() => {
    weatherCache.clearAll();
  }, []);

  // Auto-preload on mount if enabled
  useEffect(() => {
    if (preloadOnMount && cities.length > 0) {
      preloadCities(cities);
    }
  }, [cities, preloadOnMount, preloadCities]);

  // Auto-preload when cities change if enabled
  useEffect(() => {
    if (autoPreload && cities.length > 0) {
      preloadCities(cities);
    }
  }, [cities, autoPreload, preloadCities]);

  return {
    preloadCities,
    isCached,
    isPreloading,
    getStats,
    clearCache,
  };
}
