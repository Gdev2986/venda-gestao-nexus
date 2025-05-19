
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
  // Use React namespace explicitly for hooks
  const [theme, setTheme] = React.useState<Theme>(defaultTheme);
  
  // Initialize theme from localStorage on mount
  React.useEffect(() => {
    try {
      const savedTheme = localStorage.getItem(storageKey);
      if (savedTheme && ["dark", "light", "system"].includes(savedTheme)) {
        setTheme(savedTheme as Theme);
      }
    } catch (error) {
      console.error("Error reading from localStorage:", error);
    }
  }, [storageKey]);

  // Update root classes when theme changes
  React.useEffect(() => {
    try {
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
    } catch (error) {
      console.error("Error updating root classes:", error);
    }
  }, [theme]);

  // Save theme to localStorage
  React.useEffect(() => {
    try {
      localStorage.setItem(storageKey, theme);
    } catch (error) {
      console.error("Error writing to localStorage:", error);
    }
  }, [theme, storageKey]);

  // Listen for system theme changes
  React.useEffect(() => {
    if (theme !== "system") return;
    
    try {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      
      const handleChange = () => {
        const root = window.document.documentElement;
        const systemTheme = mediaQuery.matches ? "dark" : "light";
        
        root.classList.remove("light", "dark");
        root.classList.add(systemTheme);
      };
      
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    } catch (error) {
      console.error("Error setting up media query listener:", error);
    }
  }, [theme]);

  // Create the context value
  const value = React.useMemo(() => ({
    theme,
    setTheme: (newTheme: Theme) => setTheme(newTheme),
  }), [theme]);

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
