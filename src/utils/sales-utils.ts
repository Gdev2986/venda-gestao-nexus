
import { v4 as uuidv4 } from "uuid";
import { Sale } from "@/types";
import { NormalizedSale, formatDateStandard } from './sales-processor';
import { formatCurrency } from "@/lib/formatters";

export const generateMockSalesData = (count = 10): NormalizedSale[] => {
  const sources = ['Rede Cartão', 'Rede Pix', 'PagSeguro', 'Sigma'];
  const paymentTypes = ['Cartão de Crédito', 'Cartão de Débito', 'Pix'];
  const statuses = ['Aprovada', 'Rejeitada', 'Pendente', 'Cancelada'];
  const brands = ['Visa', 'Mastercard', 'Elo', 'Amex', 'Pix'];
  const terminals = ['TERM001', 'TERM002', 'TERM003', 'TERM004', 'TERM005'];
  
  const result: NormalizedSale[] = [];
  
  for (let i = 0; i < count; i++) {
    const source = sources[Math.floor(Math.random() * sources.length)];
    const payment_type = paymentTypes[Math.floor(Math.random() * paymentTypes.length)];
    
    // Make sure Pix is always paid in full with Pix brand
    let brand = payment_type === 'Pix' 
      ? 'Pix' 
      : brands[Math.floor(Math.random() * (brands.length - 1))]; // Exclude Pix from cards
    
    const installments = payment_type === 'Pix' || payment_type === 'Cartão de Débito'
      ? 1
      : Math.floor(Math.random() * 12) + 1; // 1-12 installments for credit card
    
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 30)); // Random date in the last 30 days
    
    const gross_amount = Number((Math.random() * 1000 + 50).toFixed(2));
    
    result.push({
      id: `mock-${i}`,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      payment_type,
      gross_amount,
      transaction_date: formatDateStandard(date.toISOString().split('T')[0]),
      installments,
      terminal: terminals[Math.floor(Math.random() * terminals.length)],
      brand,
      source,
      formatted_amount: formatCurrency(gross_amount)
    });
  }
  
  return result;
};

export const calculateSalesTotals = (sales: NormalizedSale[]) => {
  const totalAmount = sales.reduce((sum, sale) => sum + sale.gross_amount, 0);
  const averageAmount = sales.length > 0 ? totalAmount / sales.length : 0;
  const uniqueTerminals = new Set(sales.map(sale => sale.terminal)).size;
  
  return {
    totalAmount,
    averageAmount,
    uniqueTerminals
  };
};

export const convertNormalizedSalesToSales = (normalizedSales: NormalizedSale[]): Sale[] => {
  return normalizedSales.map(sale => {
    // Calculate net amount (simple example: 97% of gross amount)
    const net_amount = sale.gross_amount * 0.97;
    
    return {
      id: sale.id || uuidv4(),
      code: sale.id || uuidv4().split('-')[0],
      terminal: sale.terminal,
      client_name: "Cliente", // Default value
      client_id: "",
      gross_amount: sale.gross_amount,
      net_amount: net_amount,
      date: typeof sale.transaction_date === 'string' 
        ? sale.transaction_date 
        : sale.transaction_date.toISOString(),
      payment_method: sale.payment_type.toLowerCase().includes('crédito') || sale.payment_type.toLowerCase().includes('credito')
        ? "credit" 
        : sale.payment_type.toLowerCase().includes('débito') || sale.payment_type.toLowerCase().includes('debito')
          ? "debit" 
          : "pix",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      status: sale.status
    };
  });
};

// Generate daily sales data for the last 30 days
export const generateDailySalesData = () => {
  const days = 30;
  const today = new Date();
  const data = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    data.push({
      date: date.toISOString().split('T')[0],
      sales: Number((Math.random() * 1000 + 100).toFixed(2))
    });
  }
  return data;
};

// Generate payment methods data
export const generatePaymentMethodsData = () => {
  return [
    { method: 'Cartão de Crédito', value: Math.floor(Math.random() * 1000 + 500) },
    { method: 'Cartão de Débito', value: Math.floor(Math.random() * 800 + 300) },
    { method: 'Pix', value: Math.floor(Math.random() * 1200 + 400) },
  ];
};
