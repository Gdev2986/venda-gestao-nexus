export interface Partner {
  id: string;
  company_name: string;
  business_name: string;
  commission_rate: number;
  created_at: string;
  updated_at: string;
  contact_name: string;
  email: string;
  phone: string;
  address: string;
  total_sales: number;
  total_commission: number;
}

export enum UserRole {
  ADMIN = "admin",
  USER = "user",
  MANAGER = "manager",
  LOGISTICS = "logistics",
  FINANCE = "finance",
  SUPPORT = "support",
}

export enum PaymentMethod {
  CREDIT = "credit",
  DEBIT = "debit",
  PIX = "pix",
  CASH = "cash",
  TRANSFER = "transfer",
}

export interface Sale {
  id: string;
  code: string;
  date: string;
  amount: number;
  payment_method: PaymentMethod;
  terminal: string;
  client_id: string;
  client_name: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface SalesFilterParams {
  search?: string;
  paymentMethod?: string;
  terminal?: string;
  startDate?: string;
  endDate?: string;
}

export interface SalesChartData {
  name: string;
  total: number;
}
