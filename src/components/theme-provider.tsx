
"use client"

// Explicitly import React as a namespace to ensure consistent usage
import React from "react"

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

// Create context using the direct React reference
const ThemeProviderContext = React.createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "sigmapay-theme",
  ...props
}: ThemeProviderProps) {
  // Use direct React reference for useState to avoid dependency issues
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

  // Use direct React reference for useEffect
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

  // Use direct React reference for useMemo
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
  // Use direct React reference for useContext
  const context = React.useContext(ThemeProviderContext)

  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }

  return context
}
