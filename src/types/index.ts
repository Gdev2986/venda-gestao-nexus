
export interface Client {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  partner_id?: string;
  machines_count?: number;
  active?: boolean;
  created_at?: string;
  updated_at?: string;
  business_name?: string;
  contact_name?: string;
  document?: string;
  status?: string;
}

export interface Partner {
  id: string;
  company_name: string;
  business_name?: string;
  contact_name?: string;
  email?: string;
  phone?: string;
  commission_rate?: number;
  created_at?: string;
  updated_at?: string;
  name?: string; // For backwards compatibility
}

export enum UserRole {
  CLIENT = "CLIENT",
  ADMIN = "ADMIN",
  PARTNER = "PARTNER",
  FINANCIAL = "FINANCIAL",
  LOGISTICS = "LOGISTICS",
}

export interface PixKey {
  id: string;
  user_id: string;
  key_type: string;
  type: string;
  key: string;
  owner_name: string;
  name: string;
  isDefault: boolean;
  is_default: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  bank_name: string;
}

export interface DashboardStats {
  totalClients: number;
  totalRevenue: number;
  currentBalance: number;
  totalTransactions: number;
  averageValue: number;
  pendingPayments: number;
  salesByPaymentMethod: { method: string; amount: number }[];
  recentSales: { id: string; date: string; description: string; amount: number }[];
  // Add missing properties for Dashboard.tsx
  totalSales?: number;
  completedPayments?: number;
  clientBalance?: number;
  yesterdayGrossAmount?: number;
  yesterdayNetAmount?: number;
}

export interface UserSettings {
  name: string;
  email: string;
  language: string;
  timezone: string;
  theme: "light" | "dark" | "system";
  notifications: {
    marketing: boolean;
    security: boolean;
  };
  display: {
    showBalance: boolean;
    showNotifications: boolean;
  };
}

// Add User type for user management
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  created_at: string;
  updated_at?: string;
  last_login?: string;
  active: boolean;
}

// Add SimplifiedPixKey type for settings page
export interface SimplifiedPixKey {
  id: string;
  user_id: string;
  key_type: string;
  key: string;
  owner_name: string;
  is_default: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  bank_name: string;
}

// Add MachineData type for dashboard
export interface MachineData {
  id: string;
  name: string;
  model: string;
  serial_number: string;
  status: string;
  transactions: number;
  revenue: number;
  created_at: string;
}
