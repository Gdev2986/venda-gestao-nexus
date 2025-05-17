
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
  if (typeof status !== 'string') {
    status = status.toString();
  }
  
  switch (status.toUpperCase()) {
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
      return status;
  }
}
