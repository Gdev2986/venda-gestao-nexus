
import { usePaymentsFetcher } from "./usePaymentsFetcher";

export const useAdminPayments = (options = {}) => {
  return usePaymentsFetcher(options);
};

export default useAdminPayments;
