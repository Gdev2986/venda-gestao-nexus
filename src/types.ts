
export * from './types/enums';
export * from './types/client';
export * from './types/payment.types';

// Adding explicit re-exports to ensure they're available
export { ClientStatus, NotificationType, PaymentStatus, PaymentType, UserRole, PaymentAction } from './types/enums';
export type { Client, ClientCreate, ClientUpdate } from './types/client';
export type { PaymentData, PaymentRequest, BankInfo, PixKey, PixKeyInfo } from './types/payment.types';

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
  code: string; // Add missing property
  terminal: string; // Add missing property
  gross_amount: number; // Add missing property
  net_amount: number; // Add missing property
}

export interface SalesFilterParams {
  client?: string;
  dateFrom?: string;
  dateTo?: string;
  paymentMethod?: string;
  status?: string;
  search?: string;
  terminal?: string; // Add missing property
  minAmount?: number; // Add missing property
  maxAmount?: number; // Add missing property
  startHour?: number; // Add missing property
  endHour?: number; // Add missing property
}

export interface SalesChartData {
  date: string;
  amount: number;
}

export interface Machine {
  id: string;
  serial_number: string;
  model: string;
  status: string;
  client_id?: string;
  name?: string; // Add missing property
  client_name?: string; // Add missing property
  created_at?: string; // Add missing property
  updated_at?: string; // Add missing property
  location?: string; // Add missing property
  last_maintenance?: string | null; // Add missing property
  next_maintenance?: string | null; // Add missing property
}

export interface Partner {
  id: string;
  company_name: string;
  commission_rate?: number;
  created_at?: string;
  updated_at?: string;
}

export interface FilterValues {
  search?: string;
  status?: string;
}

// Add PaymentMethod type
export enum PaymentMethod {
  CREDIT = "CREDIT",
  DEBIT = "DEBIT",
  PIX = "PIX",
}
