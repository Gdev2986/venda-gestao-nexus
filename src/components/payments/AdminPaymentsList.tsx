
import { createPaymentColumns } from "@/components/payments/PaymentTableColumns";
import { DataTable } from "@/components/ui/data-table";
import { PaymentData } from "@/hooks/payments/payment.types";
import { PaymentAction } from "@/components/payments/PaymentTableColumns";

interface AdminPaymentsListProps {
  paymentRequests: PaymentData[];
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onPaymentAction: (payment: PaymentData, action: PaymentAction) => void;
}

export const AdminPaymentsList = ({
  paymentRequests,
  isLoading,
  currentPage,
  totalPages,
  onPageChange,
  onPaymentAction
}: AdminPaymentsListProps) => {
  // Generate columns with the action handler
  const columns = createPaymentColumns({ 
    onPaymentAction 
  });

  return (
    <DataTable
      columns={columns}
      data={paymentRequests}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={onPageChange}
      isLoading={isLoading}
    />
  );
};
