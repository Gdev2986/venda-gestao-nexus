
export enum UserRole {
  CLIENT = "CLIENT",
  ADMIN = "ADMIN",
  PARTNER = "PARTNER",
}

export enum PaymentStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  PAID = "PAID",
  REJECTED = "REJECTED",
}

export enum PaymentType {
  PIX = "PIX",
  TED = "TED",
  BOLETO = "BOLETO",
}

export type PixKey = {
  id: string;
  user_id: string;
  key_type: string;
  type: string;
  key: string;
  owner_name: string;
  name: string;
  isDefault: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  bank_name: string;
};

export interface Payment {
  id: string;
  amount: number;
  status: PaymentStatus;
  created_at: string;
  updated_at: string;
  client_id: string;
  description?: string;
  approved_at?: string;
  receipt_url?: string;
  client_name?: string;
  payment_type: PaymentType;
  bank_info?: {
    bank_name: string;
    branch_number: string;
    account_number: string;
    account_holder: string;
  };
  document_url?: string;
  rejection_reason: string | null;
  pix_key?: {
    id: string;
    key: string;
    type: string;
    owner_name: string;
  };
}
