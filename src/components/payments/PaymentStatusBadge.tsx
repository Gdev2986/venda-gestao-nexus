
import { Badge } from "@/components/ui/badge";
import { PaymentStatus } from "@/types";
import { Check, Clock, X } from "lucide-react";

interface PaymentStatusBadgeProps {
  status: PaymentStatus;
}

export const PaymentStatusBadge = ({ status }: PaymentStatusBadgeProps) => {
  switch (status) {
    case PaymentStatus.PENDING:
      return (
        <Badge className="bg-yellow-100 text-yellow-800 flex items-center gap-1">
          <Clock className="h-3 w-3" />
          Pendente
        </Badge>
      );
    case PaymentStatus.APPROVED:
      return (
        <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
          <Check className="h-3 w-3" />
          Aprovado
        </Badge>
      );
    case PaymentStatus.REJECTED:
      return (
        <Badge className="bg-red-100 text-red-800 flex items-center gap-1">
          <X className="h-3 w-3" />
          Rejeitado
        </Badge>
      );
    case PaymentStatus.PAID:
      return (
        <Badge className="bg-blue-100 text-blue-800 flex items-center gap-1">
          <Check className="h-3 w-3" />
          Pago
        </Badge>
      );
    default:
      return <Badge variant="outline">Desconhecido</Badge>;
  }
};
