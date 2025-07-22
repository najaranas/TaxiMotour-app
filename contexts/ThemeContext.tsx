import { THEMES } from "@/constants/theme";
import { ThemeContextType } from "@/types/Types";
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
  const [themeName, setThemeName] = useState<"light" | "dark">("light");

  const setTheme = (newTheme: "light" | "dark") => {
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
