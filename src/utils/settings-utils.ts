
import { PixKey } from "@/types";

/**
 * Create default properties for a new PixKey
 */
export const createDefaultPixKeyProperties = (
  id: string, 
  userId: string
): PixKey => {
  return {
    id,
    user_id: userId,
    key_type: "CPF",
    type: "CPF",
    key: "",
    owner_name: "",
    name: "",
    isDefault: false, 
    is_active: true,
    bank_name: "",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
};

/**
 * Maps PixKey from database to frontend format
 */
export const mapPixKeyFromDb = (dbKey: any): PixKey => {
  return {
    id: dbKey.id,
    user_id: dbKey.user_id,
    key_type: dbKey.type,
    type: dbKey.type,
    key: dbKey.key,
    owner_name: dbKey.name,
    name: dbKey.name,
    isDefault: dbKey.is_default || false, // Map from is_default (DB) to isDefault (frontend)
    is_active: true,
    bank_name: "Banco", // Default value since it's not in the database
    created_at: dbKey.created_at,
    updated_at: dbKey.updated_at
  };
};
