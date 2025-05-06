
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { PaymentDetailView } from "./PaymentDetailView";
import { PaymentData } from "@/hooks/payments/payment.types";
import { formatCurrency } from "@/lib/formatters";

interface PaymentDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payment: PaymentData | null;
}

export function PaymentDetailsDialog({
  open,
  onOpenChange,
  payment
}: PaymentDetailsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Detalhes do Pagamento</DialogTitle>
          <DialogDescription>
            Visualize os detalhes completos desta solicitação de{" "}
            {payment ? formatCurrency(payment.amount) : ""}
          </DialogDescription>
        </DialogHeader>

        {payment && <PaymentDetailView payment={payment} />}

        {payment?.receipt_url && (
          <div className="mt-4">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => window.open(payment.receipt_url, "_blank")}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Visualizar Comprovante
            </Button>
          </div>
        )}

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Fechar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
