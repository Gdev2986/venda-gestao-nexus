
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { PaymentStatus } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle2, AlertCircle, FileCheck } from "lucide-react";

type Payment = {
  id: string;
  amount: number;
  description: string;
  status: PaymentStatus;
  created_at: string;
  due_date: string;
  receipt_url?: string;
  approved_at?: string;
};

interface PaymentFormProps {
  payment: Payment;
}

const PaymentForm = ({ payment }: PaymentFormProps) => {
  const getStatusBadge = (status: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.PENDING:
        return <Badge variant="outline" className="flex gap-1 items-center"><Clock className="h-3 w-3" /> Pendente</Badge>;
      case PaymentStatus.APPROVED:
        return <Badge variant="default" className="flex gap-1 items-center"><CheckCircle2 className="h-3 w-3" /> Aprovado</Badge>;
      case PaymentStatus.REJECTED:
        return <Badge variant="destructive" className="flex gap-1 items-center"><AlertCircle className="h-3 w-3" /> Rejeitado</Badge>;
      case PaymentStatus.PAID:
        return <Badge variant="secondary" className="flex gap-1 items-center"><FileCheck className="h-3 w-3" /> Pago</Badge>;
      default:
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Descrição</p>
          <p>{payment.description}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">Valor</p>
          <p className="font-bold">{formatCurrency(payment.amount)}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">Data de Criação</p>
          <p>{formatDate(payment.created_at)}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">Data de Vencimento</p>
          <p>{formatDate(payment.due_date)}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">Status</p>
          <div className="mt-1">{getStatusBadge(payment.status)}</div>
        </div>
      </div>

      {payment.receipt_url && (
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-2">Comprovante</p>
          <a 
            href={payment.receipt_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center text-primary hover:underline"
          >
            <FileCheck className="mr-2 h-4 w-4" />
            Ver comprovante
          </a>
        </div>
      )}
    </div>
  );
};

export default PaymentForm;
