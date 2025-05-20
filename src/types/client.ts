
import { ClientStatus } from './enums';

export interface SupabaseClientRow {
  id: string;
  partner_id?: string;
  created_at: string;
  updated_at: string;
  fee_plan_id?: string;
  balance?: number;
  business_name: string;
  document?: string;
  contact_name?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  status?: ClientStatus | string;
}

export interface ClientCreate {
  business_name: string;
  document?: string;
  contact_name?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  partner_id?: string;
  fee_plan_id?: string;
  balance?: number;
  status?: ClientStatus | string;
}

export interface ClientUpdate {
  business_name?: string;
  document?: string;
  contact_name?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  partner_id?: string;
  fee_plan_id?: string;
  balance?: number;
  status?: ClientStatus | string;
}

export interface Client extends SupabaseClientRow {
  total_sales?: number;
  total_machines?: number;
  last_sale_date?: string;
  partner_name?: string;
  partner?: {
    id: string;
    company_name: string;
    commission_rate?: number;
  };
  // Add missing properties for ClientFormModal
  company_name?: string; // Alias for business_name
  cnpj?: string; // Alias for document
  initial_balance?: number; // Alias for balance
  address_number?: string;
  neighborhood?: string;
  zip_code?: string; // Alias for zip
}
