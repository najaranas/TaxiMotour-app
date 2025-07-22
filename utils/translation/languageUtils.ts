import i18n from "../../i18n";
import StorageManager from "../storage";

export type SupportedLanguage = "en" | "ar" | "fr";

export const SUPPORTED_LANGUAGES = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "ar", name: "Arabic", nativeName: "العربية" },
  { code: "fr", name: "French", nativeName: "Français" },
] as const;

/**
 * Change the app language and persist it to storage
 */
export const changeLanguage = async (languageCode: SupportedLanguage) => {
  try {
    await i18n.changeLanguage(languageCode);
    StorageManager.storeLanguagePreference(languageCode);
    return true;
  } catch (error) {
    console.error("Failed to change language:", error);
    return false;
  }
};

/**
 * Get the current language code
 */
export const getCurrentLanguage = (): SupportedLanguage => {
  return i18n.language as SupportedLanguage;
};

/**
 * Get the current language display name
 */
export const getCurrentLanguageName = (): string => {
  const currentLang = getCurrentLanguage();
  const language = SUPPORTED_LANGUAGES.find(
    (lang) => lang.code === currentLang
  );
  return language?.nativeName || "English";
};

/**
 * Initialize language from storage
 */
export const initializeLanguage = async () => {
  try {
    const savedLanguage = StorageManager.retrieveLanguagePreference();
    if (
      savedLanguage &&
      SUPPORTED_LANGUAGES.some((lang) => lang.code === savedLanguage)
    ) {
      await i18n.changeLanguage(savedLanguage);
    }
  } catch (error) {
    console.error("Failed to initialize language:", error);
  }
};

/**
 * Check if the current language is RTL
 */
export const isRTL = (): boolean => {
  const currentLang = getCurrentLanguage();
  return currentLang === "ar";
};
