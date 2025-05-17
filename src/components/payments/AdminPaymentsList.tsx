import { useState, useEffect, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CheckIcon, CreditCardIcon, DollarSign, Delete, Edit, Eye, MoreHorizontal, RefreshCw, Send, Trash2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PaymentStatus, PaymentType, PaymentAction } from "@/types/enums";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useDialog } from "@/hooks/use-dialog";
import { PaymentData, PaymentRequest, BankInfo } from "@/types/payment.types";
import { ApprovePaymentDialog } from "@/components/payments/ApprovePaymentDialog";
import { RejectPaymentDialog } from "@/components/payments/RejectPaymentDialog";
import { PaymentDetailsDialog } from "@/components/payments/PaymentDetailsDialog";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Icons } from "@/components/ui/icons";
import { useBoolean } from "@/hooks/use-boolean";
import { SendPaymentReceipt } from "@/components/payments/SendPaymentReceipt";

interface PaymentsListProps {
  payments: PaymentData[];
  isLoading: boolean;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  onStatusFilterChange?: (status: string | undefined) => void;
  onSearchTermChange?: (term: string) => void;
  onRefresh?: () => void;
  onActionClick?: (paymentId: string, action: PaymentAction) => void;
}

const paymentStatusColors: { [key in PaymentStatus]: string } = {
  [PaymentStatus.PENDING]: "bg-gray-100 text-gray-500",
  [PaymentStatus.PROCESSING]: "bg-blue-100 text-blue-500",
  [PaymentStatus.APPROVED]: "bg-green-100 text-green-500",
  [PaymentStatus.REJECTED]: "bg-red-100 text-red-500",
  [PaymentStatus.PAID]: "bg-purple-100 text-purple-500",
};

const getPaymentMethodIcon = (method: string | PaymentType) => {
  switch (method) {
    case "CREDIT":
      return <CreditCardIcon className="h-4 w-4 mr-2" />;
    default:
      return <DollarSign className="h-4 w-4 mr-2" />;
  }
};

