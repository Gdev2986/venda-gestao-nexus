
import { UsePaymentsOptions, PaymentData } from "./payments/payment.types";
import { usePaymentsFetcher } from "./payments/usePaymentsFetcher";
import { usePaymentActions } from "./payments/usePaymentActions";
import { usePaymentRealtimeSubscription } from "./payments/usePaymentRealtimeSubscription";

export { PaymentData } from "./payments/payment.types";

export function usePayments(options: UsePaymentsOptions = {}) {
  const {
    paymentRequests,
    setPaymentRequests,
    isLoading,
    error,
    currentPage,
    totalPages,
    setCurrentPage,
    fetchPaymentRequests
  } = usePaymentsFetcher(options);

  const { approvePayment, rejectPayment } = usePaymentActions(
    paymentRequests,
    setPaymentRequests
  );

  // Set up real-time subscription
  usePaymentRealtimeSubscription(fetchPaymentRequests);

  return {
    paymentRequests,
    isLoading,
    error,
    approvePayment,
    rejectPayment,
    refreshPayments: fetchPaymentRequests,
    currentPage,
    totalPages,
    setCurrentPage
  };
}
