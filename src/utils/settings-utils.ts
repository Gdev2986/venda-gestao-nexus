
import { PixKey, UserSettings } from "@/types";

// Helper function to create default PixKey properties for new keys
export const createDefaultPixKeyProperties = (id: string, user_id: string): PixKey => {
  return {
    id,
    user_id,
    key_type: "",
    type: "CPF",
    key: "",
    owner_name: "",
    name: "",
    isDefault: false,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    bank_name: "",
  };
};

// Add these missing functions for loading and saving settings
export const loadSettings = async (): Promise<UserSettings> => {
  // In a real app, this would fetch from an API or local storage
  return {
    name: "User Name",
    email: "user@example.com",
    language: "pt-BR",
    timezone: "brt",
    theme: "system",
    notifications: {
      marketing: true,
      security: true
    },
    display: {
      showBalance: true,
      showNotifications: true
    }
  };
};

export const saveSettings = async (settings: Partial<UserSettings>): Promise<boolean> => {
  // In a real app, this would send to an API or save to local storage
  console.log("Settings saved:", settings);
  return true;
};
