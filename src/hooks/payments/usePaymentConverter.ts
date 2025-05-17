
import { PaymentRequestStatus } from '@/types/payment.types';
import { PaymentStatus } from '@/types/enums';

/**
 * Converts string payment request status to database-compatible enum value
 */
export function convertPaymentStatusToDbFormat(status: string): PaymentStatus {
  switch (status.toUpperCase()) {
    case 'PENDING':
    case 'PENDENTE':
      return PaymentStatus.PENDING;
    case 'APPROVED':
    case 'APROVADO':
      return PaymentStatus.APPROVED;
    case 'REJECTED':
    case 'RECUSADO':
      return PaymentStatus.REJECTED;
    case 'PAID':
    case 'PAGO':
      return PaymentStatus.PAID;
    case 'PROCESSING':
    case 'EM_PROCESSAMENTO':
      return PaymentStatus.PROCESSING;
    default:
      return PaymentStatus.PENDING;
  }
}

/**
 * Converts enum payment status to UI-friendly string
 */
export function convertPaymentStatusToUiFormat(status: PaymentStatus | string): string {
  // Convert status to uppercase string to handle both enum and string types
  let statusStr: string;
  
  if (typeof status === 'string') {
    statusStr = status.toUpperCase();
  } else {
    // Safely convert enum to string if it's not already a string
    statusStr = String(status).toUpperCase();
  }
  
  switch (statusStr) {
    case PaymentStatus.PENDING:
      return 'Pendente';
    case PaymentStatus.APPROVED:
      return 'Aprovado';
    case PaymentStatus.REJECTED:
      return 'Recusado';
    case PaymentStatus.PAID:
      return 'Pago';
    case PaymentStatus.PROCESSING:
      return 'Em Processamento';
    default:
      return String(status); // Return as is if not matched
  }
}
