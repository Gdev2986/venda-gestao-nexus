
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
  const getThemeFromStorage = (): Theme | undefined => {
    if (typeof window === "undefined") return undefined;
    try {
      return localStorage.getItem(storageKey) as Theme || undefined;
    } catch (e) {
      console.error("Error accessing localStorage:", e);
      return undefined;
    }
  };
  
  const [theme, setTheme] = React.useState<Theme>(
    () => getThemeFromStorage() || defaultTheme
  );

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

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(storageKey, theme);
      } catch (error) {
        console.error("Error writing to localStorage:", error);
      }
    }
  }, [theme, storageKey]);

  React.useEffect(() => {
    if (theme !== "system" || typeof window === "undefined") return;
    
    function handleChange() {
      const root = window.document.documentElement;
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
      
      root.classList.remove("light", "dark");
      root.classList.add(systemTheme);
    }
    
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", handleChange);
    
    return () => mediaQuery.removeEventListener("change", handleChange);
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
}

export const useTheme = (): ThemeProviderState => {
  const context = React.useContext(ThemeProviderContext);

  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
};
