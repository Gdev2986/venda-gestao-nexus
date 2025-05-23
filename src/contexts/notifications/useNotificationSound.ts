
import { useState, useEffect } from 'react';

export const useNotificationSound = () => {
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    try {
      const savedPreference = localStorage.getItem("notification-sound");
      return savedPreference !== "false"; // Default to true if not set
    } catch (error) {
      console.error("Failed to load notification sound preference:", error);
      return true;
    }
  });

  // Save preference when it changes
  useEffect(() => {
    try {
      localStorage.setItem("notification-sound", String(soundEnabled));
    } catch (error) {
      console.error("Failed to save notification sound preference:", error);
    }
  }, [soundEnabled]);

  return {
    soundEnabled,
    setSoundEnabled
  };
};
