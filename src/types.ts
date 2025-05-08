
export enum UserRole {
  ADMIN = "admin",
  USER = "user",
  MANAGER = "manager",
  LOGISTICS = "logistics",
  FINANCE = "finance",
  SUPPORT = "support",
  CLIENT = "client",
  PARTNER = "partner", 
  FINANCIAL = "financial"
}

export enum PaymentStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
  PAID = "paid"
}

export enum PaymentType {
  PIX = "pix",
  TED = "ted",
  BOLETO = "boleto"
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
  PIX = "pix",
  CASH = "cash",
  TRANSFER = "transfer",
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
  client?: Client;
}

// Types for partners
export interface Partner {
  id: string;
  company_name: string;
  business_name: string;
  commission_rate: number;
  created_at: string;
  updated_at: string;
  contact_name: string;
  email: string;
  phone: string;
  address: string;
  total_sales: number;
  total_commission: number;
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
  searchTerm?: string;
  commissionRange?: [number, number];
}

export interface PixKey {
  id: string;
  key: string;
  type: string;
  name: string;
  owner_name?: string;
  is_default?: boolean;
  isDefault?: boolean; // Alias for backward compatibility
  user_id?: string;
  created_at?: string;
  updated_at?: string;
  key_type?: string;
  bank_name?: string;
  is_active?: boolean;
}

export interface Sale {
  id: string;
  code: string;
  date: string;
  amount: number;
  payment_method: PaymentMethod;
  terminal: string;
  client_id: string;
  client_name: string;
  status: string;
  created_at: string;
  updated_at: string;
  gross_amount: number;
  net_amount: number;
}

export interface SalesFilterParams {
  search?: string;
  paymentMethod?: string;
  terminal?: string;
  startDate?: string;
  endDate?: string;
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
  total?: number; // Add optional total property for backward compatibility
}

export interface Machine {
  id: string;
  name?: string;
  client_id: string;
  client_name: string;
  created_at: string;
  updated_at: string;
  model: string;
  serial_number: string;
  serialNumber: string;  // Make this required to match the expected type
  status?: string;
}
