
"use client"

import React from "react"
import { createContext, useContext, useEffect, useState } from "react"

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

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "sigmapay-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      try {
        const storedTheme = localStorage.getItem(storageKey)
        return storedTheme ? (storedTheme as Theme) : defaultTheme
      } catch (error) {
        console.warn("Error reading theme from localStorage:", error)
        return defaultTheme
      }
    }
    return defaultTheme
  })

  useEffect(() => {
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

  useEffect(() => {
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
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = (): ThemeProviderState => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }

  return context
}
