import { WeatherAPI, WeatherForecastResponse } from "./api";
import { ForecastDay } from "@/interfaces/widgets";
import { CachedWeatherData } from "@/interfaces/api";

class WeatherCacheManager {
  private cache = new Map<string, CachedWeatherData>();
  private preloadQueue = new Set<string>();
  private cacheTimeout = 10 * 60 * 1000; // 10 minutes
  private inflight = new Map<
    string,
    Promise<{
      forecast: ForecastDay[];
      coords: { lat: number; lon: number } | null;
      loading: boolean;
    }>
  >();

  /**
   * Get weather data for a city (from cache or fetch)
   */
  async getWeather(city: string): Promise<{
    forecast: ForecastDay[];
    coords: { lat: number; lon: number } | null;
    loading: boolean;
  }> {
    const normalizedCity = this.normalizeCity(city);
    const cached = this.cache.get(normalizedCity);

    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      if (cached.loading) {
        const inflight = this.inflight.get(normalizedCity);
        if (inflight) {
          return inflight;
        }
        // No tracked inflight request, fall through to start a new fetch
        return this.fetchAndCacheWeather(normalizedCity);
      }
      return {
        forecast: cached.forecast,
        coords: cached.coords,
        loading: cached.loading,
      };
    }

    return this.fetchAndCacheWeather(normalizedCity);
  }

  async preloadCities(cities: string[]): Promise<void> {
    const citiesToPreload = cities.filter(
      (city) => !this.isCached(city) && !this.preloadQueue.has(city)
    );

    if (citiesToPreload.length === 0) return;

    citiesToPreload.forEach((city) => this.preloadQueue.add(city));

    const preloadPromises = citiesToPreload.map(async (city) => {
      try {
        await this.fetchAndCacheWeather(this.normalizeCity(city));
      } catch {
        // Failed to preload weather
      } finally {
        this.preloadQueue.delete(city);
      }
    });

    await Promise.allSettled(preloadPromises);
  }

  isCached(city: string): boolean {
    const normalizedCity = this.normalizeCity(city);
    const cached = this.cache.get(normalizedCity);
    return (
      cached !== undefined && Date.now() - cached.timestamp < this.cacheTimeout
    );
  }

  /**
   * Check if a city is currently being preloaded
   */
  isPreloading(city: string): boolean {
    return this.preloadQueue.has(this.normalizeCity(city));
  }

  /**
   * Clear expired cache entries
   */
  clearExpired(): void {
    const now = Date.now();
    for (const [city, data] of this.cache.entries()) {
      if (now - data.timestamp > this.cacheTimeout) {
        this.cache.delete(city);
      }
    }
  }

  /**
   * Clear all cache
   */
  clearAll(): void {
    this.cache.clear();
    this.preloadQueue.clear();
    this.inflight.clear();
  }

  /**
   * Get cache statistics
   */
  getStats(): { cachedCities: number; preloadingCities: number } {
    return {
      cachedCities: this.cache.size,
      preloadingCities: this.preloadQueue.size,
    };
  }

  /**
   * Get stale weather data for a city (returns cached data even if expired)
   */
  getStaleWeather(city: string): {
    forecast: ForecastDay[];
    coords: { lat: number; lon: number } | null;
    loading: boolean;
    isStale: boolean;
  } | null {
    const normalizedCity = this.normalizeCity(city);
    const cached = this.cache.get(normalizedCity);
    if (!cached) return null;
    const isStale = Date.now() - cached.timestamp >= this.cacheTimeout;
    return {
      forecast: cached.forecast,
      coords: cached.coords,
      loading: cached.loading,
      isStale,
    };
  }

  private async fetchAndCacheWeather(city: string): Promise<{
    forecast: ForecastDay[];
    coords: { lat: number; lon: number } | null;
    loading: boolean;
  }> {
    const existing = this.inflight.get(city);
    if (existing) return existing;

    const fetchPromise = (async () => {
      // Mark as loading
      this.cache.set(city, {
        forecast: [],
        coords: null,
        timestamp: Date.now(),
        loading: true,
      });

      try {
        const weatherAPI = new WeatherAPI();
        const { forecast: weatherData, coords } =
          await weatherAPI.getCityWeather(city);

        if (!weatherData?.daily) {
          // No weather data available
          throw new Error("No weather data available");
        }

        const forecast = this.processWeatherData(weatherData);

        // Update cache with successful data
        this.cache.set(city, {
          forecast,
          coords,
          timestamp: Date.now(),
          loading: false,
        });

        return { forecast, coords, loading: false };
      } catch (error) {
        // Weather fetch error - propagate failure state to cache
        // We set empty forecast so the UI knows it failed (or shows empty state)
        this.cache.set(city, {
          forecast: [],
          coords: null,
          timestamp: Date.now(),
          loading: false,
        });
        
        // Return empty result
        return { forecast: [], coords: null, loading: false };
      } finally {
        this.inflight.delete(city);
      }
    })();

    this.inflight.set(city, fetchPromise);
    return fetchPromise;
  }

  private getMockWeatherData(city: string): {
    forecast: ForecastDay[];
    coords: { lat: number; lon: number } | null;
    loading: boolean;
  } {
    const mockData = WeatherAPI.getMockWeatherData(city);
    const forecast = this.processWeatherData(mockData.forecast);

    // Update cache with mock data
    this.cache.set(city, {
      forecast,
      coords: mockData.coords,
      timestamp: Date.now(),
      loading: false,
    });

    return { forecast, coords: mockData.coords, loading: false };
  }

  private processWeatherData(
    weatherData: WeatherForecastResponse
  ): ForecastDay[] {
    if (!weatherData.daily) return [];

    const days: ForecastDay[] = [];
    for (let i = 0; i < Math.min(5, weatherData.daily.time.length); i++) {
      const date = new Date(weatherData.daily.time[i]);
      const day = date.toLocaleDateString(undefined, {
        weekday: "short",
      });
      const min = Math.round(weatherData.daily.temperature_2m_min[i]);
      const max = Math.round(weatherData.daily.temperature_2m_max[i]);
      const code = weatherData.daily.weathercode[i];
      const desc = this.getWeatherDescription(code);

      days.push({
        day,
        icon: this.getWeatherIcon(desc),
        min,
        max,
        desc,
      });
    }

    return days;
  }

  private getWeatherDescription(code: number): string {
    if (code === 0) return "Clear sky";
    if (code === 1 || code === 2 || code === 3) return "Partly cloudy";
    if (code === 45 || code === 48) return "Fog";
    if (code === 51 || code === 53 || code === 55) return "Drizzle";
    if (code === 61 || code === 63 || code === 65) return "Rain";
    if (code === 71 || code === 73 || code === 75) return "Snow";
    if (code === 80 || code === 81 || code === 82) return "Showers";
    if (code === 95) return "Thunderstorm";
    if (code === 96 || code === 99) return "Thunderstorm with hail";
    return "Unknown";
  }

  private getWeatherIcon(desc: string): string {
    if (/clear/i.test(desc)) return "☀️";
    if (/cloud/i.test(desc)) return "🌤️";
    if (/rain/i.test(desc)) return "🌧️";
    if (/storm|thunder/i.test(desc)) return "⛈️";
    if (/snow/i.test(desc)) return "❄️";
    return "🌡️";
  }

  private normalizeCity(city: string): string {
    return city.toLowerCase().trim();
  }
}

// Export singleton instance
export const weatherCache = new WeatherCacheManager();

// Auto-cleanup expired cache entries every 5 minutes
setInterval(
  () => {
    weatherCache.clearExpired();
  },
  5 * 60 * 1000
);
