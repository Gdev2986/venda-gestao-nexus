
import { PaymentStatus, PaymentType } from "./enums";

export type PaymentRequestStatus = 
  | 'PENDING'
  | 'APPROVED'
  | 'REJECTED'
  | 'PAID'
  | 'PROCESSING'
  | 'PENDENTE'
  | 'APROVADO'
  | 'RECUSADO'
  | 'PAGO'
  | 'EM_PROCESSAMENTO'
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
  bank_name: string;
  branch_number: string;
  account_number: string;
  account_holder: string;
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
  description: string;
  status: PaymentRequestStatus;
  pix_key_id?: string;
  created_at: string;
  updated_at?: string; // Optional in PaymentData
  approved_at?: string;
  approved_by?: string;
  receipt_url?: string;
  rejection_reason?: string;
  client_id: string;
  payment_type?: PaymentType | string;
  pix_key?: PixKeyInfo | PixKey;
  client?: ClientInfo | Client;
  bank_info?: BankInfo;
  document_url?: string;
  due_date?: string;
}

// Make PaymentRequest a type that extends PaymentData but requires updated_at
export interface PaymentRequest extends Omit<PaymentData, 'updated_at'> {
  updated_at: string; // Required in PaymentRequest
}

// Define Client interface for compatibility with other components
export interface Client {
  id: string;
  business_name: string;
  company_name?: string; // For compatibility
  document?: string;
  email?: string;
  phone?: string;
  status?: string;
  balance?: number;
  partner_id?: string;
  created_at?: string;
  updated_at?: string;
  contact_name?: string;
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
  type: string;
  client_id?: string;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
  name?: string;
  owner_name: string; // Made required
  is_default?: boolean;
  is_active?: boolean;
  bank_name?: string;
}

// Add any other types needed from the errors
export interface UserData {
  id: string;
  email: string;
  name?: string;
  role: string;
  avatar?: string;
  created_at?: string;
}

export interface SalesChartData {
  date: string;
  amount: number;
  name?: string;
  value?: number;
  total?: number;
}
