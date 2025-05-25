
export enum PaymentMethod {
  CREDIT = "CREDIT",
  DEBIT = "DEBIT", 
  PIX = "PIX"
}

export enum PaymentStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING", 
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  PAID = "PAID"
}

export enum PixKeyType {
  CPF = "CPF",
  CNPJ = "CNPJ",
  EMAIL = "EMAIL",
  PHONE = "PHONE",
  RANDOM = "RANDOM",
  EVP = "EVP"
}

export interface PixKey {
  id: string;
  user_id: string;
  type: PixKeyType;
  key: string;
  name: string;
  owner_name?: string;
  bank_name?: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: string;
  client_id: string;
  amount: number;
  description?: string;
  status: PaymentStatus;
  method: PaymentMethod;
  payment_type?: string;
  pix_key_id?: string;
  created_at: string;
  updated_at: string;
  requested_at: string;
  rejection_reason?: string;
  approved_by?: string;
  approved_at?: string;
  receipt_url?: string;
  pix_key?: PixKey;
  client?: {
    id: string;
    business_name: string;
  };
}

export interface PaymentRequest {
  id: string;
  client_id: string;
  amount: number;
  description?: string;
  status: PaymentStatus;
  method: PaymentMethod;
  pix_key_id: string;
  requested_at: string;
  created_at?: string;
  updated_at?: string;
  rejection_reason?: string;
  client?: {
    id: string;
    business_name: string;
  };
}

export interface TransactionFeeParams {
  amount: number;
  paymentMethod: PaymentMethod;
  installments?: number;
  clientId?: string;
}

export interface TransactionFeeResult {
  grossAmount: number;
  netAmount: number;
  feeAmount: number;
  feePercentage: number;
  taxBlockInfo?: any;
}
