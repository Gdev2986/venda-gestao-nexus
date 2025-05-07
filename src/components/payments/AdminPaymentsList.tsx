import { useState } from 'react';
import { createPaymentColumns, PaymentAction } from '@/components/payments/PaymentTableColumns';
import { Payment } from '@/types';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface AdminPaymentsListProps {
  payments: Payment[];
  onAction: (paymentId: string, action: PaymentAction) => void;
  isLoading: boolean;
}

const AdminPaymentsList: React.FC<AdminPaymentsListProps> = ({ payments, onAction, isLoading }) => {
  const columns = createPaymentColumns();
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
              {columns.map((column) => (
                <th
                  key={column.id}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {column.header}
                </th>
              ))}
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
                {columns.map((column) => (
                  <td key={`${payment.id}-${column.id}`} className="px-6 py-4 whitespace-nowrap">
                    {column.cell ? column.cell({ row: payment }) : null}
                  </td>
                ))}
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
