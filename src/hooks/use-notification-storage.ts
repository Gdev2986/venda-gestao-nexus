
import { useState, useEffect } from 'react';

/**
 * Hook to manage notification sound preferences in localStorage
 */
export const useNotificationStorage = (initialState: boolean = true) => {
  const [soundEnabled, setSoundEnabled] = useState<boolean>(initialState);

  // Load sound preference from localStorage on initial load
  useEffect(() => {
    const savedSoundPreference = localStorage.getItem("notification_sound_enabled");
    if (savedSoundPreference !== null) {
      setSoundEnabled(savedSoundPreference === "true");
    }
  }, []);

  // Save sound preference to localStorage when changed
  useEffect(() => {
    localStorage.setItem("notification_sound_enabled", soundEnabled.toString());
  }, [soundEnabled]);

  return { soundEnabled, setSoundEnabled };
};
