
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
export type ClientCreate = Omit<Client, "id" | "created_at" | "updated_at" | "status">;

// Type for client updates
export type ClientUpdate = Partial<Client>;
