import { useState, useEffect, useCallback, useRef } from "react";
import {
  UseApiOptions,
  UseApiReturn,
  CacheEntry,
} from "../../interfaces/hooks";

export function useApi<T>(
  apiFunction: (...args: unknown[]) => Promise<T>,
  options: UseApiOptions<T> = {}
): UseApiReturn<T> {
  const {
    immediate = true,
    cacheTime = 5 * 60 * 1000, // 5 minutes
    retryCount = 2,
    onSuccess,
    onError,
  } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const cacheRef = useRef<Map<string, CacheEntry<T>>>(new Map());
  const abortControllerRef = useRef<AbortController | null>(null);

  const execute = useCallback(
    async (...args: unknown[]): Promise<T | null> => {
      const cacheKey = JSON.stringify(args);
      const cached = cacheRef.current.get(cacheKey);

      // Return cached data if still valid
      if (cached && Date.now() - cached.timestamp < cacheTime) {
        setData(cached.data);
        return cached.data;
      }

      // Cancel previous request if still pending
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();
      setLoading(true);
      setError(null);

      let lastError: Error;

      for (let attempt = 0; attempt <= retryCount; attempt++) {
        try {
          const result = await apiFunction(...args);

          // Check if request was aborted
          if (abortControllerRef.current?.signal.aborted) {
            return null;
          }

          setData(result);
          setLoading(false);

          // Cache the result
          cacheRef.current.set(cacheKey, {
            data: result,
            timestamp: Date.now(),
            loading: false,
          });

          onSuccess?.(result);
          return result;
        } catch (err) {
          lastError = err as Error;

          // Check if request was aborted
          if (abortControllerRef.current?.signal.aborted) {
            return null;
          }

          if (attempt === retryCount) {
            setError(lastError.message);
            setLoading(false);
            onError?.(lastError);
            return null;
          }

          // Wait before retrying
          await new Promise((resolve) =>
            setTimeout(resolve, 1000 * (attempt + 1))
          );
        }
      }

      return null;
    },
    [apiFunction, cacheTime, retryCount, onSuccess, onError]
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
    cacheRef.current.clear();
  }, []);

  const refetch = useCallback(async () => {
    await execute();
  }, [execute]);

  // Execute immediately if specified
  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [immediate, execute]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    data,
    loading,
    error,
    execute,
    reset,
    refetch,
  };
}

// Specialized hook for weather data
export function useWeatherApi(city: string) {
  return useApi(
    () =>
      import("../lib/api").then(({ WeatherAPI }) => {
        const weatherAPI = new WeatherAPI();
        return weatherAPI.getCityWeather(city);
      }),
    {
      cacheTime: 10 * 60 * 1000, // 10 minutes for weather data
      retryCount: 2,
    }
  );
}
