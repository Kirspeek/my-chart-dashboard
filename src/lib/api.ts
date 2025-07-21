import {
  GeocodingResponse,
  WeatherForecastResponse,
} from "../../interfaces/api";
import { API_CONFIG } from "../config/api";
import { RequestUtils } from "../utils/requestUtils";

// Re-export for backward compatibility
export type { WeatherForecastResponse };

// API Functions
export class WeatherAPI {
  /**
   * Geocode a city name to get coordinates
   */
  static async geocodeCity(
    city: string
  ): Promise<{ lat: number; lon: number } | null> {
    try {
      const url = `${API_CONFIG.WEATHER.GEOCODING}?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;

      const response = await RequestUtils.fetchWithRetry(url);

      if (!response.ok) {
        console.error(
          `Geocoding API error: ${response.status} ${response.statusText}`
        );
        throw new Error(`Geocoding API error: ${response.status}`);
      }

      const data: GeocodingResponse = await response.json();

      if (data.results && data.results.length > 0) {
        return {
          lat: data.results[0].latitude,
          lon: data.results[0].longitude,
        };
      }

      console.warn(`No geocoding results found for city: ${city}`);
      return null;
    } catch (error) {
      console.error("Geocoding error:", error);

      // Return fallback coordinates for common cities
      const fallbackCoords = this.getFallbackCoords(city);
      if (fallbackCoords) {
        console.log(`Using fallback coordinates for ${city}:`, fallbackCoords);
        return fallbackCoords;
      }

      return null;
    }
  }

  /**
   * Get weather forecast for coordinates
   */
  static async getWeatherForecast(
    lat: number,
    lon: number
  ): Promise<WeatherForecastResponse | null> {
    try {
      const url = `${API_CONFIG.WEATHER.FORECAST}?latitude=${lat}&longitude=${lon}&current_weather=true&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto`;

      const response = await RequestUtils.fetchWithRetry(url);

      if (!response.ok) {
        console.error(
          `Weather API error: ${response.status} ${response.statusText}`
        );
        throw new Error(`Weather API error: ${response.status}`);
      }

      const data: WeatherForecastResponse = await response.json();
      return data;
    } catch (error) {
      console.error("Weather forecast error:", error);
      return null;
    }
  }

  /**
   * Get complete weather data for a city
   */
  static async getCityWeather(city: string): Promise<{
    forecast: WeatherForecastResponse | null;
    coords: { lat: number; lon: number } | null;
  }> {
    try {
      const coords = await this.geocodeCity(city);
      if (!coords) {
        console.warn(`No coordinates found for ${city}, using mock data`);
        return this.getMockWeatherData(city);
      }

      const forecast = await this.getWeatherForecast(coords.lat, coords.lon);
      if (!forecast) {
        console.warn(`Weather forecast failed for ${city}, using mock data`);
        return this.getMockWeatherData(city);
      }

      return { forecast, coords };
    } catch (error) {
      console.warn(`Weather API failed for ${city}, using mock data:`, error);
      return this.getMockWeatherData(city);
    }
  }

  /**
   * Get mock weather data as fallback
   */
  static getMockWeatherData(city: string): {
    forecast: WeatherForecastResponse;
    coords: { lat: number; lon: number } | null;
  } {
    const coords = this.getFallbackCoords(city);
    const now = new Date();

    // Generate 5 days of mock weather data
    const time: string[] = [];
    const tempMax: number[] = [];
    const tempMin: number[] = [];
    const weatherCodes: number[] = [];

    for (let i = 0; i < 5; i++) {
      const date = new Date(now);
      date.setDate(now.getDate() + i);
      time.push(date.toISOString().split("T")[0]);

      // Generate realistic temperatures based on season
      const month = date.getMonth();
      const isSummer = month >= 5 && month <= 8;
      const baseTemp = isSummer ? 25 : 15;
      const variation = Math.random() * 10 - 5;

      tempMax.push(Math.round(baseTemp + variation + 5));
      tempMin.push(Math.round(baseTemp + variation - 5));

      // Generate weather codes (mostly clear/partly cloudy)
      const codes = [0, 1, 2, 3, 45, 61, 80];
      weatherCodes.push(codes[Math.floor(Math.random() * codes.length)]);
    }

    return {
      forecast: {
        daily: {
          time,
          temperature_2m_max: tempMax,
          temperature_2m_min: tempMin,
          weathercode: weatherCodes,
        },
        current_weather: {
          temperature: tempMax[0],
          weathercode: weatherCodes[0],
        },
      },
      coords,
    };
  }

  /**
   * Get fallback coordinates for common cities
   */
  private static getFallbackCoords(
    city: string
  ): { lat: number; lon: number } | null {
    const cityMap: Record<string, { lat: number; lon: number }> = {
      "new york": { lat: 40.7128, lon: -74.006 },
      london: { lat: 51.5074, lon: -0.1278 },
      rome: { lat: 41.9028, lon: 12.4964 },
      kyiv: { lat: 50.4501, lon: 30.5234 },
      amsterdam: { lat: 52.3676, lon: 4.9041 },
      paris: { lat: 48.8566, lon: 2.3522 },
      berlin: { lat: 52.52, lon: 13.405 },
      madrid: { lat: 40.4168, lon: -3.7038 },
      moscow: { lat: 55.7558, lon: 37.6176 },
      tokyo: { lat: 35.6762, lon: 139.6503 },
      sydney: { lat: -33.8688, lon: 151.2093 },
      toronto: { lat: 43.6532, lon: -79.3832 },
      chicago: { lat: 41.8781, lon: -87.6298 },
      "los angeles": { lat: 34.0522, lon: -118.2437 },
      miami: { lat: 25.7617, lon: -80.1918 },
    };

    const normalizedCity = city.toLowerCase().trim();
    return cityMap[normalizedCity] || null;
  }
}
