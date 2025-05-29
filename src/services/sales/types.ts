
export interface SaleInsert {
  id: string;
  code: string;
  terminal: string;
  date: string;
  gross_amount: number;
  net_amount: number;
  payment_method: "CREDIT" | "DEBIT" | "PIX";
  machine_id: string;
  processing_status: "RAW" | "PROCESSED";
  created_at: string;
  updated_at: string;
  installments?: number;
  source?: string;
}
