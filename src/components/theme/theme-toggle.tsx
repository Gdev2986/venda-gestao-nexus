
"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/theme-provider"

const ThemeToggle: React.FC = () => {
  // Try-catch block to handle potential theme context errors
  try {
    const { theme, setTheme } = useTheme()
    
    const toggleTheme = React.useCallback(() => {
      setTheme(theme === "dark" ? "light" : "dark")
    }, [theme, setTheme])

    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleTheme}
        title={theme === "dark" ? "Mudar para modo claro" : "Mudar para modo escuro"}
      >
        {theme === "dark" ? (
          <Sun className="h-[1.2rem] w-[1.2rem] text-yellow-300" />
        ) : (
          <Moon className="h-[1.2rem] w-[1.2rem]" />
        )}
        <span className="sr-only">Alternar tema</span>
      </Button>
    )
  } catch (error) {
    console.error('Error rendering ThemeToggle:', error);
    // Fallback to a non-functional button that doesn't depend on theme context
    return (
      <Button
        variant="ghost"
        size="icon"
        title="Theme toggle (unavailable)"
        disabled
      >
        <Moon className="h-[1.2rem] w-[1.2rem]" />
        <span className="sr-only">Theme toggle unavailable</span>
      </Button>
    );
  }
}

export default ThemeToggle
