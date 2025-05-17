
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
}

export interface Sale {
  id: string;
  date: string;
  amount: number;
  client_id: string;
  client_name?: string;
  payment_method?: string;
  status?: string;
}

export interface SalesFilterParams {
  client?: string;
  dateFrom?: string;
  dateTo?: string;
  paymentMethod?: string;
  status?: string;
  search?: string;
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
