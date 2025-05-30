
import { PaymentStatus as EnumsPaymentStatus, PaymentMethod } from './enums';

// Use the enum from enums.ts for consistency
export { PaymentStatus, PaymentMethod } from './enums';

export type PaymentType = 'PIX' | 'BOLETO' | 'TED';

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

// Updated PaymentRequest interface with new fields
export interface PaymentRequest {
  id: string;
  client_id: string;
  amount: number;
  method?: PaymentMethod;
  payment_type: PaymentType;
  status: EnumsPaymentStatus;
  created_at: string;
  updated_at: string;
  requested_at?: string;
  processed_at?: string;
  processed_by?: string;
  notes?: string;
  receipt_url?: string;
  receipt_file_url?: string;
  description?: string;
  rejection_reason?: string | null;
  pix_key_id?: string;
  boleto_file_url?: string;
  boleto_code?: string;
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

export interface PaymentRequestParams {
  client_id: string;
  amount: number;
  payment_type: PaymentType;
  method?: PaymentMethod;
  notes?: string;
  pix_key_id?: string;
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
