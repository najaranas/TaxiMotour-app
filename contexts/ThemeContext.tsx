import { THEMES } from "@/constants/theme";
import { initializeTheme } from "@/utils/themeUtils";
import { ThemeContextType } from "@/types/Types";
import StorageManager from "@/utils/storage";
import { createContext, useContext, useState, ReactNode } from "react";

const ThemeContext = createContext<ThemeContextType>({
  themeName: "light",
  theme: THEMES.light,
  setTheme: () => {},
});

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [themeName, setThemeName] = useState<"light" | "dark">(
    initializeTheme()
  );

  const setTheme = (newTheme: "light" | "dark") => {
    StorageManager.storeThemePreference(newTheme);
    setThemeName(newTheme);
  };

  const themeObject = THEMES[themeName];

  return (
    <ThemeContext.Provider
      value={{
        themeName,
        theme: themeObject,
        setTheme,
      }}>
      {children}
    </ThemeContext.Provider>
  );
};

export { ThemeContext };
