
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { formatDate } from "@/lib/formatters";
import { PaymentStatus, PaymentAction } from "@/types/enums";
import { Eye, CheckCircle, XCircle, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { usePermissions } from "@/hooks/use-permissions";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface Payment {
  id: string;
  client_name?: string;
  amount: number;
  status: PaymentStatus;
  created_at: string;
  client_id?: string;
  updated_at?: string;
}

interface AdminPaymentsListProps {
  payments: Payment[];
  isLoading: boolean;
  selectedStatus: PaymentStatus | "ALL";
  onActionClick: (paymentId: string, action: PaymentAction) => void;
}

// Helper function to get badge color based on status
const getStatusBadge = (status: PaymentStatus) => {
  switch (status) {
    case PaymentStatus.APPROVED:
      return (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          Aprovado
        </Badge>
      );
    case PaymentStatus.REJECTED:
      return (
        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
          Rejeitado
        </Badge>
      );
    case PaymentStatus.PAID:
      return (
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          Pago
        </Badge>
      );
    case PaymentStatus.PENDING:
    default:
      return (
        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
          Pendente
        </Badge>
      );
  }
};

export function AdminPaymentsList({
  payments,
  isLoading,
  selectedStatus,
  onActionClick,
}: AdminPaymentsListProps) {
  const { hasPermission } = usePermissions();
  const [lastUpdated, setLastUpdated] = useState<{[key: string]: string}>({});
  
  // Track real-time updates on payments
  const isRecentlyUpdated = (payment: Payment) => {
    if (!payment.updated_at || !lastUpdated[payment.id]) return false;
    
    // Consider updated in the last 5 seconds as "recent"
    const now = new Date();
    const updated = new Date(payment.updated_at);
    const diff = Math.abs(now.getTime() - updated.getTime()) / 1000;
    
    return diff < 5; // 5 seconds
  };

  if (isLoading) {
    return <div className="text-center py-8">Carregando pagamentos...</div>;
  }

  if (payments.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Nenhum pagamento encontrado.
      </div>
    );
  }

  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead className="text-right">Valor</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="hidden md:table-cell">Data</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.map((payment) => (
            <TableRow 
              key={payment.id} 
              className={isRecentlyUpdated(payment) ? 'bg-yellow-50 transition-colors duration-1000' : ''}
            >
              <TableCell className="font-mono text-xs">
                {payment.id.substring(0, 8)}...
              </TableCell>
              <TableCell>{payment.client_name || `Cliente ${payment.client_id?.substring(0, 3)}`}</TableCell>
              <TableCell className="text-right font-medium">
                {formatCurrency(payment.amount)}
              </TableCell>
              <TableCell className="text-center">
                {getStatusBadge(payment.status)}
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {formatDate(new Date(payment.created_at))}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onActionClick(payment.id, PaymentAction.VIEW)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Ver detalhes</p>
                      </TooltipContent>
                    </Tooltip>
                  
                    {payment.status === PaymentStatus.PENDING && hasPermission('APPROVE_PAYMENTS') && (
                      <>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-green-600"
                              onClick={() => onActionClick(payment.id, PaymentAction.APPROVE)}
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Aprovar pagamento</p>
                          </TooltipContent>
                        </Tooltip>
                        
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-600"
                              onClick={() => onActionClick(payment.id, PaymentAction.REJECT)}
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Rejeitar pagamento</p>
                          </TooltipContent>
                        </Tooltip>
                      </>
                    )}
                    
                    {payment.status === PaymentStatus.APPROVED && hasPermission('APPROVE_PAYMENTS') && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-blue-600"
                            onClick={() => onActionClick(payment.id, PaymentAction.SEND_RECEIPT)}
                          >
                            <FileText className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Enviar comprovante</p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </TooltipProvider>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
