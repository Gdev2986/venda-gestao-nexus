
import { Payment } from "@/types";
import { PaymentData } from "@/types/payment.types";
import { PixKeyType } from "@/types";

/**
 * Converte um objeto Payment para PaymentRequest/PaymentData
 * Isso é necessário para garantir compatibilidade entre as diferentes interfaces
 */
export function convertToPaymentRequest(payment: Payment): PaymentData {
  return {
    id: payment.id,
    client_id: payment.client_id,
    amount: payment.amount,
    description: payment.description || "",
    status: payment.status,  // Now using string status for compatibility
    pix_key_id: payment.pix_key?.id || undefined,
    created_at: payment.created_at,
    updated_at: payment.updated_at || payment.created_at,
    approved_at: payment.approved_at || null,
    approved_by: payment.approved_by || null,
    receipt_url: payment.receipt_url || null,
    rejection_reason: payment.rejection_reason || null,
    pix_key: payment.pix_key ? {
      id: payment.pix_key.id || "",
      key: payment.pix_key.key || "",
      type: payment.pix_key.type || "",
      owner_name: payment.pix_key.owner_name || "",
      // Cast key_type to PixKeyType if it exists, otherwise undefined
      key_type: payment.pix_key.key_type as PixKeyType | undefined,
      name: payment.pix_key.owner_name || ""
    } : undefined,
    client: payment.client,
    payment_type: payment.payment_type,
    due_date: payment.due_date,
    bank_info: payment.bank_info ? {
      bank_name: payment.bank_info.bank_name || "",
      branch_number: payment.bank_info.branch_number || "",
      account_number: payment.bank_info.account_number || "",
      account_holder: payment.bank_info.account_holder || ""
    } : undefined,
    document_url: payment.document_url
  };
}

/**
 * Verifica se um objeto tem a estrutura de um PaymentRequest
 */
export function isPaymentRequest(obj: any): boolean {
  return obj && 
    typeof obj === 'object' && 
    'id' in obj && 
    'client_id' in obj && 
    'amount' in obj && 
    'status' in obj &&
    'created_at' in obj;
}
