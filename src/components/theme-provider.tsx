
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
  // Safe access to localStorage with try/catch
  const getThemeFromStorage = React.useCallback((): Theme | null => {
    if (typeof window === "undefined") return null;
    try {
      const storedTheme = window.localStorage.getItem(storageKey);
      return (storedTheme as Theme) || null;
    } catch (e) {
      console.error("Error accessing localStorage:", e);
      return null;
    }
  }, [storageKey]);
  
  const [theme, setTheme] = React.useState<Theme>(
    () => getThemeFromStorage() || defaultTheme
  );

  const applyTheme = React.useCallback((newTheme: Theme) => {
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
  }, []);

  React.useEffect(() => {
    applyTheme(theme);
  }, [theme, applyTheme]);

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
  }, [theme, applyTheme]);

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
