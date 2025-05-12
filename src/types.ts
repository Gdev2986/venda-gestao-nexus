
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

// Valid role type for parameter validation
export type ValidRole = 
  | "ADMIN" 
  | "CLIENT" 
  | "FINANCIAL" 
  | "PARTNER" 
  | "LOGISTICS" 
  | "MANAGER" 
  | "FINANCE" 
  | "SUPPORT" 
  | "USER";

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

export enum ClientStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  PENDING = "pending"
}

export type DatabaseNotificationType = 
  | "PAYMENT" 
  | "BALANCE" 
  | "MACHINE" 
  | "COMMISSION" 
  | "SYSTEM"
  | "SALE"
  | "PAYMENT_APPROVED"
  | "PAYMENT_REJECTED" 
  | "PAYMENT_REQUEST"
  | "SUPPORT"
  | "GENERAL";

// Export the NotificationType for components that need it
export const NotificationType = {
  PAYMENT: "PAYMENT" as DatabaseNotificationType,
  BALANCE: "BALANCE" as DatabaseNotificationType,
  MACHINE: "MACHINE" as DatabaseNotificationType,
  COMMISSION: "COMMISSION" as DatabaseNotificationType,
  SYSTEM: "SYSTEM" as DatabaseNotificationType,
  SALE: "SALE" as DatabaseNotificationType,
  PAYMENT_APPROVED: "PAYMENT_APPROVED" as DatabaseNotificationType,
  PAYMENT_REJECTED: "PAYMENT_REJECTED" as DatabaseNotificationType,
  PAYMENT_REQUEST: "PAYMENT_REQUEST" as DatabaseNotificationType,
  SUPPORT: "SUPPORT" as DatabaseNotificationType,
  GENERAL: "GENERAL" as DatabaseNotificationType
};

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
  description?: string;
  client?: {
    business_name: string;
  };
}

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
  total_commission?: number;
  total_sales?: number;
  user_id?: string;
}

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
  commissionRange?: {
    min: number;
    max: number;
  };
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
  bank_name?: string;
  key_type?: string;
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
  amount: number;
  status: string;
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

export interface Machine {
  id: string;
  serial_number: string;
  model: string;
  status: string;
  client_id?: string;
  client_name?: string;
  location?: string;
  installation_date?: string;
  last_maintenance?: string;
  created_at?: string;
  updated_at?: string;
  name?: string; // Added for compatibility with existing code
}

// Type for notifications
export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: DatabaseNotificationType;
  read: boolean;
  created_at: string;
  data?: Record<string, any>;
}
