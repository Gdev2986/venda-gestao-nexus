
import { UsePaymentsOptions } from "./payments/payment.types";
import { useAdminPayments } from "./payments/useAdminPayments";
import { usePaymentActions } from "./payments/usePaymentActions";
import { usePaymentRealtimeSubscription } from "./payments/usePaymentRealtimeSubscription";

// Use 'export type' for re-exporting types when isolatedModules is enabled
export type { PaymentData } from "./payments/payment.types";

export function usePayments(options: UsePaymentsOptions = {}) {
  // Use useAdminPayments for now as it's what's available
  const { payments, isLoading, error, refetch } = useAdminPayments(options.statusFilter || 'ALL');

  // Set up real-time subscription if needed
  usePaymentRealtimeSubscription(refetch);

  // Since usePaymentActions expects different parameters, we're not using it for now
  // This should be refactored properly in a separate task
  
  return {
    paymentRequests: payments,
    isLoading,
    error,
    refreshPayments: refetch,
  };
}
