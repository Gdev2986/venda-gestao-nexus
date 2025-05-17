
export * from './types/enums';
export * from './types/client';
export * from './types/payment.types';

// Adding explicit re-exports to ensure they're available
export { ClientStatus, NotificationType, PaymentStatus, PaymentType, UserRole } from './types/enums';
export type { Client } from './types/client';
export type { PaymentData, PaymentRequest } from './types/payment.types';

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
    key_type?: string;
  };
  // Add missing properties to match PaymentRequest
  approved_by?: string | null;
  description?: string;
  // Add any other properties that might be needed
  client?: any;
}
