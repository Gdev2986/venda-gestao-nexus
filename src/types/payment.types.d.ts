
import { PaymentStatus, PaymentType } from "./enums";

export type PaymentRequestStatus = 
  | 'PENDING'
  | 'APPROVED'
  | 'REJECTED'
  | 'PAID'
  | 'PROCESSING'
  | PaymentStatus.PENDING
  | PaymentStatus.APPROVED
  | PaymentStatus.REJECTED
  | PaymentStatus.PAID
  | PaymentStatus.PROCESSING;

export interface PixKeyInfo {
  id: string;
  key: string;
  type: string;
  owner_name: string;
  key_type?: string;
}

export interface ClientInfo {
  id: string;
  business_name: string;
  [key: string]: any;
}

export interface BankInfo {
  bank_name?: string;
  bank_code?: string;
  agency?: string;
  account?: string;
  account_type?: string;
  document?: string;
  owner_name?: string;
}

export interface PaymentData {
  id: string;
  amount: number;
  description: string; // Changed from optional to required to match hooks/payments/payment.types
  status: PaymentRequestStatus;
  pix_key_id?: string;
  created_at: string;
  updated_at?: string;
  approved_at?: string;
  approved_by?: string;
  receipt_url?: string;
  rejection_reason?: string;
  client_id: string;
  payment_type: PaymentType;
  pix_key?: PixKeyInfo;
  client?: ClientInfo;
  bank_info?: BankInfo;
  document_url?: string;
  due_date?: string;
}

// Make PaymentRequest an alias of PaymentData for backward compatibility
export type PaymentRequest = PaymentData;

// Define Client interface for compatibility with other components
export interface Client {
  id: string;
  business_name: string;
  document?: string;
  email?: string;
  phone?: string;
  status?: string;
  balance?: number;
  partner_id?: string;
  created_at?: string;
  updated_at?: string;
  contact_name?: string; // Made optional to match Client type
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  fee_plan_id?: string;
  user_id?: string;
}

export type PixKeyType = 'CPF' | 'CNPJ' | 'EMAIL' | 'PHONE' | 'EVP';

export interface PixKey {
  id: string;
  key: string;
  key_type?: PixKeyType | string;
  type?: string;
  client_id?: string;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
  name?: string;
  owner_name?: string;
  isDefault?: boolean;
  is_active?: boolean;
  bank_name?: string;
}
