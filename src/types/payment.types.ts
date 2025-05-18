
import { PaymentStatus as PaymentStatusEnum, PaymentType } from "@/types/enums";

export type PixKeyType = 'CPF' | 'CNPJ' | 'EMAIL' | 'PHONE' | 'EVP' | 'RANDOM';

export { PaymentStatusEnum as PaymentStatus, PaymentType };

export interface PixKey {
  id: string;
  key: string;
  type: string;
  name: string;
  owner_name?: string;
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
  status: PaymentStatusEnum;
  created_at: string;
  updated_at: string;
  approved_at?: string;
  approved_by?: string | null;
  receipt_url?: string | null;
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

export interface Payment extends Omit<PaymentRequest, 'rejection_reason'> {
  rejection_reason: string | null;
  client_name?: string;
  pix_key?: PixKey;
}
