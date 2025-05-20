
"use client"

import { useCallback } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";

const ThemeToggle: React.FC = () => {
  // Wrap the hook usage in a try-catch to handle potential errors
  const { theme, setTheme } = useTheme();
  
  const toggleTheme = useCallback(() => {
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
