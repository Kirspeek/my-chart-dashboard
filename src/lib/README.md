# API Configuration & Hooks

This directory contains centralized API configuration and custom hooks for the dashboard application.

## API Configuration (`api.ts`)

### Features

- **Centralized API endpoints**: All API URLs are defined in one place
- **Type-safe responses**: TypeScript interfaces for all API responses
- **Error handling**: Custom error classes and utilities
- **Request utilities**: Timeout, retry, and caching utilities

### Available APIs

#### Weather API

- **Geocoding**: Convert city names to coordinates
- **Forecast**: Get weather forecast data
- **Utilities**: Weather code conversion and icon mapping

### Usage Example

```typescript
import { WeatherAPI, WeatherUtils } from "@/lib/api";

// Get weather data for a city
const { forecast, coords } = await WeatherAPI.getCityWeather("London");

// Convert weather code to description
const description = WeatherUtils.getWeatherDescription(weatherCode);
```

## Weather Cache Management (`weatherCache.ts`)

### Features

- **Instant weather display**: Preloaded weather data for instant city switching
- **Intelligent caching**: 10-minute cache with automatic cleanup
- **Background preloading**: Load weather data for multiple cities in parallel
- **Cache statistics**: Monitor cache status and performance

### Usage Example

```typescript
import { weatherCache } from "@/lib/weatherCache";

// Preload weather for multiple cities
await weatherCache.preloadCities(["London", "New York", "Tokyo"]);

// Get weather data (instant if cached)
const { forecast, coords, loading } = await weatherCache.getWeather("London");

// Check cache status
const isCached = weatherCache.isCached("London");
const isPreloading = weatherCache.isPreloading("London");
```

## Custom Hooks (`hooks/`)

### Available Hooks

#### `useWeather(city: string)`

Enhanced weather hook with caching and preloading support.

```typescript
import { useWeather } from '@/hooks';

function WeatherComponent() {
  const {
    forecast,
    loading,
    error,
    refetch,
    isCached,
    isPreloading
  } = useWeather('London');

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {isCached && <span>⚡ Instant</span>}
      {/* Render forecast data */}
    </div>
  );
}
```

#### `useWeatherPreload(cities: string[], options)`

Hook for preloading weather data for multiple cities.

```typescript
import { useWeatherPreload } from '@/hooks';

function Dashboard() {
  const cities = ["London", "New York", "Tokyo", "Paris"];

  const {
    preloadCities,
    isCached,
    isPreloading,
    getStats,
    clearCache
  } = useWeatherPreload(cities, {
    autoPreload: true,    // Auto-preload when cities change
    preloadOnMount: true  // Preload on component mount
  });

  const stats = getStats();
  console.log(`Cached: ${stats.cachedCities}, Preloading: ${stats.preloadingCities}`);

  return <div>{/* Dashboard content */}</div>;
}
```

#### `useApi<T>(apiFunction, options)`

Generic hook for any API call with advanced features:

- **Caching**: Automatic caching with configurable TTL
- **Retry logic**: Exponential backoff retry
- **Request cancellation**: Abort previous requests
- **Loading states**: Built-in loading and error states

```typescript
import { useApi } from '@/hooks';
import { WeatherAPI } from '@/lib/api';

function WeatherComponent() {
  const { data, loading, error, execute } = useApi(
    () => WeatherAPI.getCityWeather('London'),
    {
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retryCount: 3,
      onSuccess: (data) => console.log('Weather loaded:', data),
      onError: (error) => console.error('Weather error:', error),
    }
  );

  return <div>{/* Render data */}</div>;
}
```

#### `useWeatherApi(city: string)`

Pre-configured hook for weather data with optimal settings.

### Hook Features

#### Caching

- Automatic caching with configurable cache time
- Cache invalidation on component unmount
- Memory-efficient cache storage
- **Weather-specific caching**: 10-minute cache with instant city switching

#### Error Handling

- Automatic error state management
- Retry logic with exponential backoff
- Request timeout handling

#### Performance

- Request cancellation for stale requests
- Debounced API calls
- Optimized re-renders
- **Background preloading**: Load weather data before user needs it

## Weather Preloading System

### How It Works

1. **Initial Load**: When the dashboard loads, weather data for all available cities is preloaded in the background
2. **Instant Switching**: When users change timezones/cities, weather displays immediately from cache
3. **Background Refresh**: Cache is automatically refreshed every 10 minutes
4. **Smart Loading**: Only loads cities that aren't already cached

### Benefits

- **Zero loading time** when switching between cities
- **Better user experience** with instant weather updates
- **Reduced API calls** through intelligent caching
- **Background processing** doesn't block the UI

### Implementation Example

```typescript
// In your main dashboard component
const cityMap = {
  "America/New_York": "New York",
  "Europe/London": "London",
  "Europe/Rome": "Rome",
  "Europe/Kyiv": "Kyiv",
};

const allCities = Object.values(cityMap);

function Dashboard() {
  // Preload all cities on mount
  useWeatherPreload(allCities, {
    autoPreload: true,
    preloadOnMount: true,
  });

  return (
    <div>
      <WeatherWidget city={selectedCity} />
      <WeatherCacheStatus cities={allCities} />
    </div>
  );
}
```

## Adding New APIs

### 1. Add API Configuration

```typescript
// In api.ts
export const API_CONFIG = {
  WEATHER: {
    GEOCODING: "https://geocoding-api.open-meteo.com/v1/search",
    FORECAST: "https://api.open-meteo.com/v1/forecast",
  },
  // Add your new API here
  NEW_API: {
    BASE_URL: "https://api.example.com",
    ENDPOINTS: {
      DATA: "/data",
      USERS: "/users",
    },
  },
} as const;
```

### 2. Add Response Types

```typescript
export interface NewApiResponse {
  data: any[];
  total: number;
}
```

### 3. Add API Functions

```typescript
export class NewAPI {
  static async getData(): Promise<NewApiResponse | null> {
    try {
      const response = await fetch(`${API_CONFIG.NEW_API.BASE_URL}/data`);
      if (!response.ok) throw new Error(`API error: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error("API error:", error);
      return null;
    }
  }
}
```

### 4. Create Custom Hook (Optional)

```typescript
// In hooks/useNewApi.ts
import { useApi } from "./useApi";
import { NewAPI } from "../lib/api";

export function useNewApi() {
  return useApi(() => NewAPI.getData(), {
    cacheTime: 5 * 60 * 1000, // 5 minutes
    retryCount: 2,
  });
}
```

## Best Practices

1. **Always use the centralized API configuration** for all external API calls
2. **Use TypeScript interfaces** for all API responses
3. **Implement proper error handling** with try-catch blocks
4. **Use the custom hooks** for data fetching in components
5. **Configure appropriate cache times** based on data freshness requirements
6. **Handle loading and error states** in your components
7. **Use request cancellation** for components that unmount during API calls
8. **Preload weather data** for cities that users might switch to
9. **Monitor cache performance** using the provided statistics

## Error Handling

The API configuration includes comprehensive error handling:

- **APIError class**: Custom error class with status and endpoint information
- **RequestUtils**: Utilities for timeout and retry logic
- **Automatic retry**: Exponential backoff for failed requests
- **Graceful degradation**: Fallback values when APIs are unavailable

## Performance Considerations

- **Caching**: Reduces unnecessary API calls
- **Request cancellation**: Prevents memory leaks
- **Debouncing**: Prevents rapid successive calls
- **Lazy loading**: Load data only when needed
- **Background preloading**: Load data before user needs it
- **Cache cleanup**: Automatic removal of expired cache entries
