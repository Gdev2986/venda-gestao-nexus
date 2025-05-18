
import { PaymentStatus, PaymentType } from './enums';

export interface PixKey {
  id: string;
  key: string;
  type: string;
  name: string;
  owner_name?: string;
}

export interface Payment {
  id: string;
  client_id: string;
  amount: number;
  status: PaymentStatus;
  approved_by?: string;
  approved_at?: string;
  created_at: string;
  updated_at?: string;
  receipt_url?: string;
  description?: string;
  rejection_reason?: string;
  payment_type?: PaymentType;
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

export interface PaymentRequest extends Payment {
  pix_key_id: string;
}

export type PaymentRequestStatus = PaymentStatus;
