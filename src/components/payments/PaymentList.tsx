
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { usePaymentActions } from "@/hooks/payments/usePaymentActions";
import { PaymentRequest } from "@/types/payment.types";
import { formatCurrency } from "@/lib/utils";
import { PaymentDetailsDialog } from "./PaymentDetailsDialog";

interface PaymentListProps {
  payments: PaymentRequest[];
  isLoading: boolean;
}

export const PaymentList = ({ payments, isLoading }: PaymentListProps) => {
  const { deletePayment, sendReceipt, isLoading: actionsLoading } = usePaymentActions();
  const [selectedPayment, setSelectedPayment] = useState<PaymentRequest | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const handleViewDetails = (payment: PaymentRequest) => {
    setSelectedPayment(payment);
    setDetailsOpen(true);
  };

  if (isLoading) {
    return <div>Carregando pagamentos...</div>;
  }

  return (
    <>
      <div className="space-y-4">
        {payments.map((payment) => (
          <Card key={payment.id}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>{formatCurrency(payment.amount)}</span>
                <Badge variant="outline">{payment.status}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">
                  {new Date(payment.created_at).toLocaleDateString()}
                </p>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleViewDetails(payment)}
                  >
                    Ver Detalhes
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => deletePayment(payment.id)}
                    disabled={actionsLoading}
                  >
                    Excluir
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <PaymentDetailsDialog
        payment={selectedPayment}
        isOpen={detailsOpen}
        onOpenChange={setDetailsOpen}
      />
    </>
  );
};
