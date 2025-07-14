// API Configuration and Endpoints
export const API_CONFIG = {
  // Weather APIs
  WEATHER: {
    GEOCODING: "https://geocoding-api.open-meteo.com/v1/search",
    FORECAST: "https://api.open-meteo.com/v1/forecast",
  },
  // Add more API configurations here as needed
} as const;

// API Response Types
export interface GeocodingResponse {
  results?: Array<{
    latitude: number;
    longitude: number;
    name: string;
    country: string;
  }>;
}

export interface WeatherForecastResponse {
  daily?: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    weathercode: number[];
  };
  current_weather?: {
    temperature: number;
    weathercode: number;
  };
}

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
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Geocoding API error: ${response.status}`);
      }

      const data: GeocodingResponse = await response.json();

      if (data.results && data.results.length > 0) {
        return {
          lat: data.results[0].latitude,
          lon: data.results[0].longitude,
        };
      }

      return null;
    } catch (error) {
      console.error("Geocoding error:", error);
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
      const response = await fetch(url);

      if (!response.ok) {
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
    const coords = await this.geocodeCity(city);
    if (!coords) {
      return { forecast: null, coords: null };
    }

    const forecast = await this.getWeatherForecast(coords.lat, coords.lon);
    return { forecast, coords };
  }
}

// Utility functions for API responses
export const WeatherUtils = {
  /**
   * Convert weather code to description
   */
  getWeatherDescription(code: number): string {
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
  },

  /**
   * Get weather icon based on description
   */
  getWeatherIcon(desc: string): string {
    if (/clear/i.test(desc)) return "☀️";
    if (/cloud/i.test(desc)) return "🌤️";
    if (/rain/i.test(desc)) return "🌧️";
    if (/storm|thunder/i.test(desc)) return "⛈️";
    if (/snow/i.test(desc)) return "❄️";
    return "🌡️";
  },
};

// Error handling utilities
export class APIError extends Error {
  constructor(
    message: string,
    public status?: number,
    public endpoint?: string
  ) {
    super(message);
    this.name = "APIError";
  }
}

// Request utilities
export const RequestUtils = {
  /**
   * Create a fetch request with common options
   */
  async fetchWithTimeout(
    url: string,
    options: RequestInit = {},
    timeout = 10000
  ): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === "AbortError") {
        throw new APIError("Request timeout", undefined, url);
      }
      throw error;
    }
  },

  /**
   * Retry a fetch request with exponential backoff
   */
  async fetchWithRetry(
    url: string,
    options: RequestInit = {},
    maxRetries = 3,
    baseDelay = 1000
  ): Promise<Response> {
    let lastError: Error;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await this.fetchWithTimeout(url, options);
      } catch (error) {
        lastError = error as Error;

        if (attempt === maxRetries) {
          break;
        }

        // Wait before retrying with exponential backoff
        const delay = baseDelay * Math.pow(2, attempt);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    throw lastError!;
  },
};
