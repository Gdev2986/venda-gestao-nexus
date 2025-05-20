
import { useState, useEffect } from "react";

export const useSoundPreference = (): [boolean, (enabled: boolean) => void] => {
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  
  // Load sound preference from localStorage on mount
  useEffect(() => {
    try {
      const savedPreference = localStorage.getItem("notification-sound");
      setSoundEnabled(savedPreference !== "false");
    } catch (error) {
      console.error("Failed to load notification sound preference:", error);
    }
  }, []);

  // Save sound preference when it changes
  useEffect(() => {
    try {
      localStorage.setItem("notification-sound", String(soundEnabled));
    } catch (error) {
      console.error("Failed to save notification sound preference:", error);
    }
  }, [soundEnabled]);

  return [soundEnabled, setSoundEnabled];
};
