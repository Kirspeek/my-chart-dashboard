import { ForecastDay } from "./widgets";

// Weather Hook Interfaces
export interface UseWeatherReturn {
  forecast: ForecastDay[];
  error: string | null;
  refetch: () => Promise<void>;
  isCached: boolean;
  isPreloading: boolean;
  stale: boolean;
}

// Weather Preload Hook Interfaces
export interface UseWeatherPreloadOptions {
  autoPreload?: boolean;
  preloadOnMount?: boolean;
  cacheTime?: number;
}

export interface UseWeatherPreloadReturn {
  preloadCities: (cities: string[]) => Promise<void>;
  isPreloading: (city: string) => boolean;
  isCached: (city: string) => boolean;
  getStats: () => { cachedCities: number; preloadingCities: number };
  clearCache: () => void;
}

// Generic API Hook Interfaces
export interface UseApiOptions<T> {
  immediate?: boolean;
  cacheTime?: number;
  retryCount?: number;
  retryDelay?: number;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

export interface UseApiReturn<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  execute: (...args: unknown[]) => Promise<T | null>;
  reset: () => void;
  refetch: () => Promise<void>;
}

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  loading: boolean;
}
