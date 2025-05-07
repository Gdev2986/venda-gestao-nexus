export enum UserRole {
  ADMIN = "admin",
  CLIENT = "client",
  PARTNER = "partner",
  FINANCIAL = "financial",
  LOGISTICS = "logistics",
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface Machine {
  id: string;
  name: string;
  description: string;
  image: string;
  status: "active" | "inactive" | "maintenance";
  location: string;
  lastMaintenance: string;
  nextMaintenance: string;
}

// Payment methods
export enum PaymentMethod {
  CREDIT = "credit",
  DEBIT = "debit",
  PIX = "pix"
}

export interface Sale {
  id: string;
  code: string;
  terminal: string;
  client_name: string;
  gross_amount: number;
  net_amount: number;
  date: string;
  payment_method: PaymentMethod;
  client_id: string;
  created_at: string;
  updated_at: string;
}

export interface SalesFilterParams {
  search?: string;
  paymentMethod?: string;
  terminal?: string;
  startHour?: number;
  endHour?: number;
  minAmount?: number;
  maxAmount?: number;
  installments?: string;
}
