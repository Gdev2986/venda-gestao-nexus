
import { PaymentStatus as EnumsPaymentStatus, PaymentMethod } from './enums';

// Use the enum from enums.ts for consistency
export { PaymentStatus, PaymentMethod } from './enums';

export type PaymentType = 'PIX' | 'BOLETO' | 'TED';

export interface PixKey {
  id: string;
  key: string;
  type: string;
  name: string;
  owner_name: string; // Make required to match usage
  is_default?: boolean;
  bank_name?: string;
  key_type?: string;
  user_id: string;
  created_at?: string;
  updated_at?: string;
}

// Main Payment interface that consolidates all payment data
export interface Payment {
  id: string;
  client_id: string;
  amount: number;
  status: EnumsPaymentStatus;
  created_at: string;
  updated_at: string; // Make required
  payment_type: PaymentType;
  pix_key_id?: string;
  boleto_file_url?: string;
  boleto_code?: string;
  notes?: string;
  receipt_file_url?: string; // Add this field
  receipt_url?: string; // Add for compatibility
  processed_at?: string;
  processed_by?: string;
  description?: string;
  rejection_reason?: string; // Make optional for compatibility
  approved_at?: string;
  approved_by?: string;
  client?: {
    id: string;
    business_name: string;
    current_balance?: number;
  };
  processor?: {
    id: string;
    name: string;
  };
  pix_key?: PixKey;
}

// PaymentRequest interface extends Payment for backward compatibility
export interface PaymentRequest extends Payment {
  requested_at?: string;
}

export interface PaymentRequestParams {
  client_id: string;
  amount: number;
  payment_type: PaymentType;
  method?: PaymentMethod;
  notes?: string;
  pix_key_id?: string;
  new_pix_key?: {
    type: 'CPF' | 'CNPJ' | 'EMAIL' | 'PHONE' | 'RANDOM'; // Changed EVP to RANDOM to match database
    key: string;
    name: string;
    owner_name: string;
  };
  boleto_code?: string;
  boleto_file?: File;
}

export interface PaymentProcessParams {
  payment_id: string;
  status: EnumsPaymentStatus;
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

export interface PartnerCommissionBalance {
  partner_id: string;
  total_commission: number;
  paid_commission: number;
  available_balance: number;
}

export type PaymentRequestStatus = EnumsPaymentStatus;

// PixKey types used in forms and components
export type PixKeyType = 'CPF' | 'CNPJ' | 'EMAIL' | 'PHONE' | 'RANDOM'; // Changed EVP to RANDOM

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
