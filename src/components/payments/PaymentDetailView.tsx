
import { formatCurrency } from "@/lib/formatters";
import { formatDate } from "./PaymentTableColumns";
import { PaymentData } from "@/hooks/payments/payment.types";
import { Card, CardContent } from "@/components/ui/card";

interface PaymentDetailViewProps {
  payment: PaymentData;
}

export function PaymentDetailView({ payment }: PaymentDetailViewProps) {
  return (
    <Card className="bg-muted/50">
      <CardContent className="p-4 space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <p className="text-xs text-muted-foreground">Cliente</p>
            <p className="font-medium truncate">
              {payment.client?.business_name || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Valor</p>
            <p className="font-medium">{formatCurrency(payment.amount)}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <div>
            <p className="text-xs text-muted-foreground">Data da Solicitação</p>
            <p className="text-sm">{formatDate(payment.created_at)}</p>
          </div>
          
          <div>
            <p className="text-xs text-muted-foreground">Método de Pagamento</p>
            <p className="text-sm">
              {payment.pix_key ? "PIX" : 
               payment.payment_type === 'TED' ? "TED" :
               payment.payment_type === 'BOLETO' ? "Boleto" : "Não especificado"}
            </p>
          </div>
        </div>

        {payment.description && (
          <div>
            <p className="text-xs text-muted-foreground">Descrição</p>
            <p className="text-sm">{payment.description}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
