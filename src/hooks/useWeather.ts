import { useState, useEffect, useCallback } from "react";
import { weatherCache } from "../lib/weatherCache";
import { UseWeatherReturn } from "@/interfaces/hooks";
import { ForecastDay } from "@/interfaces/widgets";

export default function useWeather(city: string): UseWeatherReturn {
  const [forecast, setForecast] = useState<ForecastDay[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ForecastDay[] | null>(null);
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
      setData(staleData.forecast);
      setStale(staleData.isStale);
      setError(
        staleData.isStale ? "Showing last known data (may be outdated)" : null
      );
    } else if (forecast.length === 0) {
      // Only if no data at all, set loading true and clear forecast
      setForecast([]);
      setData(null);
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
      setLoading(true);
      if (forceRefresh) {
        await weatherCache.clearAll();
      }
      try {
        const { forecast: weatherData } = await weatherCache.getWeather(city);

        setIsCached(weatherCache.isCached(city));
        setIsPreloading(weatherCache.isPreloading(city));

        // Do not early-return on cacheLoading; wait for inflight to resolve

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
            setData(staleData.forecast);
            setStale(true);
            setError("Showing last known data (may be outdated)");
          } else {
            setForecast([]);
            setData(null);
            setStale(false);
            setError("City not found");
          }
          setLoading(false);
          return;
        }

        setForecast(weatherData);
        setData(weatherData);
        setStale(false);
        setError(null);
        setLoading(false);
      } catch {
        // On error, try to get stale data
        const staleData = weatherCache.getStaleWeather(city);
        if (
          staleData &&
          Array.isArray(staleData.forecast) &&
          staleData.forecast.length > 0
        ) {
          setForecast(staleData.forecast);
          setData(staleData.forecast);
          setStale(true);
          setError("Showing last known data (may be outdated)");
        } else {
          setForecast([]);
          setData(null);
          setStale(false);
          setError("Weather fetch error");
        }
        setLoading(false);
      }
    },
    [city]
  );

  useEffect(() => {
    // Fetch without nuking cache to leverage preloaded results
    fetchWeather(false);
  }, [city, fetchWeather]);

  return {
    forecast,
    error,
    loading,
    data,
    refetch: fetchWeather,
    isCached,
    isPreloading,
    stale,
  };
}
