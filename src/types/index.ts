
export enum UserRole {
  ADMIN = "ADMIN",
  CLIENT = "CLIENT", 
  FINANCIAL = "FINANCIAL",
  PARTNER = "PARTNER",
  LOGISTICS = "LOGISTICS",
  MANAGER = "MANAGER",
  FINANCE = "FINANCE",
  SUPPORT = "SUPPORT",
  USER = "USER"
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

// Added ClientStatus enum for the ClientStatus component
export enum ClientStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  PENDING = "pending"
}

export enum PaymentMethod {
  CREDIT = "credit",
  DEBIT = "debit",
  PIX = "pix"
}

// Updated to match database notification_type enum
export enum NotificationType {
  PAYMENT = "PAYMENT",
  BALANCE = "BALANCE", 
  MACHINE = "MACHINE",
  COMMISSION = "COMMISSION",
  SYSTEM = "SYSTEM",
  GENERAL = "GENERAL",
  SALE = "SALE",
  SUPPORT = "SUPPORT"
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
  due_date?: string;
  pix_key?: {
    id: string;
    key: string;
    type: string;
    owner_name: string;
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
  company_name?: string;
}

export interface FilterValues {
  search?: string;
  status?: string;
  category?: string;
  dateRange?: {
    from: Date;
    to?: Date;
  };
}

export interface PixKey {
  id: string;
  key: string;
  type: string;
  name: string;
  owner_name?: string;
  is_default?: boolean;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
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
  client_id: string;
  created_at: string;
  updated_at: string;
}

export interface SalesFilterParams {
  search?: string;
  paymentMethod?: string;
  terminal?: string;
  minAmount?: number;
  maxAmount?: number;
  startHour?: number;
  endHour?: number;
  installments?: string;
}

export interface UserData {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  created_at: string;
  status: string;
}

export interface SalesChartData {
  name: string;
  value: number;
}

// Add a Notification interface
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  timestamp: Date;
  data?: any;
}
