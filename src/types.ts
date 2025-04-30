
// User roles enum
export enum UserRole {
  ADMIN = "ADMIN",
  CLIENT = "CLIENT",
  FINANCIAL = "FINANCIAL",
  PARTNER = "PARTNER"
}

// Payment status enum
export enum PaymentStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  PAID = "PAID"
}

// Payment method enum
export enum PaymentMethod {
  CREDIT_CARD = "CREDIT_CARD",
  DEBIT_CARD = "DEBIT_CARD",
  PIX = "PIX",
  BANK_TRANSFER = "BANK_TRANSFER",
  CASH = "CASH"
}

// Client interface
export interface Client {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  email: string;
  phone: string;
  company_name?: string;
  document?: string;
  address?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  notes?: string;
  status: "ACTIVE" | "INACTIVE";
}

// Sale interface
export interface Sale {
  id: string;
  client_id: string;
  created_at: string;
  amount: number;
  status: string;
  payment_method: PaymentMethod;
  description?: string;
  client_name?: string; // Denormalized for convenience
}

// PixKey interface
export interface PixKey {
  id: string;
  created_at: string;
  updated_at: string;
  key: string;
  key_type: string;
  bank_name: string;
  is_active: boolean;
  owner_name: string;
}

// Partner interface
export interface Partner {
  id: string;
  created_at: string;
  updated_at: string;
  company_name: string;
  contact_name?: string;
  email?: string;
  phone?: string;
  address?: string;
  commission_rate?: number;
}

// Payment interface
export interface Payment {
  id: string;
  created_at: string;
  updated_at: string;
  client_id: string;
  amount: number;
  description?: string;
  status: PaymentStatus;
  approved_at?: string;
  approved_by?: string;
  receipt_url?: string;
  pix_key_id?: string;
  due_date?: string;
}

// Dashboard stats interface
export interface DashboardStats {
  totalClients: number;
  totalSales: number;
  totalRevenue: number;
  pendingPayments: number;
}

// Sales filter params
export interface SalesFilterParams {
  startDate?: Date;
  endDate?: Date;
  clientId?: string;
  paymentMethod?: PaymentMethod;
  minAmount?: number;
  maxAmount?: number;
}

// Partners filter values
export interface FilterValues {
  searchTerm: string;
  commissionRange: [number, number];
}
