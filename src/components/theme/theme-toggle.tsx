
"use client"

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";

const ThemeToggle: React.FC = () => {
  // Safely access the theme hook
  let themeContext = { theme: "light", setTheme: (_: string) => {} };
  
  try {
    themeContext = useTheme();
  } catch (error) {
    console.error("Error accessing theme context:", error);
    // Return null or fallback UI if theme context can't be accessed
    return null;
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
};

export default ThemeToggle;
