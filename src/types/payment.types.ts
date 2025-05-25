
export enum PaymentMethod {
  CREDIT = "CREDIT",
  DEBIT = "DEBIT", 
  PIX = "PIX"
}

export enum PaymentStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING", 
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  PAID = "PAID"
}

export interface Payment {
  id: string;
  client_id: string;
  amount: number;
  description?: string;
  status: PaymentStatus;
  method: PaymentMethod;
  pix_key_id?: string;
  created_at: string;
  updated_at: string;
  requested_at: string;
  rejection_reason?: string;
  client?: {
    id: string;
    business_name: string;
  };
}

export interface PaymentRequest {
  id: string;
  client_id: string;
  amount: number;
  description?: string;
  status: PaymentStatus;
  method: PaymentMethod;
  pix_key_id: string;
  requested_at: string;
  created_at?: string;
  updated_at?: string;
  rejection_reason?: string;
  client?: {
    id: string;
    business_name: string;
  };
}
