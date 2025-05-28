
import { PaymentMethod } from './enums';

export interface Sale {
  id: string;
  code: string;
  terminal: string;
  client_name: string;
  gross_amount: number;
  net_amount: number;
  date: string;
  payment_method: PaymentMethod | string;
  client_id: string;
  created_at: string;
  updated_at: string;
  amount?: number;
  status?: string;
  partner_id?: string;
  machine_id?: string;
  processing_status?: string;
}

export interface SalesFilterParams {
  search?: string;
  paymentMethod?: string;
  terminal?: string;
  minAmount?: number;
  maxAmount?: number;
  startHour?: number;
  endHour?: number;
  installments?: string;
}

export interface SalesChartData {
  name: string;
  value: number;
}
