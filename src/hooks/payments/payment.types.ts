
import { PaymentStatus } from "@/types/enums";
import { Client, PixKey, BankInfo } from "@/types";

export type PaymentRequestStatus = 
  | 'PENDENTE' 
  | 'APROVADO' 
  | 'RECUSADO' 
  | 'PAGO' 
  | 'EM_PROCESSAMENTO'
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

export interface UsePaymentsOptions {
  statusFilter?: string;
  searchTerm?: string;
  fetchOnMount?: boolean;
  page?: number;
  pageSize?: number;
}

export interface PaymentRequest {
  id: string;
  client_id: string;
  amount: number;
  description: string;
  status: PaymentRequestStatus;
  pix_key_id?: string;
  created_at: string;
  updated_at: string;
  approved_at?: string;
  approved_by?: string;
  receipt_url?: string;
  rejection_reason?: string;
  pix_key?: PixKey;
  client?: Client;
  payment_type?: string;
  due_date?: string;
  bank_info?: BankInfo;
  document_url?: string;
}

export type PixKeyType = 'CPF' | 'CNPJ' | 'EMAIL' | 'PHONE' | 'EVP';

// Make PaymentData type compatible with both systems
export type PaymentData = PaymentRequest;
