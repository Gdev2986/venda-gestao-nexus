
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
  business_name: string; // Match this with what's used in components
  name?: string; // Keep for backward compatibility
  company_name?: string; // Keep for backward compatibility
  email: string;
  phone: string;
  contact_name?: string;
  document?: string;
  address?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  zip?: string; // Allow both postal_code and zip
  notes?: string;
  status: "ACTIVE" | "INACTIVE";
  partner_id?: string;
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
  // Add additional fields needed by components
  code?: string;
  date?: Date | string;
  terminal?: string;
  grossAmount?: number;
  netAmount?: number;
  paymentMethod?: PaymentMethod; // For backward compatibility
}

// PixKey interface
export interface PixKey {
  id: string;
  created_at: string;
  updated_at: string;
  key: string;
  key_type: string;
  type?: string; // For backward compatibility
  bank_name: string;
  is_active: boolean;
  owner_name: string;
  name?: string; // For backward compatibility
  isDefault?: boolean; // For backward compatibility
  userId?: string; // For backward compatibility
  user_id?: string;
}

// Partner interface
export interface Partner {
  id: string;
  created_at: string;
  updated_at: string;
  company_name: string;
  business_name?: string; // For backward compatibility
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
  // Add these fields for compatibility with components
  currentBalance?: number;
  yesterdayGrossAmount?: number;
  yesterdayNetAmount?: number;
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
  // Add these fields for compatibility
  terminal?: string;
  search?: string;
}

// Partners filter values
export interface FilterValues {
  searchTerm: string;
  commissionRange: [number, number];
}
