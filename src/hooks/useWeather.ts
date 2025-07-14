import { useState, useEffect, useCallback } from "react";
import { weatherCache } from "../lib/weatherCache";
import { ForecastDay } from "../../interfaces/widgets";

interface UseWeatherReturn {
  forecast: ForecastDay[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  isCached: boolean;
  isPreloading: boolean;
}

export function useWeather(city: string): UseWeatherReturn {
  const [forecast, setForecast] = useState<ForecastDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCached, setIsCached] = useState(false);
  const [isPreloading, setIsPreloading] = useState(false);

  const fetchWeather = useCallback(async () => {
    setLoading(true);
    setError(null);
    setForecast([]);

    try {
      const { forecast: weatherData, loading: cacheLoading } =
        await weatherCache.getWeather(city);

      setIsCached(weatherCache.isCached(city));
      setIsPreloading(weatherCache.isPreloading(city));

      if (cacheLoading) {
        // Data is being fetched in background, show loading
        setLoading(true);
        return;
      }

      if (!weatherData || weatherData.length === 0) {
        setError("City not found");
        return;
      }

      setForecast(weatherData);
    } catch (err) {
      setError("Weather fetch error");
      console.error("Weather fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [city]);

  useEffect(() => {
    fetchWeather();
  }, [fetchWeather]);

  return {
    forecast,
    loading,
    error,
    refetch: fetchWeather,
    isCached,
    isPreloading,
  };
}
