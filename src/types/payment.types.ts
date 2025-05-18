
export enum PaymentStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  PAID = "PAID"
}

export enum PaymentType {
  PIX = "PIX",
  TED = "TED",
  BOLETO = "BOLETO"
}

export interface PaymentRequest {
  id: string;
  client_id: string;
  amount: number;
  status: PaymentStatus;
  created_at: string;
  updated_at: string;
  approved_at?: string;
  approved_by?: string | null;
  receipt_url?: string;
  description?: string;
  rejection_reason?: string | null;
  payment_type?: PaymentType;
  pix_key_id?: string;
  client?: {
    id: string;
    business_name: string;
    email?: string;
  };
}

export interface Payment {
  id: string;
  created_at: string;
  updated_at: string;
  amount: number;
  status: PaymentStatus | string;
  client_id: string;
  approved_at?: string; 
  receipt_url?: string;
  client_name?: string;
  rejection_reason: string | null;
  payment_type?: PaymentType | string;
  bank_info?: {
    bank_name?: string;
    account_number?: string;
    branch_number?: string;
    account_holder?: string;
  };
  document_url?: string;
  due_date?: string;
  pix_key?: {
    id: string;
    key: string;
    type: string;
    owner_name: string;
  };
  approved_by?: string | null;
  description?: string;
  client?: any;
}

export interface PaymentFormData {
  amount: number;
  payment_type: PaymentType;
  pix_key_id?: string;
  bank_info?: {
    bank_name: string;
    branch_number: string;
    account_number: string;
    account_type: string;
    account_holder: string;
    document: string;
  };
  description?: string;
}

export interface ApprovePaymentParams {
  id: string;
  receipt_url?: string;
  notes?: string;
  approved_by: string;
}

export interface RejectPaymentParams {
  id: string;
  rejection_reason: string;
}
