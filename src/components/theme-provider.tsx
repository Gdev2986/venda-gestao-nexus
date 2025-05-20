
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
  // Use a safe initialization approach for useState
  const navigate = useNavigate();
  
  // Safe access to React hooks with error handling
  let themeHook: [Theme, React.Dispatch<React.SetStateAction<Theme>>] | null = null;
  
  try {
    themeHook = React.useState<Theme>(
      () => {
        try {
          if (typeof window === "undefined") return defaultTheme;
          
          const storedTheme = window.localStorage.getItem(storageKey);
          return (storedTheme as Theme) || defaultTheme;
        } catch (e) {
          console.error("Error accessing localStorage:", e);
          return defaultTheme;
        }
      }
    );
  } catch (error) {
    console.error("Critical error initializing theme:", error);
    // Redirect to login on React initialization failure
    setTimeout(() => {
      try {
        navigate(PATHS.LOGIN);
      } catch (navError) {
        console.error("Navigation failed:", navError);
        // Last resort: direct window location change
        window.location.href = PATHS.LOGIN;
      }
    }, 100);
    
    // Return fallback UI with children to prevent blank screen
    return <>{children}</>;
  }
  
  // If theme hook creation failed but didn't throw, provide fallback
  if (!themeHook) {
    console.error("Theme hook initialization failed without error");
    return <>{children}</>;
  }
  
  const [theme, setTheme] = themeHook;

  const applyTheme = React.useCallback((newTheme: Theme) => {
    try {
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
    } catch (error) {
      console.error("Error applying theme:", error);
    }
  }, []);

  // Apply theme effect
  React.useEffect(() => {
    try {
      applyTheme(theme);
    } catch (error) {
      console.error("Error in theme effect:", error);
    }
  }, [theme, applyTheme]);

  // Save theme to localStorage
  React.useEffect(() => {
    try {
      if (typeof window === "undefined") return;
      window.localStorage.setItem(storageKey, theme);
    } catch (error) {
      console.error("Error writing to localStorage:", error);
    }
  }, [theme, storageKey]);

  // Handle system theme changes
  React.useEffect(() => {
    try {
      if (theme !== "system" || typeof window === "undefined") return;
      
      function handleChange() {
        applyTheme("system");
      }
      
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener("change", handleChange);
        return () => mediaQuery.removeEventListener("change", handleChange);
      } else {
        mediaQuery.addListener(handleChange);
        return () => mediaQuery.removeListener(handleChange);
      }
    } catch (error) {
      console.error("Error in system theme effect:", error);
    }
  }, [theme, applyTheme]);

  const value = React.useMemo(
    () => ({
      theme,
      setTheme: (t: Theme) => {
        try {
          setTheme(t);
        } catch (error) {
          console.error("Error setting theme:", error);
        }
      },
    }),
    [theme, setTheme]
  );

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = (): ThemeProviderState => {
  try {
    const context = React.useContext(ThemeProviderContext);

    if (context === undefined) {
      console.warn("useTheme must be used within a ThemeProvider");
      return initialState;
    }

    return context;
  } catch (error) {
    console.error("Error in useTheme hook:", error);
    return initialState;
  }
};
