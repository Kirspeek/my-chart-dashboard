import { useState, useEffect, useCallback, useRef } from "react";

interface UseApiOptions<T> {
  immediate?: boolean;
  cacheTime?: number;
  retryCount?: number;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

interface UseApiReturn<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  execute: (...args: unknown[]) => Promise<T | null>;
  reset: () => void;
}

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

export function useApi<T>(
  apiFunction: (...args: unknown[]) => Promise<T>,
  options: UseApiOptions<T> = {}
): UseApiReturn<T> {
  const {
    immediate = false,
    cacheTime = 5 * 60 * 1000, // 5 minutes
    retryCount = 3,
    onSuccess,
    onError,
  } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const cacheRef = useRef<Map<string, CacheEntry<T>>>(new Map());
  const abortControllerRef = useRef<AbortController | null>(null);

  const reset = useCallback(() => {
    setData(null);
    setLoading(false);
    setError(null);
    cacheRef.current.clear();
  }, []);

  const execute = useCallback(
    async (...args: unknown[]): Promise<T | null> => {
      // Create cache key from function name and arguments
      const cacheKey = `${apiFunction.name}-${JSON.stringify(args)}`;

      // Check cache first
      const cached = cacheRef.current.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < cacheTime) {
        setData(cached.data);
        return cached.data;
      }

      // Cancel previous request if still pending
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new abort controller
      abortControllerRef.current = new AbortController();

      setLoading(true);
      setError(null);

      let lastError: Error;

      for (let attempt = 0; attempt <= retryCount; attempt++) {
        try {
          const result = await apiFunction(...args);

          // Cache the result
          cacheRef.current.set(cacheKey, {
            data: result,
            timestamp: Date.now(),
          });

          setData(result);
          setLoading(false);

          if (onSuccess) {
            onSuccess(result);
          }

          return result;
        } catch (err) {
          lastError = err as Error;

          // Don't retry if it's an abort error
          if (err instanceof Error && err.name === "AbortError") {
            break;
          }

          // Don't retry on last attempt
          if (attempt === retryCount) {
            break;
          }

          // Wait before retrying with exponential backoff
          const delay = 1000 * Math.pow(2, attempt);
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }

      setError(lastError!);
      setLoading(false);

      if (onError) {
        onError(lastError!);
      }

      return null;
    },
    [apiFunction, cacheTime, retryCount, onSuccess, onError]
  );

  useEffect(() => {
    if (immediate) {
      execute();
    }

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [immediate, execute]);

  return {
    data,
    loading,
    error,
    execute,
    reset,
  };
}

// Specialized hook for weather data
export function useWeatherApi(city: string) {
  return useApi(
    () =>
      import("../lib/api").then(({ WeatherAPI }) =>
        WeatherAPI.getCityWeather(city)
      ),
    {
      cacheTime: 10 * 60 * 1000, // 10 minutes for weather data
      retryCount: 2,
    }
  );
}
