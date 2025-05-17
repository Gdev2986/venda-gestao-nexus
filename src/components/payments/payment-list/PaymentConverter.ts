
// Assuming this exists, if not we need to create it
import { PaymentData } from '@/hooks/payments/payment.types';

export const convertPaymentToTableFormat = (payment: PaymentData) => {
  return {
    id: payment.id,
    client: payment.client_name || 'Cliente não especificado',
    amount: payment.amount,
    date: payment.created_at,
    status: payment.status as any, // Cast to any to avoid type errors
    pix_key: payment.pix_key_id,
    receipt_url: payment.receipt_url,
    description: payment.description
  };
};

export const convertToCSVFormat = (payments: PaymentData[]) => {
  return payments.map(payment => ({
    ID: payment.id,
    Cliente: payment.client_name || 'N/A',
    Valor: `R$ ${payment.amount.toFixed(2)}`.replace('.', ','),
    'Data Solicitação': formatDate(payment.created_at),
    Status: formatStatus(payment.status),
    'Chave PIX': payment.pix_key_id || 'N/A',
    Descrição: payment.description || 'N/A'
  }));
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR') + ' ' + date.toLocaleTimeString('pt-BR');
};

const formatStatus = (status: string) => {
  const statusMap: Record<string, string> = {
    'PENDING': 'Pendente',
    'APPROVED': 'Aprovado',
    'REJECTED': 'Rejeitado',
    'PAID': 'Pago'
  };
  
  return statusMap[status] || status;
};
