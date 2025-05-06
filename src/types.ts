
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
  PIX = "PIX"
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
  rejection_reason: string | null;
  payment_type?: PaymentType;
  description?: string; // Added missing property
  due_date?: string; // Added missing property
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
  // Add any missing fields from PaymentRequest that might be used
  client?: {
    id: string;
    business_name: string;
    email?: string;
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
  company_name?: string; // Added for backward compatibility
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
}

// Add necessary types that might be missing
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
  isDefault?: boolean;  // Use this instead of is_default
  is_active?: boolean;
  bank_name?: string;
}

// Add Sale type for reference
export interface Sale {
  id: string;
  code: string;
  date: string;
  client_id: string;
  gross_amount: number;
  net_amount: number;
  payment_method: PaymentMethod;  // Changed from paymentMethod to payment_method
  terminal: string;
  processing_status?: string;
  created_at: string;
  updated_at: string;
  partner_id?: string;
  machine_id?: string;
  client_name?: string; // Added to match usage
}

// Add SalesChartData for reference
export interface SalesChartData {
  date: string;
  amount: number;
  method?: PaymentMethod; // Add optional method property
  percentage?: number; // Add optional percentage property
}

// Add SalesFilterParams for reference
export interface SalesFilterParams {
  startDate?: string;
  endDate?: string;
  clientId?: string;
  partnerId?: string;
  paymentMethod?: string;
  minAmount?: number;
  maxAmount?: number;
  search?: string; // Added for filtering
  terminal?: string; // Added for filtering
}

// Add FilterValues for reference
export interface FilterValues {
  search?: string;
  status?: string;
  partnerId?: string;
  searchTerm?: string; // Added for compatibility
}

// Add UserData for reference
export interface UserData {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  created_at: string; // Changed from optional to required
}