export function AdminPaymentsList({
  payments,
  isLoading,
  currentPage,
  totalPages,
  onPageChange,
  onStatusFilterChange,
  onSearchTermChange,
  onRefresh
}: PaymentsListProps) {
  const [selectedPayment, setSelectedPayment] = useState<PaymentData | null>(null);
  const [isProcessingMap, setIsProcessingMap] = useState<{ [paymentId: string]: boolean }>({});
  const { toast } = useToast();
  const approveDialog = useBoolean(false);
  const rejectDialog = useBoolean(false);
  const detailsDialog = useBoolean(false);
  const deleteDialog = useDialog();
  const sendReceiptDialog = useDialog();

  const openApproveDialog = (payment: PaymentData) => {
    setSelectedPayment(payment);
    approveDialog.setTrue();
  };

  const openRejectDialog = (payment: PaymentData) => {
    setSelectedPayment(payment);
    rejectDialog.setTrue();
  };

  const openDetailsDialog = (payment: PaymentData) => {
    setSelectedPayment(payment);
    detailsDialog.setTrue();
  };

  const handleDeletePayment = async (paymentId: string) => {
    deleteDialog.close();
    setIsProcessingMap(prev => ({ ...prev, [paymentId]: true }));
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    toast({
      title: "Pagamento excluído",
      description: "O pagamento foi excluído com sucesso."
    });
    setIsProcessingMap(prev => ({ ...prev, [paymentId]: false }));
  };

  const handleApprovePayment = async (paymentId: string, receiptFile: File | null, notes: string) => {
    approveDialog.setFalse();
    setIsProcessingMap(prev => ({ ...prev, [paymentId]: true }));
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    toast({
      title: "Pagamento aprovado",
      description: "O pagamento foi aprovado com sucesso."
    });
    setIsProcessingMap(prev => ({ ...prev, [paymentId]: false }));
  };

  const handleRejectPayment = async (paymentId: string, rejectionReason: string) => {
    rejectDialog.setFalse();
    setIsProcessingMap(prev => ({ ...prev, [paymentId]: true }));
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    toast({
      title: "Pagamento rejeitado",
      description: "O pagamento foi rejeitado com sucesso."
    });
    setIsProcessingMap(prev => ({ ...prev, [paymentId]: false }));
  };

  const handleSendReceipt = async (paymentId: string, email: string) => {
    sendReceiptDialog.close();
    setIsProcessingMap(prev => ({ ...prev, [paymentId]: true }));
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    toast({
      title: "Recibo enviado",
      description: `Recibo enviado para ${email} com sucesso.`
    });
    setIsProcessingMap(prev => ({ ...prev, [paymentId]: false }));
  };

  const approveButton = (payment: PaymentData) => {
    // Ensure bank_info has all required fields
    const paymentWithFullBankInfo = {
      ...payment,
      updated_at: payment.updated_at || payment.created_at,
      bank_info: payment.bank_info ? {
        bank_name: payment.bank_info.bank_name || "",
        branch_number: payment.bank_info.branch_number || "",
        account_number: payment.bank_info.account_number || "",
        account_holder: payment.bank_info.account_holder || "",
        ...payment.bank_info
      } as BankInfo : undefined
    };
    
    return (
      <Button
        size="sm"
        variant="default"
        onClick={() => openApproveDialog(paymentWithFullBankInfo)}
        disabled={isProcessingMap[payment.id]}
      >
        {isProcessingMap[payment.id] ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <CheckIcon className="mr-2 h-4 w-4" />
        )}
        Aprovar
      </Button>
    );
  };

  const rejectButton = (payment: PaymentData) => {
    // Ensure bank_info has all required fields
    const paymentWithFullBankInfo = {
      ...payment,
      updated_at: payment.updated_at || payment.created_at,
      bank_info: payment.bank_info ? {
        bank_name: payment.bank_info.bank_name || "",
        branch_number: payment.bank_info.branch_number || "",
        account_number: payment.bank_info.account_number || "",
        account_holder: payment.bank_info.account_holder || "",
        ...payment.bank_info
      } as BankInfo : undefined
    };
    
    return (
      <Button
        size="sm"
        variant="destructive"
        onClick={() => openRejectDialog(paymentWithFullBankInfo)}
        disabled={isProcessingMap[payment.id]}
      >
        {isProcessingMap[payment.id] ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <XCircle className="mr-2 h-4 w-4" />
        )}
        Rejeitar
      </Button>
    );
  };

  const detailsButton = (payment: PaymentData) => {
    // Ensure bank_info has all required fields
    const paymentWithFullBankInfo = {
      ...payment,
      updated_at: payment.updated_at || payment.created_at,
      bank_info: payment.bank_info ? {
        bank_name: payment.bank_info.bank_name || "",
        branch_number: payment.bank_info.branch_number || "",
        account_number: payment.bank_info.account_number || "",
        account_holder: payment.bank_info.account_holder || "",
        ...payment.bank_info
      } as BankInfo : undefined
    };
    
    return (
      <Button
        size="sm"
        variant="ghost"
        onClick={() => openDetailsDialog(paymentWithFullBankInfo)}
      >
        <Eye className="mr-2 h-4 w-4" />
        Detalhes
      </Button>
    );
  };

  const deleteButton = (payment: PaymentData) => {
    // Ensure bank_info has all required fields
    const paymentWithFullBankInfo = {
      ...payment,
      updated_at: payment.updated_at || payment.created_at,
      bank_info: payment.bank_info ? {
        bank_name: payment.bank_info.bank_name || "",
        branch_number: payment.bank_info.branch_number || "",
        account_number: payment.bank_info.account_number || "",
        account_holder: payment.bank_info.account_holder || "",
        ...payment.bank_info
      } as BankInfo : undefined
    };
    
    return (
      <DropdownMenuItem onClick={() => deleteDialog.open()}>
        <Trash2 className="mr-2 h-4 w-4" />
        Excluir
      </DropdownMenuItem>
    );
  };

  
  return (
    <>
      <Card className="col-span-1 lg:col-span-full">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0 p-4 sm:p-6">
          <CardTitle>Lista de Pagamentos</CardTitle>
          <div className="w-full sm:w-auto flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 items-center">
            <Input
              placeholder="Buscar..."
              className="w-full sm:w-[250px]"
              onChange={(e) => onSearchTermChange?.(e.target.value)}
            />
            <Button size="sm" onClick={onRefresh} disabled={isLoading}>
              {isLoading ? (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="mr-2 h-4 w-4" />
              )}
              Atualizar
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="w-full overflow-auto">
            {isLoading ? (
              <div className="space-y-4 p-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-4 bg-muted animate-pulse rounded" />
                    <div className="h-4 bg-muted animate-pulse rounded w-5/6" />
                  </div>
                ))}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-medium">{payment.client?.business_name}</TableCell>
                      <TableCell>{new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(payment.amount)}</TableCell>
                      <TableCell>{format(new Date(payment.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}</TableCell>
                      <TableCell>
                        <Badge className={paymentStatusColors[payment.status as PaymentStatus]}>
                          {payment.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Abrir menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Ações</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => sendReceiptDialog.open()}>
                              <Send className="mr-2 h-4 w-4" />
                              Enviar Recibo
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {approveButton(payment)}
                            {rejectButton(payment)}
                            <DropdownMenuSeparator />
                            {detailsButton(payment)}
                            {deleteButton(payment)}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </CardContent>
        <div className="flex items-center justify-between px-6 py-4">
          <div className="text-sm text-muted-foreground">
            Total de pagamentos: {payments.length}
          </div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage && currentPage > 1 && onPageChange) onPageChange(currentPage - 1);
                  }}
                />
              </PaginationItem>
              {currentPage && currentPage > 2 && (
                <PaginationItem>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (onPageChange) onPageChange(1);
                    }}
                  >
                    1
                  </PaginationLink>
                </PaginationItem>
              )}
              {currentPage && currentPage > 3 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}
              {totalPages && currentPage && Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNumber;

                if (totalPages <= 5) {
                  pageNumber = i + 1;
                } else if (currentPage <= 3) {
                  pageNumber = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNumber = totalPages - 4 + i;
                } else {
                  pageNumber = currentPage - 2 + i;
                }

                return (
                  <PaginationItem key={pageNumber}>
                    <PaginationLink
                      href="#"
                      isActive={pageNumber === currentPage}
                      onClick={(e) => {
                        e.preventDefault();
                        if (onPageChange) onPageChange(pageNumber);
                      }}
                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
              {currentPage && totalPages && currentPage < totalPages - 2 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}
              {currentPage && totalPages && currentPage < totalPages - 1 && (
                <PaginationItem>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (onPageChange) onPageChange(totalPages);
                    }}
                  >
                    {totalPages}
                  </PaginationLink>
                </PaginationItem>
              )}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage && totalPages && currentPage < totalPages && onPageChange) onPageChange(currentPage + 1);
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </Card>

      {/* Dialogs */}
      {selectedPayment && (
        <ApprovePaymentDialog
          open={approveDialog.value}
          onOpenChange={approveDialog.setFalse}
          payment={selectedPayment}
          onApprove={handleApprovePayment}
          isProcessing={isProcessingMap[selectedPayment.id] || false}
        />
      )}

      {selectedPayment && (
        <RejectPaymentDialog
          open={rejectDialog.value}
          onOpenChange={rejectDialog.setFalse}
          payment={selectedPayment}
          onReject={handleRejectPayment}
          isProcessing={isProcessingMap[selectedPayment.id] || false}
        />
      )}

      {selectedPayment && (
        <PaymentDetailsDialog
          open={detailsDialog.value}
          onOpenChange={detailsDialog.setFalse}
          payment={selectedPayment}
        />
      )}

      {selectedPayment && (
        <SendPaymentReceipt
          open={sendReceiptDialog.isOpen}
          onOpenChange={sendReceiptDialog.close}
          payment={selectedPayment}
          onSubmit={handleSendReceipt}
          isProcessing={isProcessingMap[selectedPayment.id] || false}
        />
      )}
    </>
  );
}
