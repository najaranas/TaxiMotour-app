import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { getLocales } from "expo-localization";
import en from "./utils/translation/en.json";
import ar from "./utils/translation/ar.json";
import fr from "./utils/translation/fr.json";

// Get device language for future use
const deviceLanguage = getLocales()[0]?.languageCode || "en";

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
const resources = {
  en: {
    translation: en,
  },
  ar: {
    translation: ar,
  },
  fr: {
    translation: fr,
  },
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: "ar", // language to use, more information here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
    fallbackLng: "en", // fallback language if translation is missing
    // you can use the i18n.changeLanguage function to change the language manually: https://www.i18next.com/overview/api#changelanguage
    // if you're using a language detector, do not define the lng option

    interpolation: {
      escapeValue: false, // react already safes from xss
    },

    // Add debug mode for development (you can set this to false in production)
    debug: __DEV__,

    // React options
    react: {
      useSuspense: false, // for React Native
    },
  });

// Export device language for potential future use
export { deviceLanguage };
export default i18n;
