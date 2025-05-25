
import { usePaymentsFetcher } from "./usePaymentsFetcher";
import { PaymentStatus } from "@/types/payment.types";

export const useAdminPayments = (status?: PaymentStatus | "ALL") => {
  return usePaymentsFetcher({ status });
};
