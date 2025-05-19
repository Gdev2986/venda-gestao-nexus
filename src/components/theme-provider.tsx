
"use client";

import * as React from "react";

type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
};

const ThemeProviderContext = React.createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "sigmapay-theme",
  ...props
}: ThemeProviderProps) {
  // Use a lazy initializer function for useState to safely access localStorage
  const [theme, setTheme] = React.useState<Theme>(() => {
    if (typeof window !== "undefined") {
      try {
        const storedTheme = window.localStorage.getItem(storageKey);
        return storedTheme ? (storedTheme as Theme) : defaultTheme;
      } catch (error) {
        console.error("Error accessing localStorage:", error);
        return defaultTheme;
      }
    }
    return defaultTheme;
  });

  // Apply theme to document element
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    
    const root = window.document.documentElement;
    
    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  // Save theme to localStorage
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    
    try {
      window.localStorage.setItem(storageKey, theme);
    } catch (error) {
      console.error("Error writing to localStorage:", error);
    }
  }, [theme, storageKey]);

  const value = React.useMemo(
    () => ({
      theme,
      setTheme: (t: Theme) => {
        setTheme(t);
      },
    }),
    [theme]
  );

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = React.useContext(ThemeProviderContext);

  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
};
