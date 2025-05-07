
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
  PIX = "PIX",
  BOLETO = "BOLETO",
  CASH = "CASH",
  OTHER = "OTHER"
}

// Added ClientStatus enum for the ClientStatus component
export enum ClientStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  PENDING = "pending"
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
  rejection_reason: string | null;
  payment_type?: PaymentType;
  bank_info?: {
    bank_name?: string;
    account_number?: string;
    branch_number?: string;
    account_holder?: string;
  };
  document_url?: string;
  description?: string; // Added property for description
  due_date?: string; // Added property for due_date
  pix_key?: {
    id: string;
    key: string;
    type: string;
    owner_name: string;
  };
  client?: {
    id: string;
    business_name?: string;
    [key: string]: any;
  };
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

// Added Client interface to ensure type safety
export interface Client {
  id: string;
  business_name: string;
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
  document?: string;
  fee_plan_id?: string;
  company_name?: string; // Added property for backward compatibility
}

export interface PixKey {
  id: string;
  user_id: string;
  key_type: string;
  type: string;
  key: string;
  owner_name: string;
  name: string;
  isDefault: boolean;
  is_active: boolean;
  bank_name: string;
  created_at: string;
  updated_at: string;
}

// Update SalesChartData interface
export interface SalesChartData {
  date?: string;
  amount: number;
  method: PaymentMethod; // Making method required
  percentage: number; // Making percentage required
  name?: string;
  value?: number;
}

export interface Sale {
  id: string;
  code: string;
  terminal: string;
  client_name: string;
  gross_amount: number;
  net_amount: number;
  date: string;
  payment_method: PaymentMethod;
  client_id?: string; // Added client_id
}

export interface FilterValues {
  search?: string;
  searchTerm?: string; // Added searchTerm property
  status?: string;
  role?: UserRole;
  commissionRange?: [number, number];
}

export interface SalesFilterParams {
  startDate?: Date;
  endDate?: Date;
  paymentMethod?: PaymentMethod;
  terminal?: string;
  search?: string; // Added search property
}

export interface UserData {
  id: string;
  name: string; // Changed from optional to required
  email: string;
  role: UserRole;
  created_at: string;
  updated_at?: string;
  last_login?: string;
  avatar_url?: string;
}

// Export all types from other type files
export * from './types/payment.types';
export * from './types/client';
