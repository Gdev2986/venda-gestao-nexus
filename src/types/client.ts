
import { Client } from "@/types";

// Define the SupabaseClientRow type based on the database schema
export type SupabaseClientRow = {
  id: string;
  business_name: string;
  document?: string;
  partner_id?: string;
  created_at?: string;
  updated_at?: string;
};

// Type for client creation without ID and timestamps
export type ClientCreate = {
  business_name: string;
  document?: string;
  partner_id?: string;
  contact_name?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  fee_plan_id?: string;
};

// Type for client updates
export type ClientUpdate = Partial<Client>;
