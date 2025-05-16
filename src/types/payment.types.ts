
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
  approved_at: string | null;
  approved_by: string | null;
  receipt_url: string | null;
  rejection_reason: string | null;
  pix_key?: PixKey;
  client?: Client;
  payment_type?: string;
  due_date?: string;
}

export interface PixKey {
  id: string;
  key: string;
  key_type?: PixKeyType;
  type?: string; // Added for backward compatibility
  client_id?: string;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
  name?: string; // Added for backward compatibility
  owner_name?: string; // Added for display purposes
  isDefault?: boolean; // Flag for default key, use this instead of is_default
  is_active?: boolean;
  bank_name?: string;
}

export type PixKeyType = 'CPF' | 'CNPJ' | 'EMAIL' | 'PHONE' | 'EVP';

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

// Add the missing PaymentData export that uses the PaymentRequest interface
export type PaymentData = PaymentRequest;
