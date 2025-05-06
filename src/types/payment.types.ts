
export type PaymentRequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'PAID';

export interface PaymentRequest {
  id: string;
  client_id: string;
  amount: number;
  description: string;
  status: PaymentRequestStatus;
  pix_key_id: string;
  created_at: string;
  updated_at: string;
  approved_at: string | null;
  approved_by: string | null;
  receipt_url: string | null;
  rejection_reason?: string;
  pix_key?: PixKey;
  client?: Client;
}

export interface PixKey {
  id: string;
  key: string;
  key_type: PixKeyType;
  client_id: string;
  created_at: string;
  updated_at: string;
}

export type PixKeyType = 'CPF' | 'CNPJ' | 'EMAIL' | 'PHONE' | 'EVP';

export interface Client {
  id: string;
  business_name: string;
  document: string;
}

// Add the missing PaymentData export that uses the PaymentRequest interface
export type PaymentData = PaymentRequest;
