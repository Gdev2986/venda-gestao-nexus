
export enum UserRole {
  ADMIN = 'ADMIN',
  PARTNER = 'PARTNER',
  CLIENT = 'CLIENT',
  FINANCIAL = 'FINANCIAL',  // Changed from FINANCE to FINANCIAL to match what's used in the codebase
}

export enum PaymentMethod {
  CREDIT = 'CREDIT',
  DEBIT = 'DEBIT',
  PIX = 'PIX',
}

export enum MachineStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  MAINTENANCE = 'MAINTENANCE',
}

export enum ProcessingStatus {
  RAW = 'RAW',
  PROCESSED = 'PROCESSED',
}

export enum PaymentRequestStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  PAID = 'PAID',
}

export enum PixKeyType {
  CPF = 'CPF',
  CNPJ = 'CNPJ',
  EMAIL = 'EMAIL',
  PHONE = 'PHONE',
  RANDOM = 'RANDOM',
}

export interface User {
  id: string;
  email: string;
  name?: string;
  role: UserRole;
  avatar?: string;
}

export interface Client {
  id: string;
  business_name: string;
  document?: string;
  partner_id?: string;
  created_at?: string;
  updated_at?: string;
  status?: string; // Added status to match usage in clientsApi.ts
}

export interface Partner {
  id: string;
  company_name: string;
  commission_rate: number;
  created_at?: string;
  updated_at?: string;
}

export interface Machine {
  id: string;
  serial_number: string;
  model: string;
  status: MachineStatus;
  client_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Sale {
  id: string;
  code: string;
  date: Date;
  terminal: string;
  grossAmount: number;
  netAmount: number;
  paymentMethod: PaymentMethod;
  clientId: string;
}

export interface SaleDb {
  id: string;
  code: string;
  date: string;
  terminal: string;
  gross_amount: number;
  net_amount: number;
  payment_method: PaymentMethod;
  client_id: string;
  machine_id?: string;
  partner_id?: string;
  processing_status?: ProcessingStatus;
  created_at?: string;
  updated_at?: string;
}

export interface SalesFilterParams {
  paymentMethod?: PaymentMethod;
  terminal?: string;
  search?: string;
}

export interface PaymentRequest {
  id: string;
  amount: number;
  status: PaymentRequestStatus;
  client_id: string;
  pix_key_id: string;
  receipt_url?: string;
  created_at?: string;
  updated_at?: string;
  approved_at?: string;
  approved_by?: string;
}

// Add PixKey interface to fix error in PixKeysManager
export interface PixKey {
  id: string;
  key: string;
  type: PixKeyType;
  name: string;
  user_id: string;
  is_default: boolean;
  created_at?: string;
  updated_at?: string;
}

// Add interface for DashboardStats
export interface DashboardStats {
  currentBalance: number;
  yesterdayGrossAmount: number;
  yesterdayNetAmount: number;
  totalSales: number;
  salesByPaymentMethod: {
    method: PaymentMethod;
    amount: number;
    percentage: number;
  }[];
  recentSales: Sale[];
}
