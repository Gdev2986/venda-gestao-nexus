
import { PaymentStatus as EnumsPaymentStatus, PaymentType as EnumsPaymentType } from './enums';

export { EnumsPaymentStatus as PaymentStatus, EnumsPaymentType as PaymentType };

export interface PixKey {
  id: string;
  key: string;
  type: string;
  name: string;       // Required
  owner_name: string; // Required
  user_id: string;    // Required
  is_default?: boolean;
  is_active?: boolean;
  bank_name?: string;
  key_type?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Payment {
  id: string;
  client_id: string;
  amount: number;
  status: EnumsPaymentStatus;
  approved_by?: string;
  approved_at?: string;
  created_at: string;
  updated_at: string;
  receipt_url?: string;
  description?: string;
  rejection_reason: string | null;
  payment_type?: EnumsPaymentType;
  client?: {
    id: string;
    business_name: string;
    email?: string;
    phone?: string;
    balance?: number;
  };
  document_url?: string;
  client_name?: string;
  due_date?: string;
  pix_key?: PixKey;
  pix_key_id?: string;
  bank_info?: {
    bank_name?: string;
    account_number?: string;
    branch_number?: string;
    account_holder?: string;
  };
}

export interface PaymentRequest extends Payment {
  pix_key_id: string;
}

export type PaymentRequestStatus = EnumsPaymentStatus;

export type PixKeyType = 'CPF' | 'CNPJ' | 'EMAIL' | 'PHONE' | 'EVP';
