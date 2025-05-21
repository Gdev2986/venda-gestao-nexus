
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

// Creating context with a default value to avoid null
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
  
  // Efeito para carregar o tema salvo
  React.useEffect(() => {
    try {
      const savedTheme = localStorage?.getItem(storageKey) as Theme | null;
      if (savedTheme) {
        setTheme(savedTheme);
      }
    } catch (error) {
      console.error("Failed to load theme preference:", error);
    }
  }, [storageKey]);
  
  // Efeito para atualizar classes do documento
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

  // Efeito para salvar tema no localStorage
  React.useEffect(() => {
    try {
      localStorage.setItem(storageKey, theme);
    } catch (error) {
      console.error("Failed to save theme preference:", error);
    }
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

// Ensure context is never null by providing default values
export const useTheme = (): ThemeProviderState => {
  const context = React.useContext(ThemeProviderContext);
  return context;
};
