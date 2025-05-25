
export enum PaymentStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED", 
  PAID = "PAID",
  REJECTED = "REJECTED"
}

export enum PaymentMethod {
  PIX = "PIX",
  TED = "TED",
  BOLETO = "BOLETO"
}

export enum PixKeyType {
  CPF = "CPF",
  CNPJ = "CNPJ", 
  EMAIL = "EMAIL",
  PHONE = "PHONE",
  RANDOM = "RANDOM"
}

export interface Payment {
  id: string;
  client_id: string;
  amount: number;
  description: string;
  status: PaymentStatus;
  method: PaymentMethod;
  requested_at: string;
  created_at: string;
  updated_at: string;
  approved_at?: string;
  approved_by?: string;
  receipt_url?: string;
  rejection_reason?: string;
  pix_key?: PixKey;
}

export interface PaymentRequest {
  id: string;
  client_id: string;
  amount: number;
  description: string;
  status: PaymentStatus;
  method: PaymentMethod;
  requested_at: string;
  created_at: string;
  updated_at: string;
  approved_at?: string;
  approved_by?: string;
  receipt_url?: string;
  rejection_reason?: string;
  pix_key_id?: string;
  client?: {
    id: string;
    business_name: string;
  };
  processor?: {
    id: string;
    name: string;
  };
}

export interface PixKey {
  id: string;
  key: string;
  type: PixKeyType;
  name: string;
  owner_name: string;
  user_id: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
  bank_name?: string;
}

export interface TransactionFeeParams {
  amount: number;
  payment_method: string;
  installments?: number;
  client_id?: string;
}

export interface TransactionFeeResult {
  amount: number;
  root_rate: number;
  forwarding_rate: number;
  final_rate: number;
  root_fee: number;
  forwarding_fee: number;
  total_fee: number;
  net_amount: number;
}

export interface PaymentRequestParams {
  client_id: string;
  amount: number;
  description?: string;
  method: PaymentMethod;
  pix_key_id?: string;
}
