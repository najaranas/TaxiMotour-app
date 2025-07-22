import { MMKV } from "react-native-mmkv";

// Create MMKV instance
const storage = new MMKV();

// Storage keys
export const STORAGE_KEYS = {
  THEME: "theme",
  LANGUAGE: "language",
} as const;

// Storage utility functions
const StorageManager = {
  // Generic storage operations
  storeString: (key: string, value: string): void => {
    storage.set(key, value);
  },

  retrieveString: (key: string): string | undefined => {
    return storage.getString(key);
  },

  storeBoolean: (key: string, value: boolean): void => {
    storage.set(key, value);
  },

  retrieveBoolean: (key: string): boolean | undefined => {
    return storage.getBoolean(key);
  },

  storeNumber: (key: string, value: number): void => {
    storage.set(key, value);
  },

  retrieveNumber: (key: string): number | undefined => {
    return storage.getNumber(key);
  },

  storeObject: <T>(key: string, value: T): void => {
    try {
      const jsonString = JSON.stringify(value);
      storage.set(key, jsonString);
    } catch (error) {
      console.error(`Error storing object for key ${key}:`, error);
    }
  },

  retrieveObject: <T>(key: string): T | null => {
    const jsonString = storage.getString(key);
    if (jsonString) {
      try {
        return JSON.parse(jsonString) as T;
      } catch (error) {
        console.error(`Error retrieving object for key ${key}:`, error);
        return null;
      }
    }
    return null;
  },

  removeFromStorage: (key: string): void => {
    storage.delete(key);
  },

  clearAllStorage: (): void => {
    storage.clearAll();
  },

  getAllStorageKeys: (): string[] => {
    return storage.getAllKeys();
  },

  checkStorageKeyExists: (key: string): boolean => {
    return storage.contains(key);
  },

  // Specific app storage methods

  // Theme storage operations
  storeThemePreference: (theme: "light" | "dark"): void => {
    storage.set(STORAGE_KEYS.THEME, theme);
  },

  retrieveThemePreference: (): "light" | "dark" | null => {
    return storage.getString(STORAGE_KEYS.THEME) as "light" | "dark" | null;
  },

  // Language storage operations
  storeLanguagePreference: (language: string): void => {
    storage.set(STORAGE_KEYS.LANGUAGE, language);
  },

  retrieveLanguagePreference: (): string | undefined => {
    return storage.getString(STORAGE_KEYS.LANGUAGE);
  },
};

export default StorageManager;
