import { Payment } from "@/types";
import { formatCurrency } from "@/utils/currency-utils";
import { formatDateTime } from "@/utils/date-utils";

export interface PaymentViewModel {
  id: string;
  amount: string;
  rawAmount: number;
  status: string;
  clientName: string;
  date: string;
  approvedAt?: string;
  rejectionReason?: string;
}

const convertPayment = (paymentData: Payment): PaymentViewModel => {
  return {
    id: paymentData.id,
    amount: formatCurrency(paymentData.amount),
    rawAmount: paymentData.amount,
    status: paymentData.status,
    clientName: paymentData.client_name || 'Unknown Client',
    date: formatDateTime(paymentData.created_at),
    approvedAt: paymentData.approved_at ? formatDateTime(paymentData.approved_at) : undefined,
    rejectionReason: paymentData.rejection_reason || undefined,
  };
};

export const PaymentConverter = {
  convertPayment,
};
