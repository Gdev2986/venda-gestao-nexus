
import { useState } from "react";
import { usePaymentRequestsFetcher } from "./usePaymentRequestsFetcher";
import { usePixKeys } from "./usePixKeys";
import { usePaymentRequestManager } from "./usePaymentRequestManager";
import { usePaymentSubscription } from "./usePaymentSubscription";

export const usePaymentRequests = (initialBalance: number = 15000) => {
  const {
    isLoading,
    clientBalance,
    paymentRequests,
    setPaymentRequests,
    loadPaymentRequests
  } = usePaymentRequestsFetcher(initialBalance);
  
  const { pixKeys, isLoadingPixKeys } = usePixKeys();
  
  const {
    isDialogOpen,
    setIsDialogOpen,
    handleRequestPayment
  } = usePaymentRequestManager(pixKeys, paymentRequests, setPaymentRequests);
  
  // Set up the subscription to payment changes
  usePaymentSubscription(loadPaymentRequests);

  return {
    isLoading,
    clientBalance,
    paymentRequests,
    isDialogOpen,
    setIsDialogOpen,
    handleRequestPayment,
    pixKeys,
    isLoadingPixKeys
  };
};
