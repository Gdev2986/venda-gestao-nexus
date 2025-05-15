
// Re-export the hook with fix for string vs enum
import { usePaymentsFetcher } from "./usePaymentsFetcher";
import { usePaymentActions } from "./usePaymentActions";
import { usePaymentRealtimeSubscription } from "./usePaymentRealtimeSubscription";
import { useState } from "react";
import { PaymentStatusFilter } from "./payment.types";

export const useAdminPayments = () => {
  const [filter, setFilter] = useState<PaymentStatusFilter>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const {
    payments,
    isLoading,
    totalPages,
    fetchPayments,
    refreshPayments,
  } = usePaymentsFetcher({
    page,
    pageSize,
    filterStatus: filter !== "all" ? filter as string : undefined, // Fix type error with string cast
    searchTerm,
  });

  const { handleAction } = usePaymentActions({
    onSuccess: refreshPayments,
  });

  // Set up realtime subscription for new payments
  usePaymentRealtimeSubscription({
    onEvent: refreshPayments,
  });

  return {
    payments,
    isLoading,
    totalPages,
    currentPage: page,
    filter,
    searchTerm,
    setFilter,
    setSearchTerm,
    setPage,
    fetchPayments,
    refreshPayments,
    handleAction,
  };
};

export default useAdminPayments;
