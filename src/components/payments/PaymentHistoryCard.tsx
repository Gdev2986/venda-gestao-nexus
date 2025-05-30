
import { PaymentRequestsTable } from "./PaymentRequestsTable";
import { PaymentRequest } from "@/types/payment.types";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { History } from "lucide-react";

interface PaymentHistoryCardProps {
  payments: PaymentRequest[];
  isLoading: boolean;
}

export const PaymentHistoryCard = ({ payments, isLoading }: PaymentHistoryCardProps) => {
  return (
    <>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5" />
          Histórico de Solicitações
        </CardTitle>
      </CardHeader>
      <CardContent>
        <PaymentRequestsTable 
          payments={payments} 
          isLoading={isLoading} 
        />
      </CardContent>
    </>
  );
};
