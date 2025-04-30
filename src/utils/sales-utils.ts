
import { PaymentMethod, Sale } from "@/types";

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

// Generate monthly sales data for charts based on date range
export const generateMonthlySalesData = (dateRange?: { from: Date; to: Date }) => {
  const startDate = dateRange?.from || new Date(new Date().getFullYear(), 0, 1); // Default to Jan 1st this year
  const endDate = dateRange?.to || new Date();
  
  // Get all months between start date and end date
  const months = [];
  const startMonth = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
  const endMonth = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
  
  const monthNames = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
  
  // Generate data for each month in range
  let currentMonth = new Date(startMonth);
  while (currentMonth <= endMonth) {
    const month = currentMonth.getMonth();
    const year = currentMonth.getFullYear();
    
    // Generate a value that increases gradually over time with some randomness
    const baseValue = 1000 + (year - 2020) * 500 + month * 200; 
    const randomFactor = 0.7 + Math.random() * 0.6; // Random between 0.7 and 1.3
    const total = Math.round(baseValue * randomFactor);
    
    months.push({
      name: monthNames[month],
      total: total
    });
    
    // Move to next month
    currentMonth.setMonth(currentMonth.getMonth() + 1);
  }
  
  return months;
};

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
