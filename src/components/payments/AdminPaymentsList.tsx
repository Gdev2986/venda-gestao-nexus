
import { useState } from 'react';
import { Payment, PaymentStatus } from '@/types';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { PaymentAction } from './PaymentTableColumns';
import { Card, CardContent } from '@/components/ui/card';
import { ApprovePaymentDialog } from './ApprovePaymentDialog';
import { RejectPaymentDialog } from './RejectPaymentDialog';
import { PaymentDetailsDialog } from './PaymentDetailsDialog';
import { formatCurrency } from '@/lib/utils';
import { Check, X, Eye, MoreHorizontal } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

interface AdminPaymentsListProps {
  payments: Payment[];
  onAction: (paymentId: string, action: PaymentAction) => void;
  isLoading: boolean;
}

// Define the component both as default export and named export for compatibility
const AdminPaymentsList = ({ payments, onAction, isLoading }: AdminPaymentsListProps) => {
  const { toast } = useToast();
  const [selectedPayments, setSelectedPayments] = useState<string[]>([]);
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // ... keep existing code (handle action, selection and dialog functions)

  const handleAction = (paymentId: string, action: PaymentAction) => {
    onAction(paymentId, action);
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

  // ... keep existing code (loading and empty states)

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-sm text-muted-foreground">Carregando pagamentos...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (payments.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-4">
            <p className="text-muted-foreground">Nenhum pagamento encontrado.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  checked={selectedPayments.length === payments.length}
                  onChange={handleSelectAllPayments}
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cliente
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Valor
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {payments.map((payment) => (
              <tr key={payment.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    checked={selectedPayments.includes(payment.id)}
                    onChange={() => handleSelectPayment(payment.id)}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {payment.id.substring(0, 8)}...
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {payment.client?.business_name || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap font-medium">
                  {payment.amount ? formatCurrency(payment.amount) : 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${payment.status === PaymentStatus.PENDING ? 'bg-yellow-100 text-yellow-800' : ''}
                    ${payment.status === PaymentStatus.APPROVED ? 'bg-green-100 text-green-800' : ''}
                    ${payment.status === PaymentStatus.REJECTED ? 'bg-red-100 text-red-800' : ''}
                    ${payment.status === PaymentStatus.PAID ? 'bg-blue-100 text-blue-800' : ''}
                    `}
                  >
                    {payment.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {payment.created_at ? new Date(payment.created_at).toLocaleDateString('pt-BR') : 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap space-x-2">
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openDetailsDialog(payment)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Ver
                    </Button>
                    
                    {payment.status === PaymentStatus.PENDING && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="sm" variant="outline">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openApproveDialog(payment)}>
                            <Check className="h-4 w-4 mr-2" />
                            <span>Aprovar</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openRejectDialog(payment)}>
                            <X className="h-4 w-4 mr-2" />
                            <span>Rejeitar</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
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
            payment={selectedPayment}
            onApprove={handleApprovePayment}
            isProcessing={isProcessing}
          />
          
          <RejectPaymentDialog
            open={rejectDialogOpen}
            onOpenChange={setRejectDialogOpen}
            payment={selectedPayment}
            onReject={handleRejectPayment}
            isProcessing={isProcessing}
          />
          
          <PaymentDetailsDialog 
            open={detailsDialogOpen}
            onOpenChange={setDetailsDialogOpen}
            payment={selectedPayment}
          />
        </>
      )}
    </>
  );
};

// Export both as default and named export for compatibility
export { AdminPaymentsList };
export default AdminPaymentsList;
