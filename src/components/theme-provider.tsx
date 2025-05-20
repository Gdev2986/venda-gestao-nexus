
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
  const [theme, setTheme] = React.useState<Theme>(defaultTheme);
  
  // Initialize theme from localStorage on mount
  React.useEffect(() => {
    const savedTheme = localStorage.getItem(storageKey);
    if (savedTheme && ["dark", "light", "system"].includes(savedTheme)) {
      setTheme(savedTheme as Theme);
    }
  }, [storageKey]);

  // Update document classes when theme changes
  React.useEffect(() => {
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
    localStorage.setItem(storageKey, theme);
  }, [theme, storageKey]);

  const value = React.useMemo(
    () => ({
      theme,
      setTheme: (t: Theme) => setTheme(t),
    }),
    [theme]
  );

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = (): ThemeProviderState => {
  const context = React.useContext(ThemeProviderContext);

  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
};
