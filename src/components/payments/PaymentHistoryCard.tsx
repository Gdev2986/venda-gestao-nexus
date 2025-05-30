
import { PaymentRequestsTable } from "./PaymentRequestsTable";
import { Payment } from "@/types";

interface PaymentHistoryCardProps {
  payments: Payment[];
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
