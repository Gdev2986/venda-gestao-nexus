
import { ClientStatus } from "@/types/enums";

// Define the Client interface for use throughout the application
export interface Client {
  id: string;
  business_name: string;
  document?: string;
  email?: string;
  phone?: string;
  status?: string | ClientStatus;
  balance?: number;
  partner_id?: string;
  created_at?: string;
  updated_at?: string;
  contact_name?: string; // Keep optional to maintain consistency
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  fee_plan_id?: string;
  user_id?: string;
}

// Define the SupabaseClientRow type based on the database schema
export type SupabaseClientRow = {
  id: string;
  business_name: string;
  document?: string;
  partner_id?: string;
  created_at?: string;
  updated_at?: string;
  status?: string;
  balance?: number;
  fee_plan_id?: string;
};

// Type for client creation without ID and timestamps
export type ClientCreate = Omit<Client, "id" | "created_at" | "updated_at" | "status">;

// Type for client updates
export type ClientUpdate = Partial<Client>;
