
import { useState } from 'react';
import { Payment } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { PaymentStatusBadge } from './PaymentStatusBadge';
import { PaymentListActions } from './PaymentListActions';

interface PaymentListTableProps {
  payments: Payment[];
  selectedPayments: string[];
  onSelectPayment: (paymentId: string) => void;
  onSelectAllPayments: () => void;
  onOpenDetails: (payment: Payment) => void;
  onOpenApprove: (payment: Payment) => void;
  onOpenReject: (payment: Payment) => void;
}

export const PaymentListTable = ({
  payments,
  selectedPayments,
  onSelectPayment,
  onSelectAllPayments,
  onOpenDetails,
  onOpenApprove,
  onOpenReject,
}: PaymentListTableProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                checked={selectedPayments.length === payments.length && payments.length > 0}
                onChange={onSelectAllPayments}
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
                  onChange={() => onSelectPayment(payment.id)}
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {payment.id.substring(0, 8)}...
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {payment.client?.business_name || payment.client_name || 'N/A'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap font-medium">
                {payment.amount ? formatCurrency(payment.amount) : 'N/A'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <PaymentStatusBadge status={payment.status} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {payment.created_at ? new Date(payment.created_at).toLocaleDateString('pt-BR') : 'N/A'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap space-x-2">
                <PaymentListActions 
                  payment={payment}
                  onOpenDetails={onOpenDetails}
                  onOpenApprove={onOpenApprove}
                  onOpenReject={onOpenReject}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
