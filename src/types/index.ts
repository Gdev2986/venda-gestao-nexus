
export enum UserRole {
  ADMIN = "ADMIN",
  CLIENT = "CLIENT",
  FINANCIAL = "FINANCIAL",
  PARTNER = "PARTNER", 
  LOGISTICS = "LOGISTICS"
}

export enum ClientStatus {
  ACTIVE = "ACTIVE",
  BLOCKED = "BLOCKED",
  PENDING = "PENDING"
}

export enum PaymentStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  PAID = "PAID"
}

export enum PaymentType {
  PIX = "PIX",
  TED = "TED",
  BOLETO = "BOLETO"
}

export enum PaymentMethod {
  CREDIT = "CREDIT",
  DEBIT = "DEBIT",
  PIX = "PIX"
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
  rejection_reason?: string;
  payment_type?: PaymentType;
  bank_info?: {
    bank_name?: string;
    account_number?: string;
    branch_number?: string;
    account_holder?: string;
  };
  document_url?: string;
}

// Types for partners
export interface Partner {
  id: string;
  company_name: string;
  created_at: string;
  updated_at: string;
  commission_rate: number;
  contact_name?: string;
  contact_email?: string;
  contact_phone?: string;
  business_name?: string; // For backward compatibility
  email?: string; // Added for consistency with filtering
  phone?: string; // Added for consistency with filtering
  address?: string; // Added for completeness
}

// Updated Client interface to include all fields used in components
export interface Client {
  id: string;
  business_name: string;
  document?: string;
  partner_id?: string;
  created_at?: string;
  updated_at?: string;
  company_name?: string; // For backward compatibility
  contact_name?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  status?: string;
  partner_name?: string;
  machines_count?: number;
  fee_plan_name?: string;
  balance?: number;
  fee_plan_id?: string;
  // Adding support for machines property used in client details
  machines?: Array<{
    id: string;
    serial_number: string;
    status: string;
    model: string;
  }>;
}

// User data interface for UserManagement component
export interface UserData {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  created_at: string;
  phone?: string;
  avatar?: string;
  updated_at?: string;
  app_metadata?: any;
  user_metadata?: any;
  aud?: string;
}

export interface Sale {
  id: string;
  code: string;
  terminal: string;
  date: string;
  gross_amount: number;
  net_amount: number;
  paymentMethod: PaymentMethod;
  client_id?: string;
  client_name?: string;
  installments?: string;
}

// Add other types here as needed
