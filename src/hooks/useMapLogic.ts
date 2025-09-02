import { useRef, useEffect, useState, useCallback } from "react";
import type { MapState, MapActions } from "../../interfaces/widgets";
import { DEFAULT_CENTER, SEARCH_DEBOUNCE } from "@/data";
import { mapboxGeocode } from "@/apis";

export function useMapLogic(
  onMarkerChange?: (pos: { lat: number; lon: number }) => void,
  userLocation?: [number, number]
): MapState & MapActions {
  const [search, setSearch] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchResult, setSearchResult] = useState<[number, number] | null>(
    null
  );
  const [internalLocation, setInternalLocation] = useState<
    [number, number] | null
  >(userLocation || null);

  const searchTimeout = useRef<NodeJS.Timeout | null>(null);
  const lastSearched = useRef("");

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setInternalLocation([pos.coords.longitude, pos.coords.latitude]);
        },
        () => setInternalLocation(DEFAULT_CENTER),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      setInternalLocation(DEFAULT_CENTER);
    }
  }, []);

  useEffect(() => {
    if (
      userLocation &&
      (internalLocation === null ||
        userLocation[0] !== internalLocation[0] ||
        userLocation[1] !== internalLocation[1])
    ) {
      setInternalLocation(userLocation);
    }
  }, [userLocation, internalLocation]);

  useEffect(() => {
    if (!search.trim()) {
      setSearchResult(null);
      return;
    }
    setLoading(true);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(async () => {
      lastSearched.current = search;
      try {
        const data = await mapboxGeocode(search);
        if (
          data.features &&
          data.features.length > 0 &&
          lastSearched.current === search
        ) {
          const [lng, lat] = data.features[0].center;
          setSearchResult([lng, lat]);
        } else {
          setSearchResult(null);
        }
      } finally {
        setLoading(false);
      }
    }, SEARCH_DEBOUNCE);
    return () => {
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
    };
  }, [search]);

  const handleSearch = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!search.trim()) return;
      setLoading(true);
      try {
        const data = await mapboxGeocode(search);
        if (data.features && data.features.length > 0) {
          const [lng, lat] = data.features[0].center;
          setInternalLocation([lng, lat]);
          if (onMarkerChange) onMarkerChange({ lat, lon: lng });
        }
      } finally {
        setLoading(false);
      }
    },
    [search, onMarkerChange]
  );

  return {
    search,
    searchFocused,
    loading,
    searchResult,
    internalLocation,
    setSearch,
    setSearchFocused,
    setLoading,
    setSearchResult,
    setInternalLocation,
    handleSearch,
  };
}
