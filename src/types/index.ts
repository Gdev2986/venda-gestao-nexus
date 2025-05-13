
// Re-export all types from the main types.ts file
export * from "../types";

// Re-export payment types
export * from "./payment.types";

// Re-export client types
export * from "./client";

// Additional types needed by components that aren't in the main exports
export type SalesFilterParams = {
  search?: string;
  paymentMethod?: string;
  terminal?: string;
  minAmount?: number;
  maxAmount?: number;
  startHour?: number;
  endHour?: number;
  installments?: string;
};

export interface Machine {
  id: string;
  name?: string;
  model: string;
  serial_number: string;
  status: string;
  client_id?: string;
  client_name?: string;
  created_at: string;
  updated_at: string;
}

export interface SalesChartData {
  name: string;
  value: number;
  date?: string;
  amount?: number;
}

// Ensure FilterValues type is exported
export interface FilterValues {
  search?: string;
  status?: string;
  category?: string;
  dateRange?: {
    from: Date;
    to?: Date;
  };
}
