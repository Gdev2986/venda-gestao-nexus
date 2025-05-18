
export type PaymentRequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'PAID';

export interface PaymentRequest {
  id: string;
  client_id: string;
  amount: number;
  description: string;
  status: PaymentRequestStatus;
  pix_key_id?: string;
  created_at: string;
  updated_at: string;
  approved_at?: string | null;
  approved_by?: string | null;
  receipt_url?: string | null;
  rejection_reason: string | null;
  pix_key?: PixKey;
  client?: Client;
  payment_type?: string;
  due_date?: string;
  notes?: string;
  type?: string;
}

export interface PixKey {
  id: string;
  key: string;
  type: string; // Required field
  key_type?: string;
  client_id?: string;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
  name?: string;
  owner_name: string; // Required field
  isDefault?: boolean;
  is_active?: boolean;
  bank_name?: string;
}

export type PixKeyType = 'CPF' | 'CNPJ' | 'EMAIL' | 'PHONE' | 'EVP' | 'RANDOM';

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
  contact_name?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  fee_plan_id?: string;
}

// Payment type is an alias for PaymentRequest to maintain compatibility but with required fields
export type Payment = {
  id: string;
  client_id: string;
  amount: number;
  description: string;
  status: PaymentRequestStatus;
  created_at: string;
  updated_at: string;
  rejection_reason: string | null;
  pix_key?: {
    id: string;
    key: string;
    type: string;
    owner_name: string;
  };
  pix_key_id?: string;
  approved_at?: string | null;
  approved_by?: string | null;
  receipt_url?: string | null;
  client?: Client;
  payment_type?: string;
  due_date?: string;
  notes?: string;
  type?: string;
};
