
export interface Company {
  id: string;
  name: string;
  document: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  created_at: string;
  updated_at: string;
}

export interface CompanyExpense {
  id: string;
  company_id: string;
  category: string;
  description: string;
  amount: number;
  date: string;
  created_at: string;
  updated_at: string;
}

export interface CompanyReport {
  id: string;
  company_id: string;
  type: string;
  period: string;
  data: any;
  created_at: string;
  updated_at: string;
}
