
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useAdminPayments, { PaymentAction } from "@/hooks/payments/useAdminPayments";
import { PaymentStatus } from "@/types";
import AdminPaymentsList from "@/components/payments/AdminPaymentsList";
import { PaymentFilters } from "@/components/payments/PaymentFilters";
import { PaymentDetailsDialog } from "@/components/payments/PaymentDetailsDialog";
import { ApprovePaymentDialog } from "@/components/payments/ApprovePaymentDialog";
import { RejectPaymentDialog } from "@/components/payments/RejectPaymentDialog";
import { PageHeader } from "@/components/page/PageHeader";

const AdminPayments = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | "ALL">("ALL");
  const [page, setPage] = useState(1);
  const pageSize = 10;
  
  // UI state for dialogs
  const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  
  const { 
    payments, 
    isLoading, 
    error, 
    totalPages,
    performPaymentAction
  } = useAdminPayments({
    searchTerm,
    statusFilter,
    page,
    pageSize
  });
  
  // Handler for search input changes
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setPage(1); // Reset to first page when search changes
  };
  
  // Handler for status filter changes
  const handleStatusFilterChange = (value: PaymentStatus | "ALL") => {
    setStatusFilter(value);
    setPage(1); // Reset to first page when filter changes
  };
  
  // Handler for payment actions
  const handlePaymentAction = (paymentId: string, action: PaymentAction) => {
    setSelectedPaymentId(paymentId);
    
    if (action === PaymentAction.APPROVE) {
      setIsApproveDialogOpen(true);
    } else if (action === PaymentAction.REJECT) {
      setIsRejectDialogOpen(true);
    } else if (action === PaymentAction.VIEW) {
      setIsDetailsDialogOpen(true);
    }
  };

  // Handler for dialog confirmations
  const handleConfirmAction = (action: PaymentAction) => {
    if (!selectedPaymentId) return;
    
    performPaymentAction(selectedPaymentId, action);
    
    // Close all dialogs
    setIsDetailsDialogOpen(false);
    setIsApproveDialogOpen(false);
    setIsRejectDialogOpen(false);
    setSelectedPaymentId(null);
  };
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <PageHeader
        title="Pagamentos"
        description="Gerencie e aprove solicitações de pagamento"
      />
      
      <Card className="p-6">
        <PaymentFilters
          searchTerm={searchTerm}
          statusFilter={statusFilter}
          onSearchChange={handleSearchChange}
          onStatusFilterChange={handleStatusFilterChange}
        />
      </Card>
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">Todas Solicitações</TabsTrigger>
          <TabsTrigger value="pending">Pendentes</TabsTrigger>
          <TabsTrigger value="approved">Aprovados</TabsTrigger>
          <TabsTrigger value="rejected">Rejeitados</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="pt-6">
          <AdminPaymentsList
            payments={payments}
            isLoading={isLoading}
            onActionClick={handlePaymentAction}
          />
        </TabsContent>
        <TabsContent value="pending" className="pt-6">
          <AdminPaymentsList
            payments={payments.filter(p => p.status === "PENDING")}
            isLoading={isLoading}
            onActionClick={handlePaymentAction}
          />
        </TabsContent>
        <TabsContent value="approved" className="pt-6">
          <AdminPaymentsList
            payments={payments.filter(p => p.status === "APPROVED")}
            isLoading={isLoading}
            onActionClick={handlePaymentAction}
          />
        </TabsContent>
        <TabsContent value="rejected" className="pt-6">
          <AdminPaymentsList
            payments={payments.filter(p => p.status === "REJECTED")}
            isLoading={isLoading}
            onActionClick={handlePaymentAction}
          />
        </TabsContent>
      </Tabs>
      
      {/* Payment Detail Dialog */}
      <PaymentDetailsDialog
        open={isDetailsDialogOpen}
        onOpenChange={setIsDetailsDialogOpen}
        paymentId={selectedPaymentId || ""}
      />
      
      {/* Approve Payment Dialog */}
      <ApprovePaymentDialog
        open={isApproveDialogOpen}
        onOpenChange={setIsApproveDialogOpen}
        onConfirm={() => handleConfirmAction(PaymentAction.APPROVE)}
        paymentId={selectedPaymentId || ""}
      />
      
      {/* Reject Payment Dialog */}
      <RejectPaymentDialog
        open={isRejectDialogOpen}
        onOpenChange={setIsRejectDialogOpen}
        onConfirm={() => handleConfirmAction(PaymentAction.REJECT)}
        paymentId={selectedPaymentId || ""}
      />
    </div>
  );
};

export default AdminPayments;
