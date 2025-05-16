
import { useState } from 'react';
import { Payment } from '@/types';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { PaymentAction } from '@/hooks/payments/useAdminPayments';
import { ApprovePaymentDialog } from './ApprovePaymentDialog';
import { RejectPaymentDialog } from './RejectPaymentDialog';
import { PaymentDetailsDialog } from './PaymentDetailsDialog';
import { PaymentListTable } from './payment-list/PaymentListTable';
import { PaymentListLoadingState } from './payment-list/PaymentListLoadingState';
import { PaymentListEmptyState } from './payment-list/PaymentListEmptyState';
import { convertToPaymentRequest } from './payment-list/PaymentConverter';

interface AdminPaymentsListProps {
  payments: Payment[];
  onActionClick: (paymentId: string, action: PaymentAction) => void;
  isLoading: boolean;
}

// Define the component both as default export and named export for compatibility
const AdminPaymentsList = ({ payments, onActionClick, isLoading }: AdminPaymentsListProps) => {
  const { toast } = useToast();
  const [selectedPayments, setSelectedPayments] = useState<string[]>([]);
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAction = (paymentId: string, action: PaymentAction) => {
    onActionClick(paymentId, action);
  };

  const handleSelectPayment = (paymentId: string) => {
    setSelectedPayments((prev) =>
      prev.includes(paymentId) ? prev.filter((id) => id !== paymentId) : [...prev, paymentId]
    );
  };

  const handleSelectAllPayments = () => {
    if (selectedPayments.length === payments.length) {
      setSelectedPayments([]);
    } else {
      setSelectedPayments(payments.map((payment) => payment.id));
    }
  };

  const handleDeleteSelected = () => {
    if (selectedPayments.length === 0) {
      toast({
        title: 'Nenhum pagamento selecionado',
        description: 'Selecione os pagamentos que deseja excluir.',
      });
      return;
    }

    selectedPayments.forEach((paymentId) => {
      handleAction(paymentId, PaymentAction.DELETE);
    });

    setSelectedPayments([]);
  };

  const openApproveDialog = (payment: Payment) => {
    setSelectedPayment(payment);
    setApproveDialogOpen(true);
  };

  const openRejectDialog = (payment: Payment) => {
    setSelectedPayment(payment);
    setRejectDialogOpen(true);
  };

  const openDetailsDialog = (payment: Payment) => {
    setSelectedPayment(payment);
    setDetailsDialogOpen(true);
  };

  const handleApprovePayment = async (paymentId: string, receiptFile: File | null, notes: string) => {
    setIsProcessing(true);
    try {
      // Simular upload de arquivo
      let receiptUrl = null;
      if (receiptFile) {
        // Em um caso real, faria upload para o Supabase Storage
        receiptUrl = URL.createObjectURL(receiptFile);
      }

      // Depois aprovaria o pagamento
      await handleAction(paymentId, PaymentAction.APPROVE);
      
      toast({
        title: "Pagamento aprovado",
        description: "O pagamento foi aprovado com sucesso.",
      });
      
      setApproveDialogOpen(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Ocorreu um erro ao aprovar o pagamento.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRejectPayment = async (paymentId: string, reason: string) => {
    setIsProcessing(true);
    try {
      await handleAction(paymentId, PaymentAction.REJECT);
      
      toast({
        title: "Pagamento rejeitado",
        description: "O pagamento foi rejeitado com sucesso.",
      });
      
      setRejectDialogOpen(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Ocorreu um erro ao rejeitar o pagamento.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return <PaymentListLoadingState />;
  }

  if (payments.length === 0) {
    return <PaymentListEmptyState />;
  }

  return (
    <>
      <PaymentListTable 
        payments={payments}
        selectedPayments={selectedPayments}
        onSelectPayment={handleSelectPayment}
        onSelectAllPayments={handleSelectAllPayments}
        onOpenDetails={openDetailsDialog}
        onOpenApprove={openApproveDialog}
        onOpenReject={openRejectDialog}
      />
      
      {selectedPayments.length > 0 && (
        <div className="mt-4">
          <Button variant="destructive" onClick={handleDeleteSelected}>
            Excluir Pagamentos Selecionados ({selectedPayments.length})
          </Button>
        </div>
      )}
      
      {selectedPayment && (
        <>
          <ApprovePaymentDialog
            open={approveDialogOpen}
            onOpenChange={setApproveDialogOpen}
            payment={convertToPaymentRequest(selectedPayment)}
            onApprove={handleApprovePayment}
            isProcessing={isProcessing}
          />
          
          <RejectPaymentDialog
            open={rejectDialogOpen}
            onOpenChange={setRejectDialogOpen}
            payment={convertToPaymentRequest(selectedPayment)}
            onReject={handleRejectPayment}
            isProcessing={isProcessing}
          />
          
          <PaymentDetailsDialog 
            open={detailsDialogOpen}
            onOpenChange={setDetailsDialogOpen}
            payment={convertToPaymentRequest(selectedPayment)}
          />
        </>
      )}
    </>
  );
};

// Export both as default and named export for compatibility
export { AdminPaymentsList };
export default AdminPaymentsList;
