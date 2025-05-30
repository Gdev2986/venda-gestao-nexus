
import { PaymentRequestsTable } from "./PaymentRequestsTable";
import { PaymentRequest } from "@/types/payment.types";

interface PaymentHistoryCardProps {
  payments: PaymentRequest[];
  isLoading: boolean;
}

export const PaymentHistoryCard = ({ payments, isLoading }: PaymentHistoryCardProps) => {
  return (
    <PaymentRequestsTable 
      payments={payments} 
      isLoading={isLoading} 
    />
  );
};
