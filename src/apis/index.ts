export { default as api } from "./api";
export * from "./constants";

type MapboxGeocodeResponse = {
  type: string;
  query: string[];
  features: Array<{ center: [number, number]; place_name: string }>;
};

const __geocodeCache = new Map<
  string,
  { ts: number; data: MapboxGeocodeResponse }
>();
const __GEOCODE_TTL_MS = 5 * 60 * 1000;

export const mapboxGeocode = async (query: string) => {
  const { API_ENDPOINTS, API_KEYS, MAPBOX_CONSTANTS } = await import(
    "./constants"
  );
  const key = query.trim().toLowerCase();
  const now = Date.now();
  const cached = __geocodeCache.get(key);
  if (cached && now - cached.ts < __GEOCODE_TTL_MS) {
    return cached.data;
  }
  const url = `${API_ENDPOINTS.MAPBOX.GEOCODING(query)}?access_token=${API_KEYS.MAPBOX}&limit=${MAPBOX_CONSTANTS.SEARCH_LIMIT}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Mapbox geocoding failed: ${res.status}`);
  const json = (await res.json()) as MapboxGeocodeResponse;
  __geocodeCache.set(key, { ts: now, data: json });
  return json;
};
