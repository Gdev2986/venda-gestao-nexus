
import { supabase } from "@/integrations/supabase/client";
import { PixKey, UserSettings } from "@/types";

// Helper function to create default PixKey properties for new keys
export const createDefaultPixKeyProperties = (id: string, userId: string): PixKey => {
  return {
    id,
    user_id: userId,
    key_type: "",
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

export const saveSettings = async (settings: Partial<UserSettings>): Promise<{ success: boolean; error?: string }> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: "No authenticated user found" };
    }

    const { error } = await supabase
      .from('user_settings')
      .upsert({
        user_id: user.id,
        settings: settings
      });

    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    console.error("Error saving settings:", error);
    return { 
      success: false, 
      error: error?.message || "Failed to save settings" 
    };
  }
};

export const loadSettings = async (): Promise<UserSettings> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error("No authenticated user found");
    }

    const { data, error } = await supabase
      .from('user_settings')
      .select('settings')
      .eq('user_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "No rows returned" error
      throw error;
    }

    return data?.settings as UserSettings || getDefaultSettings();
  } catch (error: any) {
    console.error("Error loading settings:", error);
    return getDefaultSettings();
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
