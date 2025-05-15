
import { useState, useEffect } from "react";
import { UsePaymentsOptions } from "./payments/payment.types";
import { usePaymentsFetcher } from "./payments/usePaymentsFetcher";
import { usePaymentActions } from "./payments/usePaymentActions";

export const usePayments = (options: UsePaymentsOptions = {}) => {
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

  const { approvePayment, rejectPayment } = usePaymentActions(
    paymentRequests,
    setPaymentRequests
  );

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
  };
};
