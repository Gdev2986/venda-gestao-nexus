import { UserRole } from "./user";

// Existing or new type definitions related to clients
export enum ClientStatus {
  ACTIVE = "ACTIVE",
  BLOCKED = "BLOCKED",
  PENDING = "PENDING",
  INACTIVE = "INACTIVE"
}

export type Client = {
  id: string;
  business_name: string;
  company_name?: string; // For backward compatibility
  contact_name?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  document?: string;
  partner_id?: string;
  partner_name?: string; // Used in UI
  fee_plan_id?: string;
  fee_plan_name?: string; // Used in UI
  created_at?: string;
  updated_at?: string;
  status?: ClientStatus;
  balance?: number;
  machines_count?: number; // Used in UI
  machines?: any[]; // For the client details view
};

export type Machine = {
  id: string;
  serial_number: string;
  model: string;
  status: "ACTIVE" | "INACTIVE";
  client_id?: string;
  created_at?: string;
  updated_at?: string;
};

export type PixKey = {
  id: string;
  type: string;
  key: string;
  name: string;
  user_id?: string;
  is_default?: boolean;
  created_at?: string;
  updated_at?: string;
};

// Other types
export enum PaymentMethod {
  CREDIT = "CREDIT",
  DEBIT = "DEBIT",
  PIX = "PIX",
  OTHER = "OTHER"
}

export type Sale = {
  id: string;
  code: string;
  terminal: string;
  date: string;
  client_id: string;
  machine_id?: string;
  partner_id?: string;
  gross_amount: number;
  net_amount: number;
  paymentMethod: PaymentMethod;
  created_at?: string;
  updated_at?: string;
  processing_status?: string;
};

export type ClientFilters = {
  partnerId?: string;
  feePlanId?: string;
  balanceRange?: [number, number];
};
