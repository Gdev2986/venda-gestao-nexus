
import { useState } from 'react';
import { Payment } from '@/types';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { PaymentAction } from '@/types/enums';
import { ApprovePaymentDialog } from './ApprovePaymentDialog';
import { RejectPaymentDialog } from './RejectPaymentDialog';
import { PaymentDetailsDialog } from './PaymentDetailsDialog';
import { PaymentListTable } from './payment-list/PaymentListTable';
import { PaymentListLoadingState } from './payment-list/PaymentListLoadingState';
import { PaymentListEmptyState } from './payment-list/PaymentListEmptyState';
import { convertToPaymentRequest } from './payment-list/PaymentConverter';
import { SendReceiptDialog } from './SendReceiptDialog';
import { PaymentData } from '@/types/payment.types';

interface AdminPaymentsListProps {
  payments: Payment[];
  onActionClick: (paymentId: string, action: PaymentAction) => void;
  isLoading: boolean;
}

// Define o componente tanto como exportação padrão quanto exportação nomeada para compatibilidade
const AdminPaymentsList = ({ payments, onActionClick, isLoading }: AdminPaymentsListProps) => {
  const { toast } = useToast();
  const [selectedPayments, setSelectedPayments] = useState<string[]>([]);
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [sendReceiptDialogOpen, setSendReceiptDialogOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAction = (paymentId: string, action: PaymentAction) => {
    const payment = payments.find(p => p.id === paymentId);
    if (!payment) return;
    
    setSelectedPayment(payment);
    
    if (action === PaymentAction.APPROVE) {
      setApproveDialogOpen(true);
    } else if (action === PaymentAction.REJECT) {
      setRejectDialogOpen(true);
    } else if (action === PaymentAction.VIEW) {
      setDetailsDialogOpen(true);
    } else if (action === PaymentAction.SEND_RECEIPT) {
      setSendReceiptDialogOpen(true);
    } else {
      onActionClick(paymentId, action);
    }
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

  const handleApprovePayment = async (paymentId: string, receiptFile: File | null, notes: string) => {
    setIsProcessing(true);
    try {
      // Simular upload do comprovante
      let receiptUrl = null;
      if (receiptFile) {
        // Em um caso real, faria upload para o Supabase Storage
        receiptUrl = URL.createObjectURL(receiptFile);
      }

      // Após enviar comprovante, aprovar o pagamento
      await onActionClick(paymentId, PaymentAction.APPROVE);
      
      toast({
        title: "Pagamento aprovado",
        description: notes ? `Observações: ${notes}` : "O pagamento foi aprovado com sucesso.",
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

  const handleRejectPayment = async (paymentId: string, rejectionReason: string) => {
    setIsProcessing(true);
    try {
      await onActionClick(paymentId, PaymentAction.REJECT);
      
      toast({
        title: "Pagamento recusado",
        description: "O pagamento foi recusado com sucesso.",
      });
      
      setRejectDialogOpen(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Ocorreu um erro ao recusar o pagamento.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSendReceipt = async (paymentId: string, receiptFile: File, message: string) => {
    setIsProcessing(true);
    try {
      // Em um caso real, faria upload do comprovante e enviaria notificação
      console.log("Enviando comprovante:", { paymentId, message });
      
      toast({
        title: "Comprovante enviado",
        description: "O comprovante foi enviado com sucesso para o cliente.",
      });
      
      setSendReceiptDialogOpen(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Ocorreu um erro ao enviar o comprovante.",
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

  const getPaymentWithDescription = (payment: Payment): PaymentData => {
    const converted = convertToPaymentRequest(payment);
    return {
      ...converted,
      description: converted.description || "" // Ensure description is never undefined
    };
  };

  return (
    <>
      <PaymentListTable 
        payments={payments}
        selectedPayments={selectedPayments}
        onSelectPayment={handleSelectPayment}
        onSelectAllPayments={handleSelectAllPayments}
        onAction={handleAction}
      />
      
      {selectedPayments.length > 0 && (
        <div className="mt-4">
          <Button variant="destructive" onClick={() => {
            selectedPayments.forEach(id => onActionClick(id, PaymentAction.DELETE));
            setSelectedPayments([]);
          }}>
            Excluir Pagamentos Selecionados ({selectedPayments.length})
          </Button>
        </div>
      )}
      
      {selectedPayment && (
        <>
          <ApprovePaymentDialog
            open={approveDialogOpen}
            onOpenChange={setApproveDialogOpen}
            payment={getPaymentWithDescription(selectedPayment)}
            onApprove={handleApprovePayment}
            isProcessing={isProcessing}
          />
          
          <RejectPaymentDialog
            open={rejectDialogOpen}
            onOpenChange={setRejectDialogOpen}
            payment={getPaymentWithDescription(selectedPayment)}
            onReject={handleRejectPayment}
            isProcessing={isProcessing}
          />
          
          <PaymentDetailsDialog 
            open={detailsDialogOpen}
            onOpenChange={setDetailsDialogOpen}
            payment={getPaymentWithDescription(selectedPayment)}
          />

          <SendReceiptDialog
            open={sendReceiptDialogOpen}
            onOpenChange={setSendReceiptDialogOpen}
            payment={getPaymentWithDescription(selectedPayment)}
            onSendReceipt={handleSendReceipt}
            isProcessing={isProcessing}
          />
        </>
      )}
    </>
  );
};

// Exporta tanto como padrão quanto como exportação nomeada para compatibilidade
export { AdminPaymentsList };
export default AdminPaymentsList;
