
export interface Client {
  id: string;
  business_name: string;
  contact_name?: string;
  email?: string;
  phone?: string;
  document?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  status?: string;
  balance?: number;
  partner_id?: string;
  fee_plan_id?: string;
  created_at?: string;
  updated_at?: string;
  // Additional fields for compatibility
  company_name?: string;
  cnpj?: string;
  initial_balance?: number;
  address_number?: string;
  neighborhood?: string;
  zip_code?: string;
}

export interface ClientCreateParams {
  business_name: string;
  contact_name?: string;
  email?: string;
  phone?: string;
  document?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  partner_id?: string;
  initial_balance?: number;
}

export interface ClientUpdateParams {
  business_name?: string;
  contact_name?: string;
  email?: string;
  phone?: string;
  document?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  status?: string;
  balance?: number;
  partner_id?: string;
}
