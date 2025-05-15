
import { Payment, PaymentRequest } from "@/types";
import { formatCurrency, formatDateTimeString } from "@/lib/utils";

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
    date: formatDateTimeString(paymentData.created_at),
    approvedAt: paymentData.approved_at ? formatDateTimeString(paymentData.approved_at) : undefined,
    rejectionReason: paymentData.rejection_reason || undefined,
  };
};

export const convertToPaymentRequest = (payment: Payment): PaymentRequest => {
  return {
    id: payment.id,
    client_id: payment.client_id,
    client_name: payment.client_name || 'Unknown Client',
    amount: payment.amount,
    description: payment.description || '',
    status: payment.status,
    created_at: payment.created_at,
    updated_at: payment.updated_at,
    receipt_url: payment.receipt_url || null,
    pix_key_id: payment.pix_key_id || '',
    approved_at: payment.approved_at || null,
    approved_by: payment.approved_by || null,
    rejection_reason: payment.rejection_reason || null,
    client: payment.client
  };
};

export const PaymentConverter = {
  convertPayment,
  convertToPaymentRequest
};
