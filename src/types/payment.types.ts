import { PaymentType as EnumsPaymentType } from './enums';

// Core payment status enum
export enum PaymentStatus {
  AWAITING = 'Aguardando',
  APPROVED = 'Aprovado', 
  REJECTED = 'Recusado',
  PROCESSED = 'Processado'
}

// Payment method enum for new payment system
export enum PaymentMethod {
  PIX = "PIX",
  TED = "TED",
  BOLETO = "BOLETO"
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
  client_name?: string;
  client_email?: string;
  type: PaymentType;
  value: number;
  status: PaymentStatus;
  note?: string;
  proof_url?: string;
  boleto_url?: string;
  created_at: string;
  updated_at: string;
}

// New PaymentRequest interface for admin side
export interface PaymentRequest {
  id: string;
  client_id: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  requested_at: string;
  processed_at?: string;
  processed_by?: string;
  notes?: string;
  receipt_url?: string;
  client?: {
    id: string;
    business_name: string;
    current_balance: number;
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

export enum PaymentType {
  BOLETO = 'Boleto',
  PIX = 'Pix',
  TED = 'TED'
}

export interface PaymentHistory {
  id: string;
  payment_id: string;
  status: PaymentStatus;
  note?: string;
  created_by: string;
  created_at: string;
}

export interface PaymentFilters {
  status?: PaymentStatus;
  type?: PaymentType;
  client_id?: string;
  date_from?: string;
  date_to?: string;
}
