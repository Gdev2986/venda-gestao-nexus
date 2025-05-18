
import React, { useState } from "react";
import { PaymentDialogs } from "@/components/payments/PaymentDialogs";
import { PaymentRequest, Payment, PaymentStatus } from "@/types/payment.types";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { PaymentStatusBadge } from "./payment-list/PaymentStatusBadge";
import { Check, X, MoreVertical, Eye } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { useMediaQuery } from "@/hooks/use-media-query";
import { PaymentAction } from "@/types/enums";

export interface PaymentsProps {
  payments: Payment[];
  approvePayment?: (paymentId: string, receiptFile: File | null, notes: string) => Promise<any>;
  rejectPayment?: (paymentId: string, rejectionReason: string) => Promise<any>;
  isLoading: boolean;
  selectedStatus?: string;
  onActionClick?: (paymentId: string, action: PaymentAction) => void;
}

export function AdminPaymentsList({
  payments,
  approvePayment,
  rejectPayment,
  isLoading,
  selectedStatus,
  onActionClick
}: PaymentsProps) {
  const [selectedPayment, setSelectedPayment] = useState<PaymentRequest | Payment | null>(null);
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const isMobile = useMediaQuery("(max-width: 768px)");

  const handleApproveClick = (payment: PaymentRequest | Payment) => {
    setSelectedPayment(payment);
    setApproveDialogOpen(true);
  };

  const handleRejectClick = (payment: PaymentRequest | Payment) => {
    setSelectedPayment(payment);
    setRejectDialogOpen(true);
  };

  const handleViewClick = (payment: PaymentRequest | Payment) => {
    setSelectedPayment(payment);
    setDetailsDialogOpen(true);
  };

  const handleApprovePayment = async (
    paymentId: string,
    receiptFile: File | null,
    notes: string
  ) => {
    setIsProcessing(true);
    try {
      if (approvePayment) {
        await approvePayment(paymentId, receiptFile, notes);
      }
      setApproveDialogOpen(false);
      toast({
        title: "Pagamento aprovado",
        description: "O pagamento foi aprovado com sucesso."
      });
    } catch (error) {
      console.error("Error approving payment:", error);
      toast({
        title: "Erro ao aprovar pagamento",
        description:
          "Não foi possível aprovar o pagamento. Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRejectPayment = async (
    paymentId: string,
    rejectionReason: string
  ) => {
    setIsProcessing(true);
    try {
      if (rejectPayment) {
        await rejectPayment(paymentId, rejectionReason);
      }
      setRejectDialogOpen(false);
      toast({
        title: "Pagamento rejeitado",
        description: "O pagamento foi rejeitado com sucesso."
      });
    } catch (error) {
      console.error("Error rejecting payment:", error);
      toast({
        title: "Erro ao rejeitar pagamento",
        description:
          "Não foi possível rejeitar o pagamento. Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-center items-center h-32">
            <div className="spinner" />
            <p>Carregando pagamentos...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!payments || payments.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-center items-center h-32">
            <p>
              Nenhum pagamento encontrado com o status{" "}
              <strong>{selectedStatus}</strong>.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Fix payment properties to ensure they match required types
  const fixedPayments = payments.map(payment => {
    return {
      ...payment,
      rejection_reason: payment.rejection_reason || "",
      pix_key: payment.pix_key ? {
        ...payment.pix_key,
        owner_name: payment.pix_key.owner_name || payment.pix_key.name || ""
      } : undefined
    };
  });

  return (
    <>
      <Card>
        <CardContent className="pt-6 overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Valor</TableHead>
                {!isMobile && <TableHead>Data</TableHead>}
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fixedPayments.map((payment) => {
                const isPending = payment.status === PaymentStatus.PENDING;
                
                // Create compatible payment objects for actions
                const paymentForActions = {
                  ...payment,
                  description: payment.description || ""
                } as PaymentRequest;
                
                return (
                  <TableRow key={payment.id}>
                    <TableCell className="font-medium">
                      {payment.client?.business_name || "Cliente não encontrado"}
                    </TableCell>
                    <TableCell>{formatCurrency(payment.amount)}</TableCell>
                    {!isMobile && (
                      <TableCell>{formatDate(payment.created_at)}</TableCell>
                    )}
                    <TableCell>
                      <PaymentStatusBadge status={payment.status as PaymentStatus} />
                    </TableCell>
                    <TableCell>
                      {isMobile ? (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Ações</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => {
                              if (onActionClick) {
                                onActionClick(payment.id, PaymentAction.VIEW);
                              } else {
                                handleViewClick(payment);
                              }
                            }}>
                              <Eye className="mr-2 h-4 w-4" />
                              Visualizar
                            </DropdownMenuItem>
                            {isPending && (
                              <>
                                <DropdownMenuItem onClick={() => {
                                  if (onActionClick) {
                                    onActionClick(payment.id, PaymentAction.APPROVE);
                                  } else {
                                    handleApproveClick(paymentForActions);
                                  }
                                }}>
                                  <Check className="mr-2 h-4 w-4" />
                                  Aprovar
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => {
                                  if (onActionClick) {
                                    onActionClick(payment.id, PaymentAction.REJECT);
                                  } else {
                                    handleRejectClick(paymentForActions);
                                  }
                                }}>
                                  <X className="mr-2 h-4 w-4" />
                                  Rejeitar
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      ) : (
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              if (onActionClick) {
                                onActionClick(payment.id, PaymentAction.VIEW);
                              } else {
                                handleViewClick(payment);
                              }
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {isPending && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-green-600 border-green-600 hover:bg-green-50"
                                onClick={() => {
                                  if (onActionClick) {
                                    onActionClick(payment.id, PaymentAction.APPROVE);
                                  } else {
                                    handleApproveClick(paymentForActions);
                                  }
                                }}
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-600 border-red-600 hover:bg-red-50"
                                onClick={() => {
                                  if (onActionClick) {
                                    onActionClick(payment.id, PaymentAction.REJECT);
                                  } else {
                                    handleRejectClick(paymentForActions);
                                  }
                                }}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {onActionClick ? null : (
        <PaymentDialogs
          selectedPayment={selectedPayment}
          approveDialogOpen={approveDialogOpen}
          setApproveDialogOpen={setApproveDialogOpen}
          handleApprovePayment={handleApprovePayment}
          rejectDialogOpen={rejectDialogOpen}
          setRejectDialogOpen={setRejectDialogOpen}
          handleRejectPayment={handleRejectPayment}
          detailsDialogOpen={detailsDialogOpen}
          setDetailsDialogOpen={setDetailsDialogOpen}
          isProcessing={isProcessing}
        />
      )}
    </>
  );
}
