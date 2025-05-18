
export type PixKeyType = "CPF" | "CNPJ" | "EMAIL" | "PHONE" | "RANDOM" | "EVP";

export interface PixKey {
  id: string;
  user_id: string;
  key: string;
  type: PixKeyType;
  name: string;
  is_default?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  cnpj: string;
  status: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  created_at: string;
  balance: number;
  partner_id?: string;
}

export enum PaymentStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  PAID = "PAID"
}

export interface PaymentRequest {
  id: string;
  client_id: string;
  amount: number;
  description: string;
  status: PaymentStatus | string;
  created_at: string;
  updated_at: string;
  approved_at?: string;
  approved_by?: string;
  receipt_url?: string;
  rejection_reason?: string;
  pix_key: PixKey;
  type: string;
}

export interface Payment {
  id: string;
  client_id: string;
  amount: number;
  description: string;
  status: PaymentStatus | string;
  created_at: string;
  updated_at: string;
  approved_at?: string;
  receipt_url?: string;
  type: string;
}
