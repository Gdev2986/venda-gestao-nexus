
import { PaymentStatus, PaymentType, NotificationType } from "./enums";

export type PaymentRequestStatus = 
  | 'PENDING'
  | 'APPROVED'
  | 'REJECTED'
  | 'PAID'
  | 'PROCESSING'
  | PaymentStatus.PENDING
  | PaymentStatus.APPROVED
  | PaymentStatus.REJECTED
  | PaymentStatus.PAID
  | PaymentStatus.PROCESSING;

export interface PixKeyInfo {
  id: string;
  key: string;
  type: string;
  owner_name: string;
  key_type?: string;
}

export interface ClientInfo {
  id: string;
  business_name: string;
  [key: string]: any;
}

export interface BankInfo {
  bank_name?: string;
  bank_code?: string;
  agency?: string;
  account?: string;
  account_type?: string;
  document?: string;
  owner_name?: string;
}

export interface PaymentData {
  id: string;
  amount: number;
  description: string;
  status: PaymentRequestStatus;
  pix_key_id?: string;
  created_at: string;
  updated_at?: string;
  approved_at?: string;
  approved_by?: string;
  receipt_url?: string;
  rejection_reason?: string;
  client_id: string;
  payment_type: PaymentType;
  pix_key?: PixKeyInfo;
  client?: ClientInfo;
  bank_info?: BankInfo;
  document_url?: string;
  due_date?: string;
}
