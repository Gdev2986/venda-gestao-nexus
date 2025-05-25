
import { Payment, PaymentRequest } from "@/types/payment.types";
import { PaymentStatus } from "@/types/enums";

/**
 * Converts a PaymentRequest object to a Payment object
 * @param request PaymentRequest object from API
 * @returns Payment object compatible with UI components
 */
export const convertRequestToPayment = (request: any): Payment => {
  const payment: Payment = {
    id: request.id,
    client_id: request.client_id,
    amount: request.amount,
    status: request.status,
    approved_by: request.approved_by || undefined,
    approved_at: request.approved_at || undefined,
    created_at: request.created_at,
    updated_at: request.updated_at || undefined,
    receipt_url: request.receipt_url || undefined,
    description: request.description || "",
    rejection_reason: request.rejection_reason || "",
    payment_type: request.payment_type,
    client: request.client || undefined
  };

  // Add pix_key if available
  if (request.pix_key) {
    payment.pix_key = {
      id: request.pix_key.id,
      key: request.pix_key.key,
      type: request.pix_key.type,
      name: request.pix_key.name,
      owner_name: request.pix_key.owner_name || request.pix_key.name,
      user_id: request.pix_key.user_id || "default-user-id" // Adding required user_id field
    };
    
    // Only add optional properties if they exist
    if ('is_default' in request.pix_key) {
      payment.pix_key.is_default = request.pix_key.is_default;
    }
    
    if ('bank_name' in request.pix_key) {
      payment.pix_key.bank_name = request.pix_key.bank_name;
    }
  }

  return payment;
};

/**
 * Gets an appropriate color based on payment status
 */
export const getPaymentStatusColor = (status: PaymentStatus) => {
  switch (status) {
    case PaymentStatus.PENDING:
      return "bg-yellow-100 text-yellow-800";
    case PaymentStatus.PROCESSING:
      return "bg-blue-100 text-blue-800";
    case PaymentStatus.APPROVED:
      return "bg-green-100 text-green-800";
    case PaymentStatus.REJECTED:
      return "bg-red-100 text-red-800";
    case PaymentStatus.PAID:
      return "bg-purple-100 text-purple-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};
