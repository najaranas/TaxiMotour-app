// App Configuration Constants
export const APP_CONFIG = {
  // API Endpoints
  MAPTILER_GEOCODING_URL: "https://api.maptiler.com/geocoding",
  OPENROUTE_SERVICE_URL:
    "https://api.openrouteservice.org/v2/directions/driving-car/geojson",

  // Map Configurationa
  DEFAULT_COORDINATES: [10.1819, 36.8065], // Tunis, Tunisia (longitude, latitude)
  MAP_BOUNDING_BOX: "7.5,30.0,12.0,38.0", // Tunisia bounding box
  SEARCH_LIMIT: 5,

  // UI Configuration
  ANIMATION_DURATION: 300,
  BOTTOM_SHEET_SNAP_POINTS: ["25%", "100%"],

  // User Information
  DEFAULT_PHONE_NUMBER: "+216 93 772 115",
  APP_VERSION: "1.0.0",
  CREATOR_NAME: "Anas Najar",

  // Menu Items
  MENU_ITEMS: [
    {
      id: "history",
      title: "Trip History",
      action: "trip_history",
    },
    {
      id: "about",
      title: "About App",
      action: "about_app",
    },
    {
      id: "safety",
      title: "Safety Center",
      action: "safety_center",
    },
    {
      id: "settings",
      title: "Settings",
      action: "settings",
    },
  ],
} as const;

// Route Configuration
export const ROUTE_CONFIG = {
  PROFILE: "/(tabs)/profile",
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  ROUTE_FETCH_FAILED: "Failed to fetch route",
  GEOCODING_FAILED: "Failed to fetch location suggestions",
  NETWORK_ERROR: "Network error occurred",
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  LOCATION_SELECTED: "Location selected successfully",
  ROUTE_CALCULATED: "Route calculated successfully",
} as const;
