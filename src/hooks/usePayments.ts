
import { usePaymentsFetcher } from "./payments/usePaymentsFetcher";
import { PaymentStatus } from "@/types/payment.types";

export const usePayments = (status?: PaymentStatus | "ALL") => {
  return usePaymentsFetcher({ status });
};
