
import { PixKey } from './payment.types';

export enum ClientStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  PENDING = "PENDING"
}

export type User = {
  id: string;
  email: string;
  name?: string;
  role?: UserRole;
  created_at?: string;
  updated_at?: string;
};

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  timestamp: string;
  data?: any;
}

export enum UserRole {
  ADMIN = "ADMIN",
  FINANCIAL = "FINANCIAL",
  LOGISTICS = "LOGISTICS",
  PARTNER = "PARTNER",
  CLIENT = "CLIENT",
  USER = "USER"
}

export interface Fee {
  id: string;
  name: string;
  percentage: number;
  fixed_amount?: number;
  is_active: boolean;
  description?: string;
}

// Export NotificationType enum
export enum NotificationType {
  PAYMENT = "PAYMENT",
  BALANCE = "BALANCE",
  MACHINE = "MACHINE",
  COMMISSION = "COMMISSION",
  SYSTEM = "SYSTEM",
  GENERAL = "GENERAL",
  SALE = "SALE",
  SUPPORT = "SUPPORT"
}

// Re-export other types but avoid re-exporting the ambiguous types
export type { Client } from './payment.types';
export type { PixKeyType } from './payment.types';
export { PaymentRequest, Payment, PixKey } from './payment.types';
export * from './enums';
