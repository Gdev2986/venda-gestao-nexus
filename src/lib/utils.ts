
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}

export function formatDate(date: Date): string {
  return format(date, 'dd/MM/yyyy', { locale: ptBR });
}

export function formatDateTime(date: Date): string {
  return format(date, 'dd/MM/yyyy HH:mm', { locale: ptBR });
}

export function formatDateString(dateString: string): string {
  try {
    const date = parseISO(dateString);
    return formatDate(date);
  } catch (error) {
    return dateString;
  }
}

export function formatDateTimeString(dateString: string): string {
  try {
    const date = parseISO(dateString);
    return formatDateTime(date);
  } catch (error) {
    return dateString;
  }
}
