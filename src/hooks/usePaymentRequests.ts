
import { useState } from "react";
import { usePaymentRequestsFetcher } from "./usePaymentRequestsFetcher";
import { usePixKeys } from "./usePixKeys";
import { usePaymentRequestManager } from "./usePaymentRequestManager";

export const usePaymentRequests = (initialBalance: number = 15000) => {
  const {
    isLoading,
    paymentRequests,
    loadPaymentRequests
  } = usePaymentRequestsFetcher();
  
  const { pixKeys, isLoadingPixKeys } = usePixKeys();
  
  const {
    isDialogOpen,
    setIsDialogOpen,
    handleRequestPayment
  } = usePaymentRequestManager();
  
  return {
    isLoading,
    clientBalance: initialBalance,
    paymentRequests,
    isDialogOpen,
    setIsDialogOpen,
    handleRequestPayment,
    pixKeys,
    isLoadingPixKeys,
    loadPaymentRequests
  };
};
