import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Payment } from "@/types/payment.types";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useAuth } from "@/hooks/use-auth";
import { Badge } from "@/components/ui/badge";
import { PaymentReceiptUploader } from "@/components/payments/PaymentReceiptUploader";
import { PaymentReceiptViewer } from "@/components/payments/PaymentReceiptViewer";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface PaymentDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payment: Payment | null;
}

export const PaymentDetailsDialog = ({
  open,
  onOpenChange,
  payment,
}: PaymentDetailsDialogProps) => {
  const { user, userRole } = useAuth();
  const { toast } = useToast();
  const [refresh, setRefresh] = useState(false);

  const refreshPayment = () => {
    setRefresh(!refresh);
  };

  useEffect(() => {
    if (payment?.id) {
      fetchPaymentDetails();
    }
  }, [payment?.id, refresh]);

  const fetchPaymentDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('payment_requests')
        .select(`
          id,
          amount,
          description,
          status,
          pix_key_id,
          created_at,
          updated_at,
          approved_at,
          approved_by,
          receipt_url,
          rejection_reason,
          client_id,
          pix_key:pix_keys (
            id, 
            key,
            type,
            name
          )
        `)
        .eq('id', payment.id)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      // TODO: Update payment details in the parent component
      // This might involve a callback function to update the state in the parent
      console.log("Payment details refreshed:", data);
    } catch (err: any) {
      console.error('Error fetching payment details:', err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to refresh payment data"
      });
    }
  };

  if (!payment) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Detalhes da Solicitação de Pagamento</DialogTitle>
          <DialogDescription>
            Visualize os detalhes da solicitação de pagamento.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-sm font-medium leading-none">ID</div>
              <div className="text-sm text-muted-foreground">{payment.id}</div>
            </div>
            <div>
              <div className="text-sm font-medium leading-none">Status</div>
              <div className="text-sm text-muted-foreground">
                <Badge variant="secondary">{payment.status}</Badge>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-sm font-medium leading-none">Valor</div>
              <div className="text-sm text-muted-foreground">
                {payment.amount.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </div>
            </div>
            <div>
              <div className="text-sm font-medium leading-none">Data de Criação</div>
              <div className="text-sm text-muted-foreground">
                {format(new Date(payment.created_at), "dd/MM/yyyy HH:mm", {
                  locale: ptBR,
                })}
              </div>
            </div>
          </div>

          <div>
            <div className="text-sm font-medium leading-none">Descrição</div>
            <div className="text-sm text-muted-foreground">
              {payment.description}
            </div>
          </div>

          {payment.pix_key && (
            <div>
              <div className="text-sm font-medium leading-none">Chave Pix</div>
              <div className="text-sm text-muted-foreground">
                {payment.pix_key.key} ({payment.pix_key.type})
              </div>
            </div>
          )}

          {payment.rejection_reason && (
            <div>
              <div className="text-sm font-medium leading-none">
                Motivo da Rejeição
              </div>
              <div className="text-sm text-muted-foreground">
                {payment.rejection_reason}
              </div>
            </div>
          )}

          {payment.receipt_url && (
            <PaymentReceiptViewer receiptUrl={payment.receipt_url} />
          )}

          {userRole === 'ADMIN' && payment.status === 'APPROVED' && !payment.receipt_url && (
            <PaymentReceiptUploader
              paymentId={payment.id}
              onSuccess={() => refreshPayment()}
              onCancel={() => refreshPayment()}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
