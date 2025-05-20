
"use client"

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";

const ThemeToggle: React.FC = () => {
  try {
    // Safely access the theme hook
    let themeContext = { theme: "light", setTheme: (_: string) => {} };
    
    try {
      themeContext = useTheme();
    } catch (error) {
      console.error("Error accessing theme context:", error);
      // Continue with default theme values
    }
    
    const { theme, setTheme } = themeContext;
    
    const toggleTheme = React.useCallback(() => {
      try {
        setTheme(theme === "dark" ? "light" : "dark");
      } catch (error) {
        console.error("Error toggling theme:", error);
      }
    }, [theme, setTheme]);

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
    );
  } catch (error) {
    console.error("Critical error in ThemeToggle:", error);
    // Return minimal button that doesn't do anything to prevent crashes
    return (
      <Button
        variant="ghost"
        size="icon"
        disabled
        title="Alternador de tema (indisponível)"
      >
        <Moon className="h-[1.2rem] w-[1.2rem]" />
        <span className="sr-only">Alternador de tema indisponível</span>
      </Button>
    );
  }
};

export default ThemeToggle;
