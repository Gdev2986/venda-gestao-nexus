
import { PaymentStatus } from "@/types/enums";
import { Client, PixKey } from "@/types";

// Make description optional to match the other PaymentRequest interface
export type PaymentRequestStatus = 'PENDENTE' | 'APROVADO' | 'RECUSADO' | 'PAGO' | 'EM_PROCESSAMENTO';

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
  description?: string; // Made optional to match types/payment.types.ts
  status: PaymentRequestStatus;
  pix_key_id?: string;
  created_at: string;
  updated_at: string;
  approved_at: string | null;
  approved_by: string | null;
  receipt_url: string | null;
  rejection_reason: string | null;
  pix_key?: {
    id: string;
    key: string;
    key_type?: string;
    type?: string;
    client_id?: string;
    user_id?: string;
    created_at?: string;
    updated_at?: string;
    name?: string;
    owner_name?: string;
    isDefault?: boolean;
    is_active?: boolean;
    bank_name?: string;
  };
  client?: {
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
  };
  payment_type?: string;
  due_date?: string;
  bank_info?: {
    bank_name: string;
    branch_number: string;
    account_number: string;
    account_holder: string;
  };
  document_url?: string;
}

export type PixKeyType = 'CPF' | 'CNPJ' | 'EMAIL' | 'PHONE' | 'EVP';

// Make PaymentData type compatible with both systems
export type PaymentData = PaymentRequest;
