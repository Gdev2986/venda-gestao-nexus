
"use client"

import * as React from "react";
import { useNavigate } from "react-router-dom";
import { PATHS } from "@/routes/paths";

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
  try {
    // Safe access to localStorage with try/catch
    const getThemeFromStorage = (): Theme | null => {
      if (typeof window === "undefined") return null;
      try {
        const storedTheme = window.localStorage.getItem(storageKey);
        return (storedTheme as Theme) || null;
      } catch (e) {
        console.error("Error accessing localStorage:", e);
        return null;
      }
    };
    
    const [theme, setTheme] = React.useState<Theme>(
      () => getThemeFromStorage() || defaultTheme
    );

    const applyTheme = (newTheme: Theme) => {
      const root = window.document.documentElement;
      
      root.classList.remove("light", "dark");

      if (newTheme === "system") {
        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";
        root.classList.add(systemTheme);
      } else {
        root.classList.add(newTheme);
      }
    };

    React.useEffect(() => {
      applyTheme(theme);
    }, [theme]);

    React.useEffect(() => {
      if (typeof window === "undefined") return;
      
      try {
        window.localStorage.setItem(storageKey, theme);
      } catch (error) {
        console.error("Error writing to localStorage:", error);
      }
    }, [theme, storageKey]);

    React.useEffect(() => {
      if (theme !== "system" || typeof window === "undefined") return;
      
      function handleChange() {
        applyTheme("system");
      }
      
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      
      // Use the correct event listener based on browser support
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener("change", handleChange);
        return () => mediaQuery.removeEventListener("change", handleChange);
      } else {
        // Fallback for older browsers
        mediaQuery.addListener(handleChange);
        return () => mediaQuery.removeListener(handleChange);
      }
    }, [theme]);

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
  } catch (error) {
    console.error("Error in ThemeProvider:", error);
    // If there's an error during ThemeProvider initialization, render children without the provider
    return <>{children}</>;
  }
}

export const useTheme = (): ThemeProviderState => {
  try {
    const context = React.useContext(ThemeProviderContext);

    if (context === undefined) {
      console.warn("useTheme must be used within a ThemeProvider");
      // Return a fallback instead of throwing
      return initialState;
    }

    return context;
  } catch (error) {
    console.error("Error in useTheme hook:", error);
    // Return the initial state as fallback
    return initialState;
  }
};
