
export enum UserRole {
  ADMIN = "ADMIN",
  CLIENT = "CLIENT",
  FINANCIAL = "FINANCIAL",
  PARTNER = "PARTNER", 
  LOGISTICS = "LOGISTICS"
}

export enum PaymentStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED"
}

export interface Payment {
  id: string;
  created_at: string;
  updated_at: string;
  amount: number;
  status: PaymentStatus;
  client_id: string;
  approved_at?: string; 
  receipt_url?: string;
  client_name?: string;
  rejection_reason?: string; // Made this optional
}

// Types for partners
export interface Partner {
  id: string;
  company_name: string;
  created_at?: string;
  updated_at?: string;
  commission_rate?: number;
  contact_name?: string;
  contact_email?: string;
  contact_phone?: string;
}

// Add other types here as needed
