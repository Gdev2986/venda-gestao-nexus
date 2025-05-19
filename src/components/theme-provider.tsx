
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
  const [theme, setTheme] = React.useState<Theme>(
    () => {
      if (typeof window === "undefined") return defaultTheme;
      
      try {
        const storedTheme = window.localStorage.getItem(storageKey);
        return (storedTheme && ["dark", "light", "system"].includes(storedTheme as Theme)) 
          ? (storedTheme as Theme) 
          : defaultTheme;
      } catch (error) {
        console.error("Error reading from localStorage:", error);
        return defaultTheme;
      }
    }
  );

  React.useEffect(() => {
    const root = typeof window !== "undefined" ? window.document.documentElement : null;
    
    if (!root) return;
    
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
