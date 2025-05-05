import { Payment, PaymentStatus, PaymentType } from "@/types";

export const formatPaymentStatus = (status: string): PaymentStatus => {
  switch (status) {
    case "PENDING":
      return PaymentStatus.PENDING;
    case "APPROVED":
      return PaymentStatus.APPROVED;
    case "REJECTED":
      return PaymentStatus.REJECTED;
    case "PAID":
      return PaymentStatus.PAID;
    default:
      return PaymentStatus.PENDING;
  }
};

export const formatPaymentRequest = (item: any): Payment => {
  return {
    id: item.id,
    amount: item.amount,
    status: item.status,
    created_at: item.created_at,
    updated_at: item.updated_at,
    client_id: item.client_id,
    description: item.description || "",
    payment_type: PaymentType.PIX,
    client_name: item.client?.business_name,
    receipt_url: item.receipt_url,
    rejection_reason: item.rejection_reason || null,
    approved_at: item.approved_at,
    pix_key: item.pix_key ? {
      id: item.pix_key.id,
      key: item.pix_key.key,
      type: item.pix_key.type,
      owner_name: item.pix_key.name
    } : undefined
  };
};
