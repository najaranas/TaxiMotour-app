export type SupportedLanguage = "en" | "ar" | "fr";

export const SUPPORTED_LANGUAGES = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "ar", name: "Arabic", nativeName: "العربية" },
  { code: "fr", name: "French", nativeName: "Français" },
] as const;
