import { useState, useEffect, useCallback } from "react";
import { weatherCache } from "../lib/weatherCache";
import { UseWeatherReturn } from "../../interfaces/hooks";
import { ForecastDay } from "../../interfaces/widgets";

export default function useWeather(city: string): UseWeatherReturn {
  const [forecast, setForecast] = useState<ForecastDay[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isCached, setIsCached] = useState(false);
  const [isPreloading, setIsPreloading] = useState(false);
  const [stale, setStale] = useState(false);

  // Optimistically set cached/stale data on city change, but do NOT clear forecast
  useEffect(() => {
    const staleData = weatherCache.getStaleWeather(city);
    if (
      staleData &&
      Array.isArray(staleData.forecast) &&
      staleData.forecast.length > 0
    ) {
      setForecast(staleData.forecast);
      setStale(staleData.isStale);
      setError(
        staleData.isStale ? "Showing last known data (may be outdated)" : null
      );
    } else if (forecast.length === 0) {
      // Only if no data at all, set loading true and clear forecast
      setForecast([]);
      setStale(false);
      setError(null);
    } // else: keep previous forecast until new data arrives
    setIsCached(weatherCache.isCached(city));
    setIsPreloading(weatherCache.isPreloading(city));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [city]);

  // Helper to force a fresh fetch from API
  const fetchWeather = useCallback(
    async (forceRefresh = false) => {
      if (forceRefresh) {
        await weatherCache.clearAll();
      }
      try {
        const { forecast: weatherData, loading: cacheLoading } =
          await weatherCache.getWeather(city);

        setIsCached(weatherCache.isCached(city));
        setIsPreloading(weatherCache.isPreloading(city));

        if (cacheLoading) {
          return;
        }

        if (
          !weatherData ||
          (Array.isArray(weatherData) && weatherData.length === 0)
        ) {
          // Try to get stale data
          const staleData = weatherCache.getStaleWeather(city);
          if (
            staleData &&
            Array.isArray(staleData.forecast) &&
            staleData.forecast.length > 0
          ) {
            setForecast(staleData.forecast);
            setStale(true);
            setError("Showing last known data (may be outdated)");
          } else {
            setForecast([]);
            setStale(false);
            setError("City not found");
          }
          return;
        }

        setForecast(weatherData);
        setStale(false);
        setError(null);
      } catch (err) {
        // On error, try to get stale data
        const staleData = weatherCache.getStaleWeather(city);
        if (
          staleData &&
          Array.isArray(staleData.forecast) &&
          staleData.forecast.length > 0
        ) {
          setForecast(staleData.forecast);
          setStale(true);
          setError("Showing last known data (may be outdated)");
        } else {
          setForecast([]);
          setStale(false);
          setError("Weather fetch error");
        }
        console.error("Weather fetch error:", err);
      }
    },
    [city]
  );

  useEffect(() => {
    fetchWeather(true);
  }, [city]);

  return {
    forecast,
    error,
    refetch: fetchWeather,
    isCached,
    isPreloading,
    stale,
  };
}
