
// Create a hook to easily manage notification preferences
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

export function useNotifications() {
  const [soundEnabled, setSoundEnabled] = useState<boolean>(
    localStorage.getItem("notification-sound") !== "false"
  );

  // Toggle sound notifications
  const toggleSound = () => {
    const newValue = !soundEnabled;
    setSoundEnabled(newValue);
    localStorage.setItem("notification-sound", String(newValue));
    
    toast({
      title: newValue ? "Som ativado" : "Som desativado",
      description: newValue ? 
        "Você receberá notificações sonoras" : 
        "Notificações sonoras foram desativadas",
      duration: 2000,
    });
  };
  
  return {
    soundEnabled,
    setSoundEnabled: toggleSound,
  };
}
