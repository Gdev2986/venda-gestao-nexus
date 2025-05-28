
import { PaymentType as EnumsPaymentType } from './enums';

// Core payment status enum unificado
export enum PaymentStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING", 
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  PAID = "PAID",
  COMPLETED = "COMPLETED"
}

// Payment method enum unificado
export enum PaymentMethod {
  PIX = "PIX",
  TED = "TED",
  BOLETO = "BOLETO",
  CREDIT = "CREDIT",
  DEBIT = "DEBIT"
}

export interface PixKey {
  id: string;
  key: string;
  type: string;
  name: string;
  owner_name: string;
  is_default?: boolean;
  bank_name?: string;
  key_type?: string;
  user_id: string;
  created_at?: string;
  updated_at?: string;
}

// Legacy Payment interface for backward compatibility
export interface Payment {
  id: string;
  client_id: string;
  amount: number;
  status: PaymentStatus;
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
  };
  pix_key?: PixKey;
  bank_info?: {
    bank_name?: string;
    account_number?: string;
    branch_number?: string;
    account_holder?: string;
  };
}

// PaymentRequest interface compatível
export interface PaymentRequest {
  id: string;
  client_id: string;
  amount: number;
  method?: PaymentMethod;
  status: PaymentStatus;
  created_at: string;
  updated_at: string;
  requested_at?: string;
  processed_at?: string;
  processed_by?: string;
  notes?: string;
  receipt_url?: string;
  description?: string;
  rejection_reason?: string | null;
  pix_key_id?: string;
  client?: {
    id: string;
    business_name: string;
    current_balance?: number;
  };
  processor?: {
    id: string;
    name: string;
  };
}

export interface PaymentRequestParams {
  client_id: string;
  amount: number;
  method: PaymentMethod;
  notes?: string;
}

export interface PaymentProcessParams {
  payment_id: string;
  status: PaymentStatus;
  notes?: string;
  receipt_file?: File;
}

export interface ClientBalance {
  client_id: string;
  current_balance: number;
  pending_payments: number;
  total_sales: number;
  commission_rate: number;
}

export type PaymentRequestStatus = PaymentStatus;

// PixKey types used in forms and components
export type PixKeyType = 'CPF' | 'CNPJ' | 'EMAIL' | 'PHONE' | 'EVP';

// Transaction fee calculation interfaces
export interface TransactionFeeParams {
  clientId: string;
  paymentMethod: PaymentMethod;
  installments: number;
  amount: number;
}

export interface TransactionFeeResult {
  originalAmount: number;
  feeAmount: number;
  netAmount: number;
  feePercentage: number;
  // Detailed breakdown of fees
  rootFee: number;
  forwardingFee: number;
  finalFee: number;
  // Information about the tax block used
  taxBlockInfo?: {
    blockId: string;
    blockName: string;
  };
}
