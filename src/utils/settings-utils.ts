
import { supabase } from "@/integrations/supabase/client";
import { UserSettings } from "@/types";

export const createDefaultPixKeyProperties = (id: string, userId: string) => {
  return {
    id,
    user_id: userId,
    key_type: "CPF",
    type: "CPF",
    key: "",
    owner_name: "",
    name: "",
    isDefault: false,
    is_default: false,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    bank_name: "",
  };
};

export const saveSettings = async (settings: UserSettings): Promise<{ success: boolean; error?: string }> => {
  try {
    const { data } = await supabase.auth.getUser();
    const user = data?.user;
    
    if (!user) {
      return { success: false, error: "No authenticated user found" };
    }

    // Store settings in local storage since the user_settings table might not exist
    localStorage.setItem(`user_settings_${user.id}`, JSON.stringify(settings));
    return { success: true };
  } catch (error: any) {
    console.error("Error saving settings:", error);
    return { 
      success: false, 
      error: error?.message || "Failed to save settings" 
    };
  }
};

export const loadSettings = async (): Promise<{ settings?: UserSettings; error?: string }> => {
  try {
    const { data } = await supabase.auth.getUser();
    const user = data?.user;
    
    if (!user) {
      return { error: "No authenticated user found" };
    }

    // Try to load from localStorage
    const savedSettings = localStorage.getItem(`user_settings_${user.id}`);
    if (savedSettings) {
      return { settings: JSON.parse(savedSettings) as UserSettings };
    }

    return { 
      settings: getDefaultSettings()
    };
  } catch (error: any) {
    console.error("Error loading settings:", error);
    return { 
      settings: getDefaultSettings(),
      error: error?.message || "Failed to load settings" 
    };
  }
};

const getDefaultSettings = (): UserSettings => ({
  name: "",
  email: "",
  language: "pt-BR",
  timezone: "America/Sao_Paulo",
  theme: "system",
  notifications: {
    marketing: true,
    security: true,
  },
  display: {
    showBalance: true,
    showNotifications: true,
  }
});
