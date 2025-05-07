
import { useState } from 'react';
import { Payment, PaymentStatus } from '@/types';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { PaymentAction } from './PaymentTableColumns';

interface AdminPaymentsListProps {
  payments: Payment[];
  onAction: (paymentId: string, action: PaymentAction) => void;
  isLoading: boolean;
}

export const AdminPaymentsList: React.FC<AdminPaymentsListProps> = ({ payments, onAction, isLoading }) => {
  const { toast } = useToast();
  const [selectedPayments, setSelectedPayments] = useState<string[]>([]);

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

  if (isLoading) {
    return <div className="text-center py-4">Carregando pagamentos...</div>;
  }

  return (
    <div className="overflow-x-auto">
      {payments.length === 0 ? (
        <div className="text-center py-4">Nenhum pagamento encontrado.</div>
      ) : (
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
              <tr key={payment.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    checked={selectedPayments.includes(payment.id)}
                    onChange={() => handleSelectPayment(payment.id)}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{payment.id}</td>
                <td className="px-6 py-4 whitespace-nowrap">{payment.client?.business_name || 'N/A'}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {payment.amount ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(payment.amount) : 'N/A'}
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
                <td className="px-6 py-4 whitespace-nowrap">
                  {payment.created_at ? new Date(payment.created_at).toLocaleDateString('pt-BR') : 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleAction(payment.id, PaymentAction.VIEW)}
                  >
                    Ver
                  </Button>
                  {payment.status === PaymentStatus.PENDING && (
                    <>
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => handleAction(payment.id, PaymentAction.APPROVE)}
                      >
                        Aprovar
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleAction(payment.id, PaymentAction.REJECT)}
                      >
                        Rejeitar
                      </Button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {selectedPayments.length > 0 && (
        <div className="mt-4">
          <Button variant="destructive" onClick={handleDeleteSelected}>
            Excluir Pagamentos Selecionados ({selectedPayments.length})
          </Button>
        </div>
      )}
    </div>
  );
};

export default AdminPaymentsList;
