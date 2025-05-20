
import { useState, useEffect } from 'react';

const SOUND_PREF_KEY = 'sigmapay-notifications-sound';

export const useSoundPreference = (): [boolean, (enabled: boolean) => void] => {
  // Get initial value from localStorage or default to true
  const getInitialState = (): boolean => {
    try {
      const savedPreference = localStorage.getItem(SOUND_PREF_KEY);
      return savedPreference !== null ? JSON.parse(savedPreference) : true;
    } catch (error) {
      console.error('Failed to read sound preference from localStorage:', error);
      return true;
    }
  };

  const [soundEnabled, setSoundEnabled] = useState<boolean>(getInitialState);

  // Save to localStorage whenever the preference changes
  useEffect(() => {
    try {
      localStorage.setItem(SOUND_PREF_KEY, JSON.stringify(soundEnabled));
    } catch (error) {
      console.error('Failed to save sound preference to localStorage:', error);
    }
  }, [soundEnabled]);

  return [soundEnabled, setSoundEnabled];
};
