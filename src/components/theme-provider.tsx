
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
  storageKey = "ui-theme",
  ...props
}: ThemeProviderProps) {
  // Initialize state with a function to properly handle browser environment
  const [theme, setTheme] = React.useState<Theme>(() => {
    // For safety, check if running in browser environment
    if (typeof window !== "undefined") {
      try {
        const storedTheme = localStorage.getItem(storageKey);
        if (storedTheme && ["dark", "light", "system"].includes(storedTheme as Theme)) {
          return storedTheme as Theme;
        }
      } catch (error) {
        console.error("Error accessing localStorage:", error);
      }
    }
    return defaultTheme;
  });

  // Apply theme to document root element
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    
    const root = document.documentElement;
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

  // Create the context value with memoization
  const value = React.useMemo(
    () => ({
      theme,
      setTheme: (newTheme: Theme) => {
        if (typeof window !== "undefined") {
          try {
            localStorage.setItem(storageKey, newTheme);
          } catch (error) {
            console.error("Error writing to localStorage:", error);
          }
        }
        setTheme(newTheme);
      },
    }),
    [theme, storageKey]
  );

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = React.useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
