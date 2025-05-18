
export enum PaymentStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  PAID = "PAID"
}

export enum PaymentType {
  PIX = "PIX",
  TED = "TED",
  BOLETO = "BOLETO"
}

export type PixKeyType = 'CPF' | 'CNPJ' | 'EMAIL' | 'PHONE' | 'EVP' | 'RANDOM';

export interface PixKey {
  id: string;
  key: string;
  type: string;
  name: string;
  owner_name: string;
  is_default?: boolean;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
  bank_name?: string;
  key_type?: string;
  is_active?: boolean;
}

export interface PaymentRequest {
  id: string;
  client_id: string;
  amount: number;
  status: PaymentStatus;
  created_at: string;
  updated_at: string;
  approved_at?: string;
  approved_by?: string | null;
  receipt_url?: string;
  description: string;
  rejection_reason?: string | null;
  payment_type?: PaymentType;
  pix_key_id?: string;
  client?: {
    id: string;
    business_name: string;
    email?: string;
  };
  pix_key?: PixKey;
  bank_info?: {
    bank_name?: string;
    account_number?: string;
    branch_number?: string;
    account_holder?: string;
  };
  document_url?: string;
  due_date?: string;
  type?: string;
}

export interface Payment {
  id: string;
  created_at: string;
  updated_at: string;
  amount: number;
  status: PaymentStatus | string;
  client_id: string;
  approved_at?: string; 
  receipt_url?: string;
  client_name?: string;
  rejection_reason: string;
  payment_type?: PaymentType | string;
  bank_info?: {
    bank_name?: string;
    account_number?: string;
    branch_number?: string;
    account_holder?: string;
  };
  document_url?: string;
  due_date?: string;
  pix_key?: PixKey;
  approved_by?: string | null;
  description?: string;
  client?: any;
  type?: string;
}
