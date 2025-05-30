
export interface Partner {
  id: string;
  company_name: string;
  contact_name?: string;
  contact_email?: string;
  contact_phone?: string;
  created_at: string;
  updated_at: string;
  // For backward compatibility
  business_name?: string;
  email?: string;
  phone?: string;
  address?: string;
  total_sales?: number;
  total_commission?: number;
  status?: string;
}

export interface PartnerCreateParams {
  company_name: string;
  contact_name?: string;
  contact_email?: string;
  contact_phone?: string;
  linked_clients?: string[];
}

export interface PartnerUpdateParams {
  company_name?: string;
  contact_name?: string;
  contact_email?: string;
  contact_phone?: string;
  linked_clients?: string[];
}
