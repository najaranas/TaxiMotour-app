import StorageManager from "@/utils/storage";

/**
 * Initialize theme from storage
 * Returns: "light" | "dark" (default: "light")
 */
export const initializeTheme = (): "light" | "dark" => {
  const savedTheme = StorageManager.retrieveThemePreference();
  if (savedTheme && (savedTheme === "light" || savedTheme === "dark")) {
    return savedTheme;
  }
  return "light";
};
