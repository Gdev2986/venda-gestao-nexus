
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Payment, PaymentStatus } from "@/types";
import { formatDate } from "@/lib/formatters";

export interface PaymentFormProps {
  payment: Payment;
}

export default function PaymentForm({ payment }: PaymentFormProps) {
  // Format currency helper
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    }).format(value);
  };

  // Helper function to render status badge
  const getStatusBadge = (status: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.PENDING:
        return <Badge variant="outline">Pendente</Badge>;
      case PaymentStatus.APPROVED:
        return <Badge variant="default">Aprovado</Badge>;
      case PaymentStatus.REJECTED:
        return <Badge variant="destructive">Rejeitado</Badge>;
      case PaymentStatus.PAID:
        return <Badge variant="secondary">Pago</Badge>;
      default:
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <dl className="space-y-3 text-sm">
            <div className="grid grid-cols-3 gap-1">
              <dt className="font-semibold">ID:</dt>
              <dd className="col-span-2 text-gray-700">{payment.id.substring(0, 8)}...</dd>
            </div>

            <div className="grid grid-cols-3 gap-1">
              <dt className="font-semibold">Valor:</dt>
              <dd className="col-span-2 font-bold text-lg">
                {formatCurrency(payment.amount)}
              </dd>
            </div>
            
            <div className="grid grid-cols-3 gap-1">
              <dt className="font-semibold">Descrição:</dt>
              <dd className="col-span-2">
                {payment.description || "Sem descrição"}
              </dd>
            </div>

            <div className="grid grid-cols-3 gap-1">
              <dt className="font-semibold">Data de criação:</dt>
              <dd className="col-span-2">
                {formatDate(new Date(payment.created_at))}
              </dd>
            </div>

            <div className="grid grid-cols-3 gap-1">
              <dt className="font-semibold">Data de vencimento:</dt>
              <dd className="col-span-2">
                {payment.due_date ? formatDate(new Date(payment.due_date)) : "Não definida"}
              </dd>
            </div>

            <div className="grid grid-cols-3 gap-1">
              <dt className="font-semibold">Status:</dt>
              <dd className="col-span-2">
                {getStatusBadge(payment.status)}
              </dd>
            </div>

            {payment.approved_at && (
              <div className="grid grid-cols-3 gap-1">
                <dt className="font-semibold">Aprovado em:</dt>
                <dd className="col-span-2">
                  {formatDate(new Date(payment.approved_at))}
                </dd>
              </div>
            )}
          </dl>
        </CardContent>
      </Card>
      
      {payment.receipt_url && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Comprovante de pagamento</h3>
          <div className="border rounded-md overflow-hidden">
            <a 
              href={payment.receipt_url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-full"
            >
              <img 
                src={payment.receipt_url} 
                alt="Comprovante de pagamento" 
                className="w-full h-auto object-cover"
              />
            </a>
          </div>
          <Button asChild variant="outline" size="sm" className="w-full">
            <a href={payment.receipt_url} target="_blank" rel="noopener noreferrer">
              Ver comprovante em tela cheia
            </a>
          </Button>
        </div>
      )}
    </div>
  );
}
