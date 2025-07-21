// Taximotour Theme - Simplified
import { ThemeType } from "@/types/Types";

export const COLORS = {
  // Main Colors
  primary: "#10252A", // Main dark color
  secondary: "#FFB218", // Secondary yellow/orange

  // Basic Colors
  white: "#FFFFFF",
  black: "#000000",

  // Route colors
  routeBlue: "#4285F4", // Main route color
  routeBlueLight: "#5B9BF8", // Lighter route color

  // Gray Scale
  gray: {
    100: "#F0F0F0", // Light gray
    200: "#E0E0E0", // Slightly darker
    300: "#C2C2C2",
    400: "#A3A3A3",
    500: "#858585",
    600: "#666666",
    700: "#4D4D4D",
    800: "#333333",
    900: "#1A1A1A", // Very dark gray
  },

  // Status Colors
  success: "#22C55E",
  danger: "#EF4444",
  warning: "#F59E0B",
  info: "#3B82F6",

  // Custom selection color
  selection: "rgba(12, 129, 224, 0.2)",
  transparent_gray: "rgba(71, 72, 73, 0.29)",
};

// Font Families
export const FONTS = {
  regular: "Roboto-Regular",
  bold: "Roboto-Bold",
  medium: "Roboto-Medium",
  light: "Roboto-Light",
  thin: "Roboto-Thin",
  extraBold: "Roboto-ExtraBold",
};

// App Themes
const THEMES: Record<"light" | "dark", ThemeType> = {
  // Light Mode
  light: {
    // Backgrounds
    background: COLORS.white,
    surface: COLORS.gray[100],
    card: COLORS.white,

    // Text
    text: {
      primary: COLORS.black,
      secondary: COLORS.gray[600],
      muted: COLORS.gray[500],
    },

    // Border Radius
    borderRadius: {
      none: 0,
      small: 6,
      medium: 10,
      large: 15,
      pill: 30,
      circle: 9999,
    },
    // Border Width - Optimized for light mode (thinner borders look better)

    borderWidth: {
      none: 0,
      thin: 1,
      regular: 2,
      thick: 3,
      extraThick: 4,
    },
    // Buttons
    button: {
      primary: COLORS.secondary, // #FFB218
      secondary: COLORS.primary, // #10252A
      text: COLORS.white,
    },

    // Inputs
    input: {
      background: COLORS.white,
      border: COLORS.gray[300],
      text: COLORS.black,
      placeholder: COLORS.gray[400],
    },

    // Status
    status: {
      success: COLORS.success,
      error: COLORS.danger,
      warning: COLORS.warning,
      info: COLORS.info,
    },
  },

  // Dark Mode
  dark: {
    // Backgrounds
    background: "#121212",
    surface: COLORS.gray[800],
    card: COLORS.gray[700],

    // Text
    text: {
      primary: "#DDDDDD",
      secondary: COLORS.gray[300],
      muted: COLORS.gray[500],
    },

    // Border Radius
    borderRadius: {
      none: 0,
      small: 6,
      medium: 10,
      large: 15,
      pill: 30,
      circle: 9999,
    },
    // Border Width - Optimized for dark mode (thicker borders for better visibility)
    borderWidth: {
      none: 0,
      thin: 0.2,
      regular: 0.5,
      thick: 1,
      extraThick: 1.5,
    },

    // Buttons
    button: {
      primary: COLORS.secondary, // #FFB218
      secondary: COLORS.primary, // #10252A
      text: COLORS.white,
    },

    // Inputs
    input: {
      background: COLORS.gray[800],
      border: COLORS.gray[600],
      text: COLORS.white,
      placeholder: COLORS.gray[400],
    },

    // Status
    status: {
      success: COLORS.success,
      error: COLORS.danger,
      warning: COLORS.warning,
      info: COLORS.info,
    },
  },
};

// Default to dark theme (your current theme)
const THEME = THEMES.light;

// Export borderRadius and borderWidth for direct import if needed
export const BORDER_RADIUS = THEME.borderRadius;
export const BORDER_WIDTH = THEME.borderWidth;

export { THEMES };
export default THEME;
