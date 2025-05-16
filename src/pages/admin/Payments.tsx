
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
import { Payment } from "@/types";

const AdminPayments = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | "ALL">("ALL");
  const [page, setPage] = useState(1);
  const pageSize = 10;
  
  // UI state for dialogs
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
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
  
  // Handler for payment actions
  const handlePaymentAction = async (paymentId: string, action: PaymentAction) => {
    const payment = payments.find(p => p.id === paymentId);
    if (!payment) return;
    
    setSelectedPayment(payment);
    
    if (action === PaymentAction.APPROVE) {
      setIsApproveDialogOpen(true);
    } else if (action === PaymentAction.REJECT) {
      setIsRejectDialogOpen(true);
    } else if (action === PaymentAction.VIEW) {
      setIsDetailsDialogOpen(true);
    }
  };

  // Handler for dialog confirmations
  const handleConfirmAction = async (action: PaymentAction): Promise<void> => {
    if (!selectedPayment) return Promise.resolve();
    
    await performPaymentAction(selectedPayment.id, action);
    
    // Close all dialogs
    setIsDetailsDialogOpen(false);
    setIsApproveDialogOpen(false);
    setIsRejectDialogOpen(false);
    setSelectedPayment(null);

    return Promise.resolve();
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
          setSearchTerm={setSearchTerm}
          setStatusFilter={setStatusFilter}
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
      {selectedPayment && (
        <PaymentDetailsDialog
          open={isDetailsDialogOpen}
          onOpenChange={setIsDetailsDialogOpen}
          payment={selectedPayment}
        />
      )}
      
      {/* Approve Payment Dialog */}
      {selectedPayment && (
        <ApprovePaymentDialog
          open={isApproveDialogOpen}
          onOpenChange={setIsApproveDialogOpen}
          payment={selectedPayment}
          onApprove={() => handleConfirmAction(PaymentAction.APPROVE)}
        />
      )}
      
      {/* Reject Payment Dialog */}
      {selectedPayment && (
        <RejectPaymentDialog
          open={isRejectDialogOpen}
          onOpenChange={setIsRejectDialogOpen}
          payment={selectedPayment}
          onReject={() => handleConfirmAction(PaymentAction.REJECT)}
        />
      )}
    </div>
  );
};

export default AdminPayments;
