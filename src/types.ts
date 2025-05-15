
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

export enum PaymentMethod {
  CREDIT = "CREDIT",
  DEBIT = "DEBIT",
  PIX = "PIX",
  BOLETO = "BOLETO",
  TRANSFER = "TRANSFER"
}

export enum NotificationType {
  PAYMENT = "PAYMENT",
  BALANCE = "BALANCE",
  MACHINE = "MACHINE",
  COMMISSION = "COMMISSION",
  SYSTEM = "SYSTEM",
  SALE = "SALE",
  SUPPORT = "SUPPORT"
}

// Database notification type - matches what's in the database
export type DatabaseNotificationType = "PAYMENT" | "BALANCE" | "MACHINE" | "COMMISSION" | "SYSTEM" | "SALE" | "SUPPORT";

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  created_at: string;
  user_id: string;
  data?: Record<string, any>;
  role?: UserRole;
}

// Database notification model
export interface DatabaseNotification {
  id: string;
  title: string;
  message: string;
  type: DatabaseNotificationType;
  is_read: boolean;
  created_at: string;
  user_id: string;
  data?: Record<string, any>;
  role?: UserRole;
}

export enum ClientStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  PENDING = "pending"
}

export enum PaymentType {
  PIX = "PIX",
  TED = "TED",
  BOLETO = "BOLETO"
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
  description?: string;
  client?: {
    id: string;
    business_name: string;
    document?: string;
    email?: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
    created_at?: string;
    updated_at?: string;
    status?: string;
  };
}

export interface PixKey {
  id: string;
  user_id: string;
  type: string;
  key_type?: string;
  key: string;
  owner_name?: string;
  name?: string;
  is_default: boolean;
  bank_name?: string;
  created_at: string;
  updated_at: string;
  is_active?: boolean;
}

export interface Client {
  id: string;
  business_name: string;
  document?: string;
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
  fee_plan_id?: string;
  company_name?: string;
}

export interface Sale {
  id: string;
  code: string;
  terminal: string;
  client_name: string;
  gross_amount: number;
  net_amount: number;
  amount: number;
  date: string;
  payment_method: PaymentMethod;
  client_id: string;
  created_at: string;
  updated_at: string;
  status: string;
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
  business_name?: string;
  email?: string;
  phone?: string;
  address?: string;
  user_id?: string;
  total_commission?: number;
  total_sales?: number;
}

export interface FilterValues {
  search?: string;
  status?: string;
  category?: string;
  dateRange?: {
    from: Date;
    to?: Date;
  };
  commissionRange?: [number, number];
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
  model: string;
  serial_number: string;
  status: string;
  client_id?: string;
  location?: string;
  created_at: string;
  updated_at?: string;
  name?: string;
  client_name?: string;
}
