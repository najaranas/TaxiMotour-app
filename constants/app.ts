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
  APP_NAME: "TaxiMotour",
  APP_VERSION: "1.0.0",
  CREATOR_NAME: "Anas Najar",
  SOCIAL_LINKS: {
    LINKEDIN: "https://www.linkedin.com/in/anasnajar",
    INSTAGRAM: "https://www.instagram.com/anas__najjar",
    TWITTER: "https://x.com/AnasnajarTn",
  },
  // Home Navigation Menu Items (Drawer)
  DRAWER_MENU_ITEMS: [
    {
      id: "history",
      title: "Trip History",
      action: "trip_history",
      navigation: "/(tabs)/RidesHistory",
    },
    {
      id: "about",
      title: "About App",
      action: "about_app",
      navigation: "/(drawer)/About",
    },
    {
      id: "rate",
      title: "Rate App",
      action: "rate_app",
      navigation: "/(tabs)/RidesHistory",
    },
    {
      id: "share",
      title: "Share App",
      action: "share_app",
      navigation: "/(tabs)/RidesHistory",
    },
    {
      id: "developer",
      title: "About Developer",
      action: "about_developer",
      navigation: "/(tabs)/RidesHistory",
    },
  ],
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
