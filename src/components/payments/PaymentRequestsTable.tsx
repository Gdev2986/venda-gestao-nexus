
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Calendar, Filter } from 'lucide-react';
import { formatCurrency } from '@/lib/formatters';
import { PaymentRequest } from '@/types/payment.types';
import { PaymentStatus } from '@/types/enums';
import { format, subDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface PaymentRequestsTableProps {
  payments: PaymentRequest[];
  isLoading: boolean;
}

const getStatusColor = (status: PaymentStatus) => {
  switch (status) {
    case PaymentStatus.PENDING:
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    case PaymentStatus.APPROVED:
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    case PaymentStatus.REJECTED:
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    case PaymentStatus.PAID:
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  }
};

const getStatusLabel = (status: PaymentStatus) => {
  switch (status) {
    case PaymentStatus.PENDING:
      return 'Pendente';
    case PaymentStatus.APPROVED:
      return 'Aprovado';
    case PaymentStatus.REJECTED:
      return 'Rejeitado';
    case PaymentStatus.PAID:
      return 'Pago';
    default:
      return 'Desconhecido';
  }
};

export const PaymentRequestsTable = ({ payments, isLoading }: PaymentRequestsTableProps) => {
  const [filteredPayments, setFilteredPayments] = useState<PaymentRequest[]>(payments);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');

  // Definir filtro padrão para últimos 7 dias
  useEffect(() => {
    const today = new Date();
    const sevenDaysAgo = subDays(today, 7);
    setStartDate(format(sevenDaysAgo, 'yyyy-MM-dd'));
    setEndDate(format(today, 'yyyy-MM-dd'));
  }, []);

  // Aplicar filtros
  useEffect(() => {
    let filtered = [...payments];

    // Filtro por data
    if (startDate && endDate) {
      filtered = filtered.filter(payment => {
        const paymentDate = new Date(payment.created_at);
        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999); // Incluir todo o dia final
        return paymentDate >= start && paymentDate <= end;
      });
    }

    // Filtro por status
    if (statusFilter) {
      filtered = filtered.filter(payment => payment.status === statusFilter);
    }

    setFilteredPayments(filtered);
  }, [payments, startDate, endDate, statusFilter]);

  const clearFilters = () => {
    const today = new Date();
    const sevenDaysAgo = subDays(today, 7);
    setStartDate(format(sevenDaysAgo, 'yyyy-MM-dd'));
    setEndDate(format(today, 'yyyy-MM-dd'));
    setStatusFilter('');
  };

  if (isLoading) {
    return (
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-muted-foreground dark:text-gray-400">Carregando solicitações...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="dark:bg-gray-800 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 dark:text-white">
          <Calendar className="h-5 w-5" />
          Histórico de Solicitações
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Filtros */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div>
            <Label htmlFor="start-date" className="dark:text-white">Data Início</Label>
            <Input
              id="start-date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="dark:bg-gray-600 dark:border-gray-500 dark:text-white"
            />
          </div>
          <div>
            <Label htmlFor="end-date" className="dark:text-white">Data Fim</Label>
            <Input
              id="end-date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="dark:bg-gray-600 dark:border-gray-500 dark:text-white"
            />
          </div>
          <div>
            <Label htmlFor="status-filter" className="dark:text-white">Status</Label>
            <select
              id="status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-500 rounded-md bg-white dark:bg-gray-600 dark:text-white"
            >
              <option value="">Todos</option>
              <option value={PaymentStatus.PENDING}>Pendente</option>
              <option value={PaymentStatus.APPROVED}>Aprovado</option>
              <option value={PaymentStatus.REJECTED}>Rejeitado</option>
              <option value={PaymentStatus.PAID}>Pago</option>
            </select>
          </div>
          <div className="flex items-end">
            <Button
              variant="outline"
              onClick={clearFilters}
              className="w-full dark:bg-gray-600 dark:border-gray-500 dark:text-white dark:hover:bg-gray-500"
            >
              <Filter className="h-4 w-4 mr-2" />
              Limpar
            </Button>
          </div>
        </div>

        {/* Resumo */}
        <div className="mb-4 text-sm text-muted-foreground dark:text-gray-400">
          Exibindo {filteredPayments.length} solicitação(ões) de {payments.length} total
        </div>

        {/* Tabela */}
        <div className="rounded-md border dark:border-gray-600 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="dark:border-gray-600">
                <TableHead className="dark:text-gray-300">Data</TableHead>
                <TableHead className="dark:text-gray-300">Tipo</TableHead>
                <TableHead className="dark:text-gray-300">Valor</TableHead>
                <TableHead className="dark:text-gray-300">Status</TableHead>
                <TableHead className="dark:text-gray-300">Observações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.length === 0 ? (
                <TableRow>
                  <TableCell 
                    colSpan={5} 
                    className="text-center py-8 text-muted-foreground dark:text-gray-400"
                  >
                    Nenhuma solicitação encontrada para o período selecionado
                  </TableCell>
                </TableRow>
              ) : (
                filteredPayments.map((payment) => (
                  <TableRow key={payment.id} className="dark:border-gray-600">
                    <TableCell className="dark:text-gray-300">
                      {format(new Date(payment.created_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                    </TableCell>
                    <TableCell className="dark:text-gray-300">
                      <Badge variant="outline" className="dark:border-gray-500">
                        {payment.payment_type || 'PIX'}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium dark:text-gray-300">
                      {formatCurrency(payment.amount)}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(payment.status)}>
                        {getStatusLabel(payment.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="dark:text-gray-300">
                      <div className="max-w-xs truncate">
                        {payment.notes || payment.rejection_reason || '-'}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
