import React, { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { AdminPaymentsList } from "@/components/payments/AdminPaymentsList";
import { useAdminPayments } from "@/hooks/payments/useAdminPayments";
import { PaymentStatus, PaymentAction } from "@/types/enums";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const AdminPayments = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | "ALL">(
    "ALL"
  );
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const navigate = useNavigate();
  const { toast } = useToast();

  const {
    payments,
    isLoading,
    error,
    totalPages,
    refetch,
    performPaymentAction,
  } = useAdminPayments({
    searchTerm,
    statusFilter,
    page,
    pageSize,
  });

  useEffect(() => {
    if (error) {
      toast({
        title: "Erro",
        description: `Erro ao carregar pagamentos: ${error}`,
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPage(1); // Reset to the first page when searching
  };

  const handleStatusFilterChange = (status: PaymentStatus | "ALL") => {
    setStatusFilter(status);
    setPage(1); // Reset to the first page when filtering
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleActionClick = useCallback(
    (paymentId: string, action: PaymentAction) => {
      if (action === PaymentAction.VIEW) {
        navigate(`/admin/payments/${paymentId}`);
      } else {
        performPaymentAction(paymentId, action);
      }
    },
    [navigate, performPaymentAction]
  );

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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              type="search"
              placeholder="Buscar por cliente..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <Select
              value={statusFilter}
              onValueChange={(value) =>
                handleStatusFilterChange(value as PaymentStatus | "ALL")
              }
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
          </div>

          <AdminPaymentsList
            payments={payments || []}
            isLoading={isLoading}
            selectedStatus={statusFilter}
            onActionClick={handleActionClick}
          />

          {payments && payments.length > 0 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <Button
                    variant="outline"
                    className="h-9 w-9"
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                  >
                    <PaginationPrevious className="h-4 w-4" />
                  </Button>
                </PaginationItem>
                <PaginationItem>
                  <Button
                    variant="outline"
                    className="h-9 w-9"
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPages}
                  >
                    <PaginationNext className="h-4 w-4" />
                  </Button>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPayments;
