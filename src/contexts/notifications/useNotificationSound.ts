
import { useState, useEffect } from "react";

export const useNotificationSound = () => {
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Load sound preference from localStorage on initial load
  useEffect(() => {
    try {
      const savedSoundPreference = localStorage.getItem("notification_sound_enabled");
      if (savedSoundPreference !== null) {
        setSoundEnabled(savedSoundPreference === "true");
      }
    } catch (error) {
      console.error("Failed to load sound preference:", error);
    }
  }, []);

  // Save sound preference to localStorage when changed
  useEffect(() => {
    try {
      localStorage.setItem("notification_sound_enabled", soundEnabled.toString());
    } catch (error) {
      console.error("Failed to save sound preference:", error);
    }
  }, [soundEnabled]);

  return { soundEnabled, setSoundEnabled };
};
