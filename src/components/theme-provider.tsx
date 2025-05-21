
"use client"

import * as React from "react"

type Theme = "dark" | "light" | "system"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
}

// Create context with proper React instance
const ThemeProviderContext = React.createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "sigmapay-theme",
  ...props
}: ThemeProviderProps) {
  // Defensive check for React availability
  if (typeof React === 'undefined' || React === null || typeof React.useState !== 'function') {
    console.error('React is not available in ThemeProvider - this may indicate multiple React instances');
    // Return fallback UI instead of throwing an error
    return (
      <div className="p-4 text-red-500 border border-red-500 rounded">
        Error: React initialization failed. Check console for details.
        {children}
      </div>
    );
  }

  // Using React.useState explicitly to avoid any potential issues
  const [theme, setTheme] = React.useState<Theme>(() => {
    if (typeof window === "undefined") return defaultTheme;
    
    try {
      const storedTheme = localStorage.getItem(storageKey)
      return storedTheme ? (storedTheme as Theme) : defaultTheme
    } catch (error) {
      console.warn("Error reading theme from localStorage:", error)
      return defaultTheme
    }
  })

  React.useEffect(() => {
    if (typeof window === "undefined") return
    
    const root = window.document.documentElement

    root.classList.remove("light", "dark")

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      root.classList.add(systemTheme)
    } else {
      root.classList.add(theme)
    }
  }, [theme])

  React.useEffect(() => {
    if (typeof window === "undefined") return
    
    try {
      localStorage.setItem(storageKey, theme)
    } catch (error) {
      console.error("Failed to save theme preference:", error)
    }
  }, [theme, storageKey])

  const value = React.useMemo(
    () => ({
      theme,
      setTheme: (newTheme: Theme) => {
        setTheme(newTheme)
      },
    }),
    [theme]
  )

  return (
    <ThemeProviderContext.Provider value={value} {...props}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = (): ThemeProviderState => {
  // Defensive check before accessing context
  if (typeof React === 'undefined' || React === null || typeof React.useContext !== 'function') {
    console.error('React is not available in useTheme - this may indicate multiple React instances');
    // Return a fallback state object
    return initialState;
  }
  
  const context = React.useContext(ThemeProviderContext)

  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }

  return context
}
