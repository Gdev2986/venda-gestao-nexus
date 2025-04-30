
import { format } from 'date-fns';
import { PaymentMethod, Sale, SalesFilterParams } from '@/types';

// The raw sale data might have different properties than our internal model
interface RawSale {
  id: string;
  code: string;
  terminal: string;
  date: string;
  gross_amount: number; 
  net_amount: number;
  payment_method: string;
  client_id?: string;
  client_name?: string;
}

// Convert date string to a standard ISO format
export const formatDateToISO = (dateStr: string): string => {
  // Try to parse the date and return the ISO string
  try {
    const date = new Date(dateStr);
    return date.toISOString();
  } catch (error) {
    console.error('Error parsing date:', error);
    return new Date().toISOString(); // Return current date as fallback
  }
};

// Parse a payment method string to our PaymentMethod enum
export const parsePaymentMethod = (method: string): PaymentMethod => {
  method = method.toUpperCase();
  if (method === 'CREDIT' || method === 'CRÉDITO' || method === 'CREDITO') {
    return PaymentMethod.CREDIT;
  } else if (method === 'DEBIT' || method === 'DÉBITO' || method === 'DEBITO') {
    return PaymentMethod.DEBIT;
  } else if (method === 'PIX') {
    return PaymentMethod.PIX;
  } else {
    return PaymentMethod.CREDIT; // Default
  }
};

// Check if a value is a valid date
export const isValidDate = (value: any): boolean => {
  if (!value) return false;
  
  // If it's already a valid Date object
  if (value instanceof Date && !isNaN(value.getTime())) {
    return true;
  }
  
  // If it's a string, try to convert it to a Date
  if (typeof value === 'string') {
    const date = new Date(value);
    return !isNaN(date.getTime());
  }
  
  return false;
};

// Filter sales based on criteria
export const filterSales = (sales: Sale[], filters: SalesFilterParams): Sale[] => {
  return sales.filter(sale => {
    // Filter by search term (code or terminal)
    if (filters.search && !sale.code.toLowerCase().includes(filters.search.toLowerCase()) && 
        !sale.terminal.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    
    // Filter by payment method
    if (filters.paymentMethod && sale.paymentMethod !== filters.paymentMethod) {
      return false;
    }
    
    // Filter by terminal
    if (filters.terminal && sale.terminal !== filters.terminal) {
      return false;
    }
    
    return true;
  });
};

// Calculate the total values for a list of sales
export const calculateSalesTotals = (sales: Sale[]) => {
  return sales.reduce((acc, sale) => {
    return {
      grossAmount: acc.grossAmount + sale.gross_amount,
      netAmount: acc.netAmount + sale.net_amount
    };
  }, { grossAmount: 0, netAmount: 0 });
};
