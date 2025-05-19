
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
  const [theme, setTheme] = React.useState<Theme>(defaultTheme);
  
  // Load theme from localStorage on component mount
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    
    try {
      const savedTheme = localStorage.getItem(storageKey);
      if (savedTheme && ["dark", "light", "system"].includes(savedTheme as Theme)) {
        setTheme(savedTheme as Theme);
      }
    } catch (error) {
      console.error("Error accessing localStorage:", error);
    }
  }, [storageKey]);

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

  // Save theme to localStorage when it changes
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    
    try {
      localStorage.setItem(storageKey, theme);
    } catch (error) {
      console.error("Error writing to localStorage:", error);
    }
  }, [theme, storageKey]);

  const value = React.useMemo(
    () => ({
      theme,
      setTheme: (newTheme: Theme) => {
        setTheme(newTheme);
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

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
