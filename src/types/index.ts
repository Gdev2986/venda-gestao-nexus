
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
}

export enum ClientStatus {
  ACTIVE = "ACTIVE",
  BLOCKED = "BLOCKED",
  PENDING = "PENDING",
  INACTIVE = "INACTIVE"
}

export interface PixKey {
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
  partner_name?: string;
  machines_count?: number;
  fee_plan_name?: string;
  fee_plan_id?: string;
  machines?: {
    id: string;
    serial_number: string;
    status: string;
    model: string;
  }[];
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
  email?: string;
  phone?: string;
  address?: string;
}

export interface DashboardStats {
  totalClients: number;
  totalRevenue: number;
  totalTransactions?: number;
  averageValue?: number;
  totalSales?: number;
  pendingPayments?: number;
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
  fee_plan_id?: string;
}

export interface FeePlan {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface UserData {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  created_at: string;
  updated_at: string;
  app_metadata: any;
  user_metadata: any;
  aud: string;
  phone?: string;
}
