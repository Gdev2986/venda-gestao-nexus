
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { UserSettings } from "@/types";

// Default settings to use when no settings are found
const defaultSettings: UserSettings = {
  name: "",
  email: "",
  language: "pt-BR",
  timezone: "America/Sao_Paulo",
  theme: "light",
  notifications: {
    marketing: true,
    security: true,
  },
  display: {
    showBalance: true,
    showNotifications: true,
  }
};

/**
 * Load user settings from local storage or API
 */
export const loadSettings = async (user: User | null): Promise<UserSettings> => {
  if (!user) return defaultSettings;

  try {
    // In a real implementation, this would fetch from a user_settings table
    // Since user_settings doesn't exist in the database schema, we'll use local storage for now
    const savedSettings = localStorage.getItem(`user_settings_${user.id}`);
    if (savedSettings) {
      return JSON.parse(savedSettings) as UserSettings;
    }
    
    // Initialize with default settings
    return {
      ...defaultSettings,
      name: user.user_metadata?.name || "",
      email: user.email || "",
    };
  } catch (error) {
    console.error("Error loading settings:", error);
    return defaultSettings;
  }
};

/**
 * Save user settings to local storage or API
 */
export const saveSettings = async (user: User | null, settings: UserSettings): Promise<boolean> => {
  if (!user) return false;

  try {
    // In a real implementation, this would save to a user_settings table
    // Since user_settings doesn't exist in the database schema, we'll use local storage for now
    localStorage.setItem(`user_settings_${user.id}`, JSON.stringify(settings));
    return true;
  } catch (error) {
    console.error("Error saving settings:", error);
    return false;
  }
};
