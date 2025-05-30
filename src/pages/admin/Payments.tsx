
import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range";
import { AdminPaymentsList } from "@/components/payments/AdminPaymentsList";
import { PaymentDetailsModal } from "@/components/payments/PaymentDetailsModal";
import { useAdminPayments } from "@/hooks/payments/useAdminPayments";
import { PaymentStatus, PaymentAction } from "@/types/enums";
import { PaymentRequest, PaymentType } from "@/types/payment.types";
import { paymentService } from "@/services/payment.service";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import TablePagination from "@/components/ui/table-pagination";
import { addDays } from "date-fns";
import type { DateRange } from "react-day-picker";

const AdminPayments = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | "ALL">("ALL");
  const [typeFilter, setTypeFilter] = useState<PaymentType | "ALL">("ALL");
  const [page, setPage] = useState(1);
  const [selectedPayment, setSelectedPayment] = useState<PaymentRequest | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const pageSize = 10;
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Set default date range to today
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date()
  });
  
  const {
    payments,
    isLoading,
    error,
    totalPages,
    refetch
  } = useAdminPayments({
    searchTerm,
    statusFilter,
    startDate: dateRange?.from,
    endDate: dateRange?.to,
    page,
    pageSize
  });

  useEffect(() => {
    if (error) {
      toast({
        title: "Erro",
        description: `Erro ao carregar pagamentos: ${error}`,
        variant: "destructive"
      });
    }
  }, [error, toast]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  const handleStatusFilterChange = (status: PaymentStatus | "ALL") => {
    setStatusFilter(status);
    setPage(1);
  };

  const handleTypeFilterChange = (type: PaymentType | "ALL") => {
    setTypeFilter(type);
    setPage(1);
  };

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleActionClick = useCallback(async (paymentId: string, action: PaymentAction) => {
    if (action === PaymentAction.VIEW) {
      try {
        const payment = await paymentService.getPaymentRequestById(paymentId);
        if (payment) {
          setSelectedPayment(payment);
          setIsDetailsOpen(true);
        }
      } catch (error: any) {
        toast({
          title: "Erro",
          description: "Erro ao carregar detalhes do pagamento",
          variant: "destructive"
        });
      }
    }
  }, [toast]);

  const handleStatusChange = async (paymentId: string, status: PaymentStatus, notes?: string, receiptFile?: File) => {
    try {
      await paymentService.processPaymentRequest({
        payment_id: paymentId,
        status,
        notes,
        receipt_file: receiptFile
      });

      toast({
        title: "Status atualizado",
        description: `Pagamento ${status === PaymentStatus.APPROVED ? 'aprovado' : 'rejeitado'} com sucesso`
      });

      // Refresh data
      refetch();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao atualizar status do pagamento",
        variant: "destructive"
      });
      throw error;
    }
  };

  // Filter payments by type on the frontend since the hook doesn't support it yet
  const filteredPayments = payments?.filter(payment => 
    typeFilter === "ALL" || payment.payment_type === typeFilter
  ) || [];

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>Gerenciar Pagamentos</CardTitle>
          <CardDescription>
            Visualize, filtre e gerencie os pagamentos dos clientes.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Input
              type="search"
              placeholder="Buscar por cliente..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <Select
              value={statusFilter}
              onValueChange={value => handleStatusFilterChange(value as PaymentStatus | "ALL")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Todos os Status</SelectItem>
                <SelectItem value={PaymentStatus.PENDING}>Pendente</SelectItem>
                <SelectItem value={PaymentStatus.APPROVED}>Aprovado</SelectItem>
                <SelectItem value={PaymentStatus.REJECTED}>Rejeitado</SelectItem>
                <SelectItem value={PaymentStatus.PAID}>Pago</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={typeFilter}
              onValueChange={value => handleTypeFilterChange(value as PaymentType | "ALL")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Todos os Tipos</SelectItem>
                <SelectItem value="PIX">PIX</SelectItem>
                <SelectItem value="BOLETO">Boleto</SelectItem>
                <SelectItem value="TED">TED</SelectItem>
              </SelectContent>
            </Select>
            <DatePickerWithRange
              value={dateRange}
              onChange={handleDateRangeChange}
              className="w-full"
            />
          </div>

          <AdminPaymentsList
            payments={filteredPayments}
            isLoading={isLoading}
            selectedStatus={statusFilter}
            onActionClick={handleActionClick}
          />

          <TablePagination 
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />

          <div className="text-sm text-muted-foreground">
            Total de pagamentos: {filteredPayments.length}
          </div>
        </CardContent>
      </Card>

      <PaymentDetailsModal
        payment={selectedPayment}
        isOpen={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        canManage={true}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
};

export default AdminPayments;
