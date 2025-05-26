
import { useState } from "react";
import { usePaymentsFetcher } from "./payments/usePaymentsFetcher";
import { usePaymentActions } from "./payments/usePaymentActions";

export const usePayments = (options = {}) => {
  const {
    paymentRequests,
    setPaymentRequests,
    isLoading,
    error,
    currentPage,
    totalPages,
    setCurrentPage,
    fetchPaymentRequests,
  } = usePaymentsFetcher(options);

  const { approvePayment, rejectPayment } = usePaymentActions();

  return {
    paymentRequests,
    isLoading,
    error,
    currentPage,
    totalPages,
    setCurrentPage,
    fetchPaymentRequests,
    approvePayment,
    rejectPayment,
    // Compatibility aliases
    payments: paymentRequests,
    loading: isLoading,
    refetch: fetchPaymentRequests
  };
};

export default usePayments;
