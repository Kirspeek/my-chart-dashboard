// API Constants and Configuration

// Base URLs
export const API_BASE_URLS = {
  WEATHER: "https://api.openweathermap.org/data/2.5",
  BANK_BIN: "https://api.apilayer.com/bincheck",
  LOGO_CLEARBIT: "https://logo.clearbit.com",
  ICONS_CDN: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons",
  SPOTIFY_WEB_API: "https://api.spotify.com/v1",
  SPOTIFY_EMBED: "https://open.spotify.com/embed",
  SPOTIFY_SDK: "https://sdk.scdn.co/spotify-player.js",
} as const;

// API Keys
export const API_KEYS = {
  WEATHER: process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY || "",
  BANK_BIN: "w3zpCvSQLybqm8M6WIIo6NrnhRMEBKxD",
  MAPBOX: process.env.NEXT_PUBLIC_MAPBOX_API_KEY || "",
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  // Weather API
  WEATHER: {
    CURRENT: "/weather",
    FORECAST: "/forecast",
    GEOCODING: "https://api.openweathermap.org/geo/1.0/direct",
  },

  // Bank BIN API
  BANK: {
    BIN_CHECK: (bin: string) => `${API_BASE_URLS.BANK_BIN}/${bin}`,
  },

  // Logo and Icon APIs
  ASSETS: {
    BANK_LOGO: (domain: string, size: number = 48) =>
      `${API_BASE_URLS.LOGO_CLEARBIT}/${domain}.com?size=${size}&format=png`,
    ICON: (iconName: string) => `${API_BASE_URLS.ICONS_CDN}/${iconName}.svg`,
  },

  // Mapbox API
  MAPBOX: {
    GEOCODING: (query: string) =>
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json`,
  },

  // Spotify internal API (music)
  SPOTIFY: {
    SEARCH: (q: string) => `/api/spotify/search?q=${encodeURIComponent(q)}`,
    TRACK: (id: string) => `/api/spotify/track?id=${encodeURIComponent(id)}`,
    ARTIST_TOP_TRACKS: (id: string) =>
      `/api/spotify/artist?id=${encodeURIComponent(id)}`,
    AUTH: {
      REFRESH: "/api/spotify/auth/refresh",
    },
    PLAYER: {
      TRANSFER: "/api/spotify/transfer",
      PLAY: (deviceId: string) =>
        `/api/spotify/play?deviceId=${encodeURIComponent(deviceId)}`,
      PAUSE: (deviceId?: string) =>
        `/api/spotify/pause${deviceId ? `?deviceId=${encodeURIComponent(deviceId)}` : ""}`,
    },
    SAVE: "/api/spotify/save",
  },

  // Spotify external endpoints (Web API)
  SPOTIFY_EXTERNAL: {
    me: {
      player: {
        base: () => `${API_BASE_URLS.SPOTIFY_WEB_API}/me/player`,
        play: (deviceId: string) =>
          `${API_BASE_URLS.SPOTIFY_WEB_API}/me/player/play?device_id=${encodeURIComponent(deviceId)}`,
        pause: (deviceId?: string) =>
          `${API_BASE_URLS.SPOTIFY_WEB_API}/me/player/pause${deviceId ? `?device_id=${encodeURIComponent(deviceId)}` : ""}`,
        transfer: () => `${API_BASE_URLS.SPOTIFY_WEB_API}/me/player`,
      },
      library: {
        saveTrack: (trackId: string) =>
          `${API_BASE_URLS.SPOTIFY_WEB_API}/me/tracks?ids=${encodeURIComponent(trackId)}`,
      },
    },
    tracks: (id: string) =>
      `${API_BASE_URLS.SPOTIFY_WEB_API}/tracks/${encodeURIComponent(id)}`,
    artists: {
      topTracks: (id: string, market = "US") =>
        `${API_BASE_URLS.SPOTIFY_WEB_API}/artists/${encodeURIComponent(id)}/top-tracks?market=${encodeURIComponent(market)}`,
    },
    albums: (id: string) =>
      `${API_BASE_URLS.SPOTIFY_WEB_API}/albums/${encodeURIComponent(id)}`,
    search: (q: string) =>
      `${API_BASE_URLS.SPOTIFY_WEB_API}/search?type=track,album,artist,playlist&limit=6&q=${encodeURIComponent(q)}`,
  },

  // Spotify embed and SDK
  SPOTIFY_EMBED: {
    track: (id: string) =>
      `${API_BASE_URLS.SPOTIFY_EMBED}/track/${encodeURIComponent(id)}`,
    album: (id: string) =>
      `${API_BASE_URLS.SPOTIFY_EMBED}/album/${encodeURIComponent(id)}`,
    artist: (id: string) =>
      `${API_BASE_URLS.SPOTIFY_EMBED}/artist/${encodeURIComponent(id)}`,
    sdkSrc: () => API_BASE_URLS.SPOTIFY_SDK,
  },
} as const;

// API Headers
export const API_HEADERS = {
  BANK_BIN: {
    apikey: API_KEYS.BANK_BIN,
  },
  WEATHER: {
    "Content-Type": "application/json",
  },
} as const;

// API Configuration
export const API_CONFIG = {
  TIMEOUT: 10000, // 10 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
  CACHE_DURATION: 10 * 60 * 1000, // 10 minutes
} as const;

// Bank-specific constants
export const BANK_CONSTANTS = {
  MIN_BIN_LENGTH: 6,
  DEBOUNCE_DELAY: 500, // milliseconds
  LOGO_SIZE: 48,
} as const;

// Weather-specific constants
export const WEATHER_CONSTANTS = {
  CACHE_DURATION: 10 * 60 * 1000, // 10 minutes
  PRELOAD_CITIES: ["London", "New York", "Tokyo", "Paris", "Sydney"],
} as const;

// Error messages
export const API_ERROR_MESSAGES = {
  NETWORK_ERROR: "Network error occurred",
  TIMEOUT_ERROR: "Request timed out",
  INVALID_RESPONSE: "Invalid response from server",
  RATE_LIMIT: "Rate limit exceeded",
  UNAUTHORIZED: "Unauthorized access",
  NOT_FOUND: "Resource not found",
  BANK_BIN_INVALID: "Invalid BIN number",
  WEATHER_CITY_NOT_FOUND: "City not found",
} as const;

// HTTP Status codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  RATE_LIMIT: 429,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
} as const;

export const MAPBOX_CONSTANTS = {
  SEARCH_LIMIT: 1,
} as const;
