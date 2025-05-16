
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { PaymentAction } from "@/types/enums";

interface PaymentListActionsProps {
  paymentId: string;
  isPending: boolean;
  isApproved: boolean;
  onAction: (paymentId: string, action: PaymentAction) => void;
}

export function PaymentListActions({
  paymentId,
  isPending,
  isApproved,
  onAction,
}: PaymentListActionsProps) {
  return (
    <div className="flex items-center justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Ações</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onAction(paymentId, PaymentAction.VIEW)}>
            Ver detalhes
          </DropdownMenuItem>
          
          {isPending && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onAction(paymentId, PaymentAction.APPROVE)}>
                Aprovar pagamento
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onAction(paymentId, PaymentAction.REJECT)}>
                Recusar pagamento
              </DropdownMenuItem>
            </>
          )}
          
          {isApproved && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onAction(paymentId, PaymentAction.SEND_RECEIPT)}>
                Enviar comprovante
              </DropdownMenuItem>
            </>
          )}
          
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onClick={() => onAction(paymentId, PaymentAction.DELETE)}
            className="text-red-600 hover:text-red-800 focus:text-red-800"
          >
            Excluir
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
