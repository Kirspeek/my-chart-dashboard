export const API_CONFIG = {
  WEATHER: {
    GEOCODING: "https://geocoding-api.open-meteo.com/v1/search",
    FORECAST: "https://api.open-meteo.com/v1/forecast",
  },
} as const;

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

export interface CachedWeatherData {
  forecast: import("./widgets").ForecastDay[];
  coords: { lat: number; lon: number } | null;
  timestamp: number;
  loading: boolean;
}
