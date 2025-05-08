
import { formatRelative, format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

export const formatDate = (date: Date) => {
  return format(date, 'dd/MM/yyyy');
};

export const formatDateTime = (date: Date) => {
  return format(date, 'dd/MM/yyyy HH:mm');
};

export const formatRelativeTime = (dateString: string) => {
  const date = parseISO(dateString);
  return formatRelative(date, new Date(), { locale: ptBR });
};
