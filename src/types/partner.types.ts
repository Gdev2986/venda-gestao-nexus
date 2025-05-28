
export interface Partner {
  id: string;
  company_name: string;
  contact_name?: string;
  contact_email?: string;
  contact_phone?: string;
  commission_rate: number;
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
  commission_rate: number;
}

export interface PartnerUpdateParams {
  company_name?: string;
  contact_name?: string;
  contact_email?: string;
  contact_phone?: string;
  commission_rate?: number;
}
