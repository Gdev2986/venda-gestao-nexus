import { PixKey } from "@/types";

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
