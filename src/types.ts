
export enum UserRole {
  ADMIN = "ADMIN",
  CLIENT = "CLIENT",
  PARTNER = "PARTNER",
  FINANCIAL = "FINANCIAL",
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
  CREDIT = "credit",
  DEBIT = "debit",
  PIX = "pix"
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
  description?: string;
  rejection_reason: string | null;
  payment_type?: PaymentType;
  bank_info?: {
    bank_name?: string;
    account_number?: string;
    branch_number?: string;
    account_holder?: string;
  };
  document_url?: string;
  pix_key?: {
    id: string;
    key: string;
    type: string;
    owner_name: string;
  };
  client?: Client;
  due_date?: string; // Added due_date property
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

// Extended Client interface to ensure type safety
export interface Client {
  id: string;
  business_name: string;
  company_name?: string; // For backward compatibility
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
  country?: string;
  document?: string;
  fee_plan_id?: string;
  name?: string; // For backward compatibility
  description?: string;
  image?: string;
  location?: string;
  lastMaintenance?: string;
  nextMaintenance?: string;
}

// PixKey interface for payments
export interface PixKey {
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
}

// Filter values interface for partners filtering
export interface FilterValues {
  search?: string;
  status?: string;
  sortBy?: string;
  page?: number;
  searchTerm?: string; // Added for backward compatibility
  commissionRange?: [number, number]; // Added for backward compatibility
}

// User data for user management
export interface UserData {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  created_at: string;
  status: 'active' | 'inactive' | 'pending';
}

// Sales filter interface
export interface SalesFilterParams {
  search?: string;
  paymentMethod?: string;
  terminal?: string;
  startHour?: number;
  endHour?: number;
  minAmount?: number;
  maxAmount?: number;
  installments?: string;
}

// Sale interface
export interface Sale {
  id: string;
  code: string;
  terminal: string;
  client_name: string;
  gross_amount: number;
  net_amount: number;
  date: string;
  payment_method: PaymentMethod;
  client_id: string;
  created_at: string;
  updated_at: string;
  amount?: number; // Added for backward compatibility
  status?: string; // Added for backward compatibility
}

// Machine interface
export interface Machine {
  id: string;
  name: string;
  description: string;
  image: string;
  status: "active" | "inactive" | "maintenance";
  location: string;
  lastMaintenance: string;
  nextMaintenance: string;
}

// User interface
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

// SalesChartData interface for dashboard
export interface SalesChartData {
  name: string;
  total: number;
}
