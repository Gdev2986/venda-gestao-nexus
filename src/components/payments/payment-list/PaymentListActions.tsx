
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Eye, Check, X, MoreHorizontal } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Payment, PaymentStatus } from '@/types';
import { PaymentAction } from '../PaymentTableColumns';

interface PaymentListActionsProps {
  payment: Payment;
  onOpenDetails: (payment: Payment) => void;
  onOpenApprove: (payment: Payment) => void;
  onOpenReject: (payment: Payment) => void;
}

export const PaymentListActions = ({
  payment,
  onOpenDetails,
  onOpenApprove,
  onOpenReject
}: PaymentListActionsProps) => {
  return (
    <div className="flex space-x-2">
      <Button
        size="sm"
        variant="outline"
        onClick={() => onOpenDetails(payment)}
      >
        <Eye className="h-4 w-4 mr-1" />
        Ver
      </Button>
      
      {payment.status === PaymentStatus.PENDING && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="outline">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onOpenApprove(payment)}>
              <Check className="h-4 w-4 mr-2" />
              <span>Aprovar</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onOpenReject(payment)}>
              <X className="h-4 w-4 mr-2" />
              <span>Rejeitar</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};
