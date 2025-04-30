
// User roles enum
export enum UserRole {
  ADMIN = "ADMIN",
  CLIENT = "CLIENT",
  FINANCIAL = "FINANCIAL",
  PARTNER = "PARTNER",
  LOGISTICS = "LOGISTICS"
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
  CASH = "CASH",
  // Add these for backward compatibility
  CREDIT = "CREDIT",
  DEBIT = "DEBIT"
}

// Client interface
export interface Client {
  id: string;
  created_at: string;
  updated_at: string;
  business_name: string;
  name?: string; // Keep for backward compatibility
  company_name?: string; // Keep for backward compatibility
  email: string;
  phone: string;
  contact_name: string;
  document?: string;
  address: string;
  city: string;
  state: string;
  postal_code?: string;
  zip: string; // Allow both postal_code and zip
  notes?: string;
  status: "ACTIVE" | "INACTIVE";
  partner_id?: string;
}

// Partner interface
export interface Partner {
  id: string;
  created_at?: string;
  updated_at?: string;
  company_name: string;
  business_name?: string; // For backward compatibility
  contact_name?: string;
  email?: string;
  phone?: string;
  address?: string;
  commission_rate: number;
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
  client_name?: string;
  code?: string;
  date: Date | string;
  terminal?: string;
  grossAmount?: number;
  netAmount?: number;
  paymentMethod?: PaymentMethod; // For backward compatibility
}

// PixKey interface - updated to match the component and database schema
export interface PixKey {
  id: string;
  created_at: string;
  updated_at?: string;
  key: string;
  type: "CPF" | "CNPJ" | "EMAIL" | "PHONE" | "RANDOM";
  key_type?: string; // For backward compatibility
  is_default: boolean;
  isDefault?: boolean; // For backward compatibility
  name: string;
  owner_name?: string; // For backward compatibility
  user_id: string;
  userId?: string; // For backward compatibility
}

// Payment interface
export interface Payment {
  id: string;
  created_at: string;
  updated_at?: string;
  client_id: string;
  amount: number;
  description?: string; // Added description field to match database schema
  status: PaymentStatus;
  approved_at?: string | null;
  approved_by?: string;
  receipt_url?: string | null;
  rejection_reason?: string | null;
  pix_key_id?: string;
  due_date?: string;
}

// Dashboard stats interface
export interface DashboardStats {
  totalClients: number;
  totalSales: number;
  totalRevenue: number;
  pendingPayments: number;
  currentBalance?: number;
  yesterdayGrossAmount?: number;
  yesterdayNetAmount?: number;
  recentSales?: Sale[];
  salesByPaymentMethod?: {
    method: PaymentMethod;
    amount: number;
    percentage: number;
  }[];
}

// Sales filter params
export interface SalesFilterParams {
  startDate?: Date;
  endDate?: Date;
  clientId?: string;
  paymentMethod?: PaymentMethod;
  minAmount?: number;
  maxAmount?: number;
  terminal?: string;
  search?: string;
}

// Partners filter values
export interface FilterValues {
  searchTerm: string;
  commissionRange: [number, number];
}
