import { ForecastDay } from "./widgets";
import { LoadingState, CacheEntry } from "./base";

// ============================================================================
// WEATHER HOOK INTERFACES
// ============================================================================

export interface UseWeatherReturn extends LoadingState {
  forecast: ForecastDay[];
  refetch: () => Promise<void>;
  isCached: boolean;
  isPreloading: boolean;
  stale: boolean;
}

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

// ============================================================================
// GENERIC API HOOK INTERFACES
// ============================================================================

export interface UseApiOptions<T> {
  immediate?: boolean;
  cacheTime?: number;
  retryCount?: number;
  retryDelay?: number;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

export interface UseApiReturn<T> extends LoadingState {
  data: T | null;
  execute: (...args: unknown[]) => Promise<T | null>;
  reset: () => void;
  refetch: () => Promise<void>;
}

// ============================================================================
// WIDGET HOOK INTERFACES
// ============================================================================

export interface UseWidgetLogicProps {
  widgetId: string;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export interface UseWidgetLogicReturn<T> extends LoadingState {
  data: T | null;
  refresh: () => Promise<void>;
  updateData: (data: T) => void;
  reset: () => void;
}

// ============================================================================
// THEME HOOK INTERFACES
// ============================================================================

export interface UseThemeReturn {
  theme: string;
  colors: Record<string, string>;
  toggleTheme: () => void;
  setTheme: (theme: string) => void;
  isDark: boolean;
}

// ============================================================================
// ANIMATION HOOK INTERFACES
// ============================================================================

export interface UseAnimationProps {
  duration?: number;
  delay?: number;
  easing?: string;
  trigger?: "mount" | "hover" | "click" | "scroll";
}

export interface UseAnimationReturn {
  isAnimating: boolean;
  startAnimation: () => void;
  stopAnimation: () => void;
  resetAnimation: () => void;
}

// ============================================================================
// SCROLL HOOK INTERFACES
// ============================================================================

export interface UseScrollProps {
  threshold?: number;
  debounceMs?: number;
}

export interface UseScrollReturn {
  scrollY: number;
  scrollX: number;
  scrollDirection: "up" | "down" | "left" | "right" | null;
  isScrolling: boolean;
  hasScrolled: boolean;
}

// ============================================================================
// RESIZE HOOK INTERFACES
// ============================================================================

export interface UseResizeProps {
  debounceMs?: number;
}

export interface UseResizeReturn {
  width: number;
  height: number;
  isResizing: boolean;
  aspectRatio: number;
}

// ============================================================================
// LOCAL STORAGE HOOK INTERFACES
// ============================================================================

export interface UseLocalStorageProps<T> {
  key: string;
  defaultValue: T;
  serialize?: (value: T) => string;
  deserialize?: (value: string) => T;
}

export interface UseLocalStorageReturn<T> {
  value: T;
  setValue: (value: T) => void;
  removeValue: () => void;
  clearAll: () => void;
}

// ============================================================================
// DEBOUNCE HOOK INTERFACES
// ============================================================================

export interface UseDebounceProps {
  delay: number;
  immediate?: boolean;
}

export interface UseDebounceReturn<T> {
  value: T;
  setValue: (value: T) => void;
  isDebouncing: boolean;
}

// ============================================================================
// THROTTLE HOOK INTERFACES
// ============================================================================

export interface UseThrottleProps {
  delay: number;
  immediate?: boolean;
}

export interface UseThrottleReturn<T> {
  value: T;
  setValue: (value: T) => void;
  isThrottling: boolean;
}

// ============================================================================
// INTERSECTION OBSERVER HOOK INTERFACES
// ============================================================================

export interface UseIntersectionObserverProps {
  threshold?: number | number[];
  rootMargin?: string;
  root?: Element | null;
}

export interface UseIntersectionObserverReturn {
  ref: React.RefObject<Element>;
  isIntersecting: boolean;
  intersectionRatio: number;
  entry: IntersectionObserverEntry | null;
}

// ============================================================================
// MEDIA QUERY HOOK INTERFACES
// ============================================================================

export interface UseMediaQueryProps {
  query: string;
  defaultMatches?: boolean;
}

export interface UseMediaQueryReturn {
  matches: boolean;
  mediaQueryList: MediaQueryList | null;
}

// ============================================================================
// CACHE HOOK INTERFACES
// ============================================================================

export interface UseCacheProps {
  key: string;
  ttl?: number;
  maxSize?: number;
}

export interface UseCacheReturn<T> {
  get: (key: string) => T | null;
  set: (key: string, value: T) => void;
  has: (key: string) => boolean;
  delete: (key: string) => boolean;
  clear: () => void;
  size: number;
  entries: () => IterableIterator<[string, CacheEntry<T>]>;
}
