
import { PaymentMethod, Sale } from "@/types";
import { format, eachDayOfInterval, isValid } from "date-fns";

// Generate data for a specific date range
export const generateMockSales = (count = 50, dateRange?: { from: Date; to: Date }): Sale[] => {
  const sales: Sale[] = [];
  const terminals = ["T123456", "T789012", "T345678", "T901234"];
  const methods = [PaymentMethod.CREDIT, PaymentMethod.DEBIT, PaymentMethod.PIX];
  
  // Default to last 90 days if no range specified
  const startDate = dateRange?.from || new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
  const endDate = dateRange?.to || new Date();
  const dateSpan = endDate.getTime() - startDate.getTime();
  
  for (let i = 0; i < count; i++) {
    const grossAmount = Math.random() * 1000;
    const netAmount = grossAmount * 0.97; // 3% fee
    
    // Generate a random date within the specified range
    const randomTime = Math.random() * dateSpan;
    const date = new Date(startDate.getTime() + randomTime);
    
    sales.push({
      id: `sale_${i}`,
      code: `VND${Math.floor(Math.random() * 100000).toString().padStart(6, '0')}`,
      date,
      terminal: terminals[Math.floor(Math.random() * terminals.length)],
      grossAmount,
      netAmount,
      paymentMethod: methods[Math.floor(Math.random() * methods.length)],
      client_id: "client_1",
      created_at: new Date().toISOString(),
      amount: grossAmount,
      payment_method: methods[Math.floor(Math.random() * methods.length)],
      status: "completed"
    });
  }
  
  // Sort by date, newest first
  return sales.sort((a, b) => {
    const dateA = a.date instanceof Date ? a.date.getTime() : new Date(a.date).getTime();
    const dateB = b.date instanceof Date ? b.date.getTime() : new Date(b.date).getTime();
    return dateB - dateA;
  });
};

// Calculate totals for a collection of sales
export const calculateSalesTotals = (sales: Sale[]) => {
  return sales.reduce(
    (acc, sale) => {
      acc.grossAmount += sale.grossAmount || 0;
      acc.netAmount += sale.netAmount || 0;
      return acc;
    },
    { grossAmount: 0, netAmount: 0 }
  );
};

// Generate daily sales data for charts based on date range
export const generateDailySalesData = (dateRange?: { from: Date; to: Date }) => {
  const startDate = dateRange?.from && isValid(dateRange.from) ? dateRange.from : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const endDate = dateRange?.to && isValid(dateRange.to) ? dateRange.to : new Date();
  
  // Get all days between start date and end date
  const days = eachDayOfInterval({ start: startDate, end: endDate });
  
  // Generate data for each day in range
  return days.map(day => {
    // Generate a value that increases gradually with some randomness
    const baseValue = 500 + Math.floor(Math.random() * 500);
    const dayOfWeek = day.getDay();
    
    // Make weekends have less sales typically
    const multiplier = (dayOfWeek === 0 || dayOfWeek === 6) ? 0.6 : 1;
    
    return {
      name: format(day, "dd/MM"),
      total: Math.round(baseValue * multiplier)
    };
  });
};

// For backward compatibility
export const generateMonthlySalesData = generateDailySalesData;

// Generate payment methods data based on date range
export const generatePaymentMethodsData = (dateRange?: { from: Date; to: Date }) => {
  // Get mock sales for the period
  const sales = generateMockSales(100, dateRange);
  
  // Count sales by payment method
  const methodCounts = {
    [PaymentMethod.CREDIT]: 0,
    [PaymentMethod.DEBIT]: 0,
    [PaymentMethod.PIX]: 0
  };
  
  sales.forEach(sale => {
    if (methodCounts[sale.paymentMethod] !== undefined) {
      methodCounts[sale.paymentMethod]++;
    }
  });
  
  // Calculate percentages
  const total = sales.length;
  const methodNames = {
    [PaymentMethod.CREDIT]: "Crédito",
    [PaymentMethod.DEBIT]: "Débito",
    [PaymentMethod.PIX]: "Pix"
  };
  
  return [
    { name: methodNames[PaymentMethod.CREDIT], value: Math.round((methodCounts[PaymentMethod.CREDIT] / total) * 100) },
    { name: methodNames[PaymentMethod.DEBIT], value: Math.round((methodCounts[PaymentMethod.DEBIT] / total) * 100) },
    { name: methodNames[PaymentMethod.PIX], value: Math.round((methodCounts[PaymentMethod.PIX] / total) * 100) }
  ];
};
