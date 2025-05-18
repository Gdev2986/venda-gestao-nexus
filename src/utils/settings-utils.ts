
import { PixKey } from "@/types";

export const createDefaultPixKeyProperties = (id: string, userId: string): PixKey => {
  return {
    id,
    key: "",
    type: "CPF",
    name: "Nova chave PIX",
    owner_name: "Nova chave PIX",
    user_id: userId, // Make sure user_id is included
    is_default: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    bank_name: "Banco"
  };
};

export const mapPixKeyFromDb = (data: any): PixKey => {
  return {
    id: data.id,
    key: data.key,
    type: data.type,
    name: data.name,
    owner_name: data.owner_name || data.name,
    user_id: data.user_id, // Make sure user_id is included
    is_default: data.is_default || false,
    created_at: data.created_at,
    updated_at: data.updated_at,
    bank_name: data.bank_name || "Banco"
  };
};

export const normalizePixKeyFormat = (pixKey: PixKey): PixKey => {
  return {
    id: pixKey.id,
    key: pixKey.key,
    type: pixKey.type,
    name: pixKey.name,
    owner_name: pixKey.owner_name || pixKey.name,
    user_id: pixKey.user_id, // Make sure user_id is included
    is_default: pixKey.is_default,
    created_at: pixKey.created_at,
    updated_at: pixKey.updated_at,
    bank_name: pixKey.bank_name || "Banco"
  };
};
