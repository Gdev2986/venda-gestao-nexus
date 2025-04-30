
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
  if (value && value instanceof Date && !isNaN(value.getTime())) {
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

// Generate mock sales data for a given date range
export interface DateRange {
  from: Date;
  to: Date;
}

// Function to generate mock sales data
export const generateMockSales = (count: number, dateRange?: DateRange): Sale[] => {
  const terminals = ['POS001', 'POS002', 'POS003', 'POS004', 'POS005'];
  const paymentMethods = [PaymentMethod.CREDIT, PaymentMethod.DEBIT, PaymentMethod.PIX];
  const sales: Sale[] = [];
  
  const startDate = dateRange?.from || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const endDate = dateRange?.to || new Date();

  for (let i = 0; i < count; i++) {
    // Generate a random date between the start and end dates
    const date = new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));
    
    // Generate a random gross amount between 50 and 1000
    const gross_amount = Math.round((Math.random() * 950 + 50) * 100) / 100;
    
    // Calculate a net amount (gross - random fee)
    const fee = (Math.random() * 0.05 + 0.01) * gross_amount; // Random fee between 1% and 6%
    const net_amount = Math.round((gross_amount - fee) * 100) / 100;
    
    // Random payment method
    const paymentMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
    
    // Create a sale object
    const sale: Sale = {
      id: `sale-${i}-${Date.now()}`,
      code: `INV${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
      terminal: terminals[Math.floor(Math.random() * terminals.length)],
      date: date.toISOString(),
      gross_amount,
      net_amount,
      paymentMethod,
      client_id: 'client-1',
      client_name: 'Client Name'
    };
    
    sales.push(sale);
  }
  
  // Sort by date, newest first
  return sales.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

// Generate daily sales data for charts
export const generateDailySalesData = (dateRange: DateRange) => {
  const days = [];
  const currentDate = new Date(dateRange.from);
  const endDate = new Date(dateRange.to);
  
  while (currentDate <= endDate) {
    days.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return days.map(day => {
    // Generate random sales value between 1000 and 10000
    const total = Math.round(Math.random() * 9000 + 1000);
    
    return {
      name: format(day, 'dd/MM'),
      total: total
    };
  });
};

// Generate payment methods data for pie/bar charts
export const generatePaymentMethodsData = (dateRange: DateRange) => {
  // Generate mock data for payment methods
  const creditAmount = Math.round(Math.random() * 15000 + 5000);
  const debitAmount = Math.round(Math.random() * 10000 + 3000);
  const pixAmount = Math.round(Math.random() * 8000 + 2000);
  
  const total = creditAmount + debitAmount + pixAmount;
  
  return [
    {
      method: PaymentMethod.CREDIT,
      amount: creditAmount,
      percentage: Math.round((creditAmount / total) * 100)
    },
    {
      method: PaymentMethod.DEBIT,
      amount: debitAmount,
      percentage: Math.round((debitAmount / total) * 100)
    },
    {
      method: PaymentMethod.PIX,
      amount: pixAmount,
      percentage: Math.round((pixAmount / total) * 100)
    }
  ];
};
