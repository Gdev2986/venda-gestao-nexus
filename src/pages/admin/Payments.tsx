import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useAdminPayments from "@/hooks/payments/useAdminPayments";
import { PaymentStatus, PaymentAction } from "@/types/enums";
import AdminPaymentsList from "@/components/payments/AdminPaymentsList";
import { PaymentFilters } from "@/components/payments/PaymentFilters";
import { PaymentDetailsDialog } from "@/components/payments/PaymentDetailsDialog";
import { ApprovePaymentDialog } from "@/components/payments/ApprovePaymentDialog";
import { RejectPaymentDialog } from "@/components/payments/RejectPaymentDialog";
import { PageHeader } from "@/components/page/PageHeader";
import { Payment } from "@/types";
import { convertToPaymentRequest } from "@/components/payments/payment-list/PaymentConverter";
import { PaymentNotifications } from "@/components/payments/PaymentNotifications";
import { SendReceiptDialog } from "@/components/payments/SendReceiptDialog";
import { useMediaQuery } from "@/hooks/use-media-query";
import { PaymentData } from "@/types/payment.types";

const AdminPayments = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | "ALL">("ALL");
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [activeTab, setActiveTab] = useState("all");
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  // UI state para diálogos
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [isSendReceiptDialogOpen, setIsSendReceiptDialogOpen] = useState(false);
  
  const { 
    payments, 
    isLoading, 
    error, 
    totalPages,
    refetch,
    performPaymentAction
  } = useAdminPayments({
    searchTerm,
    statusFilter,
    page,
    pageSize
  });

  // Atualiza o filtro status com base na tab ativa
  useEffect(() => {
    if (activeTab === "all") {
      setStatusFilter("ALL");
    } else if (activeTab === "pending") {
      setStatusFilter(PaymentStatus.PENDING);
    } else if (activeTab === "processing") {
      setStatusFilter(PaymentStatus.PROCESSING);
    } else if (activeTab === "approved") {
      setStatusFilter(PaymentStatus.APPROVED);
    } else if (activeTab === "rejected") {
      setStatusFilter(PaymentStatus.REJECTED);
    } else if (activeTab === "paid") {
      setStatusFilter(PaymentStatus.PAID);
    }
  }, [activeTab]);
  
  // Handler para ações de pagamento
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
    } else if (action === PaymentAction.SEND_RECEIPT) {
      setIsSendReceiptDialogOpen(true);
    } else {
      await performPaymentAction(paymentId, action);
    }
  };

  // Handler para confirmação de diálogos
  const handleConfirmAction = async (action: PaymentAction, formData?: any): Promise<void> => {
    if (!selectedPayment) return Promise.resolve();
    
    await performPaymentAction(selectedPayment.id, action);
    
    // Fecha todos os diálogos
    setIsDetailsDialogOpen(false);
    setIsApproveDialogOpen(false);
    setIsRejectDialogOpen(false);
    setIsSendReceiptDialogOpen(false);
    setSelectedPayment(null);

    return Promise.resolve();
  };

  const handleApprovePayment = async (paymentId: string, receiptFile: File | null, notes: string) => {
    console.log("Aprovando pagamento:", { paymentId, notes, hasFile: !!receiptFile });
    // Em uma implementação real, você enviaria o arquivo para o servidor
    await handleConfirmAction(PaymentAction.APPROVE);
  };

  const handleRejectPayment = async (paymentId: string, rejectionReason: string) => {
    console.log("Rejeitando pagamento:", { paymentId, rejectionReason });
    await handleConfirmAction(PaymentAction.REJECT);
  };

  const handleSendReceipt = async (paymentId: string, receiptFile: File, message: string) => {
    console.log("Enviando comprovante:", { paymentId, message, hasFile: !!receiptFile });
    await handleConfirmAction(PaymentAction.SEND_RECEIPT);
  };
  
  // Helper to ensure payment data has description field
  const getPaymentWithDescription = (payment: Payment): PaymentData => {
    const converted = convertToPaymentRequest(payment);
    return {
      ...converted,
      description: converted.description || "", // Ensure description is never undefined
      status: converted.status as any // Cast status to compatible type
    };
  };
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <PageHeader
        title="Pagamentos"
        description="Gerencie e aprove solicitações de pagamento dos clientes"
      />
      
      <Card className="p-4 md:p-6">
        <PaymentFilters
          searchTerm={searchTerm}
          statusFilter={statusFilter}
          setSearchTerm={setSearchTerm}
          setStatusFilter={setStatusFilter}
        />
      </Card>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full overflow-x-auto flex flex-nowrap md:flex-wrap py-1">
          <TabsTrigger value="all" className="flex-shrink-0">Todas</TabsTrigger>
          <TabsTrigger value="pending" className="flex-shrink-0">Pendentes</TabsTrigger>
          <TabsTrigger value="processing" className="flex-shrink-0">Em Processamento</TabsTrigger>
          <TabsTrigger value="approved" className="flex-shrink-0">Aprovados</TabsTrigger>
          <TabsTrigger value="rejected" className="flex-shrink-0">Recusados</TabsTrigger>
          <TabsTrigger value="paid" className="flex-shrink-0">Pagos</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="pt-6">
          <AdminPaymentsList
            payments={payments}
            isLoading={isLoading}
            onActionClick={handlePaymentAction}
          />
        </TabsContent>
      </Tabs>
      
      {/* Diálogo de Detalhes do Pagamento */}
      {selectedPayment && (
        <PaymentDetailsDialog
          open={isDetailsDialogOpen}
          onOpenChange={setIsDetailsDialogOpen}
          payment={getPaymentWithDescription(selectedPayment)}
        />
      )}
      
      {/* Diálogo de Aprovação de Pagamento */}
      {selectedPayment && (
        <ApprovePaymentDialog
          open={isApproveDialogOpen}
          onOpenChange={setIsApproveDialogOpen}
          payment={getPaymentWithDescription(selectedPayment)}
          onApprove={handleApprovePayment}
          isProcessing={false}
        />
      )}
      
      {/* Diálogo de Rejeição de Pagamento */}
      {selectedPayment && (
        <RejectPaymentDialog
          open={isRejectDialogOpen}
          onOpenChange={setIsRejectDialogOpen}
          payment={getPaymentWithDescription(selectedPayment)}
          onReject={handleRejectPayment}
          isProcessing={false}
        />
      )}

      {/* Diálogo de Envio de Comprovante */}
      {selectedPayment && (
        <SendReceiptDialog
          open={isSendReceiptDialogOpen}
          onOpenChange={setIsSendReceiptDialogOpen}
          payment={getPaymentWithDescription(selectedPayment)}
          onSendReceipt={handleSendReceipt}
          isProcessing={false}
        />
      )}
      
      {/* Componente para ouvir notificações de pagamentos em tempo real */}
      <PaymentNotifications refreshPayments={refetch} />
    </div>
  );
};

export default AdminPayments;
