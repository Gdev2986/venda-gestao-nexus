
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

// Create context with default values
const ThemeProviderContext = React.createContext<ThemeProviderState>({
  theme: "system",
  setTheme: () => null,
});

// Custom hook to safely access localStorage
const useLocalStorage = (key: string, defaultValue: string): [string, (value: string) => void] => {
  // Create a ref to track if component is mounted
  const isMounted = React.useRef(false);
  
  // Initialize state with a function to safely access localStorage
  const [value, setValue] = React.useState<string>(() => {
    if (typeof window === "undefined") return defaultValue;
    
    try {
      const item = window.localStorage.getItem(key);
      return item || defaultValue;
    } catch (error) {
      console.error("Error reading from localStorage:", error);
      return defaultValue;
    }
  });
  
  // Effect to update localStorage when value changes
  React.useEffect(() => {
    // Skip initial render
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }
    
    try {
      window.localStorage.setItem(key, value);
    } catch (error) {
      console.error("Error writing to localStorage:", error);
    }
  }, [key, value]);
  
  return [value, setValue];
};

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "sigmapay-theme",
  ...props
}: ThemeProviderProps) {
  // Use our custom hook for localStorage
  const [theme, setThemeValue] = useLocalStorage(storageKey, defaultTheme);
  
  // Validate that theme is a valid Theme type
  const validTheme = (theme === "dark" || theme === "light" || theme === "system") 
    ? theme as Theme 
    : defaultTheme;
  
  // Handle theme changes
  const setTheme = React.useCallback((theme: Theme) => {
    setThemeValue(theme);
  }, [setThemeValue]);

  // Apply theme to document element
  React.useEffect(() => {
    const root = window.document.documentElement;
    
    root.classList.remove("light", "dark");

    if (validTheme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
      root.classList.add(systemTheme);
    } else {
      root.classList.add(validTheme);
    }
  }, [validTheme]);

  // Listen for system theme changes
  React.useEffect(() => {
    if (validTheme !== "system") return;
    
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    
    const handleChange = () => {
      const root = window.document.documentElement;
      const systemTheme = mediaQuery.matches ? "dark" : "light";
      
      root.classList.remove("light", "dark");
      root.classList.add(systemTheme);
    };
    
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [validTheme]);

  const value = React.useMemo(
    () => ({
      theme: validTheme,
      setTheme,
    }),
    [validTheme, setTheme]
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
