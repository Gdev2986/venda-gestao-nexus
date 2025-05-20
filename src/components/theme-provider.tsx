
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

// Create the context with the initial state
const ThemeProviderContext = React.createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "sigmapay-theme",
  ...props
}: ThemeProviderProps) {
  // Use React.useState instead of useState
  const [theme, setTheme] = React.useState<Theme>(defaultTheme)

  // Load stored theme
  React.useEffect(() => {
    try {
      const storedTheme = localStorage.getItem(storageKey) as Theme | null
      
      if (storedTheme) {
        setTheme(storedTheme)
      }
    } catch (error) {
      console.warn("Error reading theme from localStorage:", error)
    }
  }, [storageKey])

  // Apply theme to document
  React.useEffect(() => {
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

  // Store theme in localStorage
  React.useEffect(() => {
    try {
      localStorage.setItem(storageKey, theme)
    } catch (error) {
      console.error("Failed to save theme preference:", error)
    }
  }, [theme, storageKey])

  const value = React.useMemo(
    () => ({
      theme,
      setTheme,
    }),
    [theme]
  )

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export function useTheme(): ThemeProviderState {
  const context = React.useContext(ThemeProviderContext)

  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }

  return context
}
