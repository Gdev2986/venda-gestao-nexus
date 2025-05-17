
export * from './types/enums';
export * from './types/client';
export * from './types/payment.types';

// Adding explicit re-exports to ensure they're available
export { ClientStatus, NotificationType, PaymentStatus, PaymentType, UserRole, PaymentAction } from './types/enums';
export type { Client, ClientCreate, ClientUpdate } from './types/client';
export type { PaymentData, PaymentRequest, BankInfo, PixKey, PixKeyInfo, UserData } from './types/payment.types';

// Export any missing types
export interface Payment {
  id: string;
  created_at: string;
  updated_at?: string;
  amount: number;
  status: PaymentStatus | string;
  client_id: string;
  approved_at?: string; 
  receipt_url?: string;
  client_name?: string;
  rejection_reason: string | null;
  payment_type?: PaymentType | string;
  bank_info?: BankInfo;
  document_url?: string;
  due_date?: string;
  pix_key?: {
    id: string;
    key: string;
    type: string;
    owner_name: string;
    key_type?: string;
  };
  approved_by?: string | null;
  description?: string;
  client?: any;
}

// Add missing types needed in components
export interface Notification {
  id: string;
  title: string;
  message: string;
  created_at: string;
  is_read: boolean;
  type: NotificationType | string;
  data?: any;
  read?: boolean; // Alias for is_read for backward compatibility
  timestamp?: string; // Alias for created_at for backward compatibility
}

export interface Sale {
  id: string;
  date: string;
  amount: number;
  client_id: string;
  client_name?: string;
  payment_method?: string;
  status?: string;
  code: string;
  terminal: string;
  gross_amount: number;
  net_amount: number;
}

export interface SalesFilterParams {
  client?: string;
  dateFrom?: string;
  dateTo?: string;
  paymentMethod?: string;
  status?: string;
  search?: string;
  terminal?: string;
  minAmount?: number;
  maxAmount?: number;
  startHour?: number;
  endHour?: number;
  installments?: number; // Added installments property
}

export interface SalesChartData {
  date: string;
  amount: number;
  name?: string; // Added for compatibility
  value?: number; // Added for compatibility
  total?: number; // Added for compatibility
}

export interface Machine {
  id: string;
  serial_number: string;
  model: string;
  status: string;
  client_id?: string;
  name?: string;
  client_name?: string;
  created_at?: string;
  updated_at?: string;
  location?: string;
  last_maintenance?: string | null;
  next_maintenance?: string | null;
}

export interface Partner {
  id: string;
  company_name: string;
  commission_rate?: number;
  created_at?: string;
  updated_at?: string;
  contact_name?: string;
  email?: string;
  phone?: string;
  business_name?: string; // Alias for company_name
}

export interface FilterValues {
  search?: string;
  status?: string;
  commissionRange?: number[];
}

// Add PaymentMethod type
export enum PaymentMethod {
  CREDIT = "CREDIT",
  DEBIT = "DEBIT",
  PIX = "PIX",
}
