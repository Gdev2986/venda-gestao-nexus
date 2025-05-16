
import { toPaymentStatus } from "@/lib/type-utils";
import { PaymentStatus } from "@/types/enums";

// Function to filter payments by status
export const filterPaymentsByStatus = (payments: any[], statusFilter: string | null) => {
  if (!statusFilter || statusFilter === 'all') {
    return payments;
  }

  // Convert string status to enum value for type safety
  const status = toPaymentStatus(statusFilter);
  
  return payments.filter((payment) => {
    return payment.status === status;
  });
}
