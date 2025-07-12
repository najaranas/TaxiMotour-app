import { APP_CONFIG, ERROR_MESSAGES } from "@/constants/app";
import { MapTilerGeocodingResponse } from "@/types/Types";

// Geocoding Service
export const geocodingService = {
  async fetchSuggestions(
    query: string
  ): Promise<MapTilerGeocodingResponse | null> {
    try {
      const url = `${APP_CONFIG.MAPTILER_GEOCODING_URL}/${encodeURIComponent(
        query
      )}.json`;
      const params = new URLSearchParams({
        key: process.env.EXPO_PUBLIC_MAPTILER_MAP_API || "",
        language: "fr",
        bbox: APP_CONFIG.MAP_BOUNDING_BOX,
        limit: APP_CONFIG.SEARCH_LIMIT.toString(),
      });

      const response = await fetch(`${url}?${params}`);
      console.log(`${url}?${params}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Geocoding error:", error);
      throw new Error(ERROR_MESSAGES.GEOCODING_FAILED);
    }
  },
};

// Route Service
export const routeService = {
  async fetchRoute(
    startCoordinates: [number, number],
    endCoordinates: [number, number]
  ): Promise<any> {
    try {
      const apiKey = process.env.EXPO_PUBLIC_OPENROUTE_SERVICE_API;
      if (!apiKey) {
        console.warn("OpenRoute API key not found. Using fallback route.");
        return routeService.createFallbackRoute(
          startCoordinates,
          endCoordinates
        );
      }

      console.log("coordinates:", [startCoordinates, endCoordinates]);
      const response = await fetch(APP_CONFIG.OPENROUTE_SERVICE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: apiKey,
        },
        body: JSON.stringify({
          coordinates: [startCoordinates, endCoordinates],
        }),
      });

      console.log("response", response);
      if (!response.ok) {
        if (response.status === 401) {
          console.warn("OpenRoute API key invalid. Using fallback route.");
          return routeService.createFallbackRoute(
            startCoordinates,
            endCoordinates
          );
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("data", data);
      return data;
    } catch (error) {
      console.error("Route fetching error:", error);
      console.warn("Using fallback route due to API error.");
      return routeService.createFallbackRoute(startCoordinates, endCoordinates);
    }
  },

  // Fallback route creation when API is unavailable
  createFallbackRoute(
    startCoordinates: [number, number],
    endCoordinates: [number, number]
  ): any {
    return {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: {
            summary: {
              distance: 0,
              duration: 0,
            },
          },
          geometry: {
            type: "LineString",
            coordinates: [startCoordinates, endCoordinates],
          },
        },
      ],
    };
  },
};

// API Utilities
export const apiUtils = {
  handleApiError: (
    error: any,
    fallbackMessage: string = ERROR_MESSAGES.NETWORK_ERROR
  ) => {
    console.error("API Error:", error);
    return error.message || fallbackMessage;
  },

  validateCoordinates: (lat: number | null, lon: number | null): boolean => {
    return (
      lat !== null &&
      lon !== null &&
      lat >= -90 &&
      lat <= 90 &&
      lon >= -180 &&
      lon <= 180
    );
  },
};
