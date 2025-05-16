
import { useState, useEffect } from "react";
import usePaymentsFetcher from "./usePaymentsFetcher";
import { PaymentStatus } from "@/types";
import { useToast } from "@/hooks/use-toast";

// Define payment actions - make sure it matches what's used in PaymentTableColumns
export enum PaymentAction {
  APPROVE = "approve",
  REJECT = "reject",
  VIEW = "view",
  DELETE = "delete"
}

// Define the hook props
interface UseAdminPaymentsProps {
  searchTerm?: string;
  statusFilter?: PaymentStatus | 'ALL';
  page?: number;
  pageSize?: number;
}

const useAdminPayments = ({
  searchTerm = '',
  statusFilter = 'ALL',
  page = 1,
  pageSize = 10
}: UseAdminPaymentsProps) => {
  const { toast } = useToast();
  const {
    paymentRequests: payments,
    isLoading,
    error,
    fetchPaymentRequests: refetch,
    totalPages
  } = usePaymentsFetcher({
    searchTerm,
    statusFilter,
    page,
    pageSize
  });

  // Function to handle payment actions (approve, reject, etc.)
  const performPaymentAction = (paymentId: string, action: PaymentAction) => {
    // In a real app, this would make an API call to perform the action
    
    switch (action) {
      case PaymentAction.APPROVE:
        toast({
          title: "Payment Approved",
          description: `Payment #${paymentId} has been approved.`
        });
        break;
      case PaymentAction.REJECT:
        toast({
          title: "Payment Rejected",
          description: `Payment #${paymentId} has been rejected.`
        });
        break;
      case PaymentAction.VIEW:
        toast({
          title: "Viewing Payment",
          description: `Viewing details for payment #${paymentId}.`
        });
        break;
      case PaymentAction.DELETE:
        toast({
          title: "Payment Deleted",
          description: `Payment #${paymentId} has been deleted.`
        });
        break;
      default:
        toast({
          variant: "destructive",
          title: "Invalid Action",
          description: `The action ${action} is not supported.`
        });
    }
    
    // Refetch data after action
    setTimeout(refetch, 1000);
  };

  return {
    payments,
    isLoading,
    error,
    totalPages,
    refetch,
    performPaymentAction
  };
};

export default useAdminPayments;
