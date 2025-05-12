
export enum UserRole {
  ADMIN = "ADMIN",
  CLIENT = "CLIENT",
  FINANCIAL = "FINANCIAL",
  PARTNER = "PARTNER",
  LOGISTICS = "LOGISTICS"
}

export enum PaymentMethod {
  CREDIT = "CREDIT",
  DEBIT = "DEBIT",
  PIX = "PIX",
  BOLETO = "BOLETO",
  TRANSFER = "TRANSFER"
}

export enum NotificationType {
  PAYMENT = "PAYMENT",
  BALANCE = "BALANCE",
  MACHINE = "MACHINE",
  COMMISSION = "COMMISSION",
  SYSTEM = "SYSTEM",
  SALE = "SALE",
  SUPPORT = "SUPPORT"
}

// Database notification type - matches what's in the database
export type DatabaseNotificationType = "PAYMENT" | "BALANCE" | "MACHINE" | "COMMISSION" | "SYSTEM" | "SALE" | "SUPPORT";

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  created_at: string;
  user_id: string;
  data?: Record<string, any>;
}

// Database notification model
export interface DatabaseNotification {
  id: string;
  title: string;
  message: string;
  type: DatabaseNotificationType;
  is_read: boolean;
  created_at: string;
  user_id: string;
  data?: Record<string, any>;
}

export interface PixKey {
  id: string;
  user_id: string;
  type: string;
  key_type?: string;
  key: string;
  owner_name?: string;
  name?: string;
  is_default: boolean;
  bank_name?: string;
  created_at: string;
  updated_at: string;
}

export interface Client {
  id: string;
  business_name: string;
  document: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  created_at: string;
  updated_at: string;
  status: string;
}

export interface Sale {
  id: string;
  code: string;
  terminal: string;
  client_name: string;
  gross_amount: number;
  net_amount: number;
  amount: number;
  date: string;
  payment_method: PaymentMethod;
  client_id: string;
  created_at: string;
  updated_at: string;
  status: string;
}
