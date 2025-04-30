
import { PaymentMethod, Sale } from "@/types";

// Mock data generator
export const generateMockSales = (count = 50): Sale[] => {
  const sales: Sale[] = [];
  const terminals = ["T123456", "T789012", "T345678", "T901234"];
  const methods = [PaymentMethod.CREDIT, PaymentMethod.DEBIT, PaymentMethod.PIX];
  
  for (let i = 0; i < count; i++) {
    const grossAmount = Math.random() * 1000;
    const netAmount = grossAmount * 0.97; // 3% fee
    
    sales.push({
      id: `sale_${i}`,
      code: `VND${Math.floor(Math.random() * 100000).toString().padStart(6, '0')}`,
      date: new Date(Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000),
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
