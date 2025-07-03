// Taximotour Theme - Simplified
export const COLORS = {
  // Main Colors
  primary: "#10252A", // Main dark color
  secondary: "#FFB218", // Secondary yellow/orange

  // Basic Colors
  white: "#FFFFFF",
  black: "#000000",

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
const THEMES = {
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
    background: COLORS.primary, // #10252A
    surface: COLORS.gray[800],
    card: COLORS.gray[700],

    // Text
    text: {
      primary: COLORS.white,
      secondary: COLORS.gray[300],
      muted: COLORS.gray[500],
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

export { THEMES };
export default THEME;
