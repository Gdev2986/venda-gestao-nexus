
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { usePaymentActions } from "@/hooks/payments/usePaymentActions";
import { PaymentRequest } from "@/types/payment.types";
import { formatCurrency } from "@/lib/utils";

interface PaymentDetailsDialogProps {
  payment: PaymentRequest | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PaymentDetailsDialog = ({ 
  payment, 
  isOpen, 
  onOpenChange 
}: PaymentDetailsDialogProps) => {
  const { approvePayment, rejectPayment, isLoading } = usePaymentActions();

  if (!payment) return null;

  const handleApprove = async () => {
    await approvePayment(payment.id);
    onOpenChange(false);
  };

  const handleReject = async () => {
    await rejectPayment(payment.id);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Detalhes do Pagamento</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Valor</label>
            <p className="text-lg font-bold">{formatCurrency(payment.amount)}</p>
          </div>
          
          <div>
            <label className="text-sm font-medium">Status</label>
            <Badge variant="outline">{payment.status}</Badge>
          </div>
          
          <div>
            <label className="text-sm font-medium">Data</label>
            <p>{new Date(payment.created_at).toLocaleDateString()}</p>
          </div>
          
          {payment.status === "PENDING" && (
            <div className="flex gap-2">
              <Button 
                onClick={handleApprove} 
                disabled={isLoading}
                className="flex-1"
              >
                Aprovar
              </Button>
              <Button 
                variant="destructive"
                onClick={handleReject} 
                disabled={isLoading}
                className="flex-1"
              >
                Rejeitar
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
