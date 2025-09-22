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
    TWITTER: "https://x.com/anasnajar_dev",
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

export const pricingService = {
  PRICING_CONFIG: {
    BASE_FARE: 1.5, // TND
    COST_PER_KM: 0.35, // TND per km
    COST_PER_MINUTE: 0.1, // TND per minute
    NIGHT_SURCHARGE: 1.25, // 25% surcharge
  },

  calculateRidePrice(distanceInMeters: number, durationInSeconds: number) {
    const km = distanceInMeters / 1000;
    const durationInMinutes = durationInSeconds / 60;
    const { BASE_FARE, COST_PER_KM, COST_PER_MINUTE, NIGHT_SURCHARGE } =
      this.PRICING_CONFIG;

    let price =
      BASE_FARE + km * COST_PER_KM + durationInMinutes * COST_PER_MINUTE;

    if (this.isNightTime()) {
      price *= NIGHT_SURCHARGE;
    }

    return String(price.toFixed(3)); // keep 3 decimals like taxis
  },

  isNightTime(): boolean {
    const now = new Date();
    const hour = now.getHours();
    return hour >= 22 || hour < 6;
  },
} as const;
