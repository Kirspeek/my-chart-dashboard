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
