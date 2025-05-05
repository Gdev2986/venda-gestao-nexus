
export enum UserRole {
  CLIENT = "CLIENT",
  ADMIN = "ADMIN",
  PARTNER = "PARTNER",
  FINANCIAL = "FINANCIAL",
  LOGISTICS = "LOGISTICS"
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

export enum PaymentMethod {
  CREDIT = "CREDIT",
  DEBIT = "DEBIT",
  PIX = "PIX",
}

export type PixKey = {
  id: string;
  user_id: string;
  key_type: string;      // Used in our application
  type: string;          // The actual type in the database
  key: string;
  owner_name: string;    // Used in our application
  name: string;          // The actual name in the database
  isDefault: boolean;    // Used in our application
  is_default?: boolean;  // The actual field in the database
  is_active: boolean;
  created_at: string;
  updated_at: string;
  bank_name: string;
};

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
  installments?: string; // Added installments field
}

export interface SalesFilterParams {
  search?: string;
  paymentMethod?: PaymentMethod;
  terminal?: string;
}

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
  balance?: number;
  fee_plan_id?: string;
}

export interface FilterValues {
  search?: string;
  status?: string;
  searchTerm?: string;
  commissionRange?: [number, number];
  dateRange?: {
    from: Date;
    to?: Date;
  };
}

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
  due_date?: string;
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

export interface DashboardStats {
  totalClients: number;
  totalRevenue: number;
  totalTransactions?: number;
  averageValue?: number;
  totalSales?: number;
  pendingPayments?: number;
  
  // Fields used in Dashboard.tsx
  currentBalance?: number;
  yesterdayGrossAmount?: number;
  yesterdayNetAmount?: number;
  salesByPaymentMethod?: any[];
  recentSales?: Sale[];
}

// Interface for client form data
export interface ClientFormData {
  id?: string;
  business_name: string;
  document?: string;
  partner_id?: string;
  contact_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
}

// Define User type for user management
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  created_at: string;
  updated_at?: string;
}

// Update UserData to match the profile data structure from supabase
export interface UserData {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  created_at: string;
  updated_at?: string;
}

// Dashboard chart data type
export interface SalesChartData {
  method: PaymentMethod;
  amount: number;
  percentage: number;
}

// Machine data types for Dashboard components
export interface MachineData {
  id: string;
  name: string;
  serial_number: string;
  model: string;
  status: string;
  created_at: string;
}
