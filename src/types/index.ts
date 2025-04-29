
// Tipos de usuário
export enum UserRole {
  ADMIN = "ADMIN",
  FINANCIAL = "FINANCIAL",
  PARTNER = "PARTNER",
  CLIENT = "CLIENT",
}

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
};

// Client type definition
export type Client = {
  id: string;
  business_name: string;
  contact_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  document?: string;
  partner_id?: string;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
};

// Tipos para autenticação
export type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
};

// Tipos para vendas
export enum PaymentMethod {
  CREDIT = "CREDIT",
  DEBIT = "DEBIT",
  PIX = "PIX",
}

export type Sale = {
  id: string;
  code: string;
  date: Date;
  terminal: string;
  grossAmount: number;
  netAmount: number;
  paymentMethod: PaymentMethod;
  clientId: string;
};

// Tipos para chaves Pix
export type PixKey = {
  id: string;
  userId: string;
  type: "CPF" | "CNPJ" | "EMAIL" | "PHONE" | "RANDOM";
  key: string;
  name: string;
  isDefault: boolean;
};

// Estatísticas do dashboard
export type DashboardStats = {
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
};

// Tipos para paginação
export type PaginationParams = {
  page: number;
  limit: number;
  total: number;
};

// Tipos para filtros
export type SalesFilterParams = {
  startDate?: Date;
  endDate?: Date;
  paymentMethod?: PaymentMethod;
  terminal?: string;
  search?: string;
};
