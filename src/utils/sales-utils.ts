
// Import types
import { NormalizedSale } from "@/pages/admin/Sales";
import { Sale } from "@/types";

// Function to generate random sales data for testing
export const generateMockSalesData = (count: number = 50): NormalizedSale[] => {
  const paymentTypes = ["Cartão de Crédito", "Cartão de Débito", "Pix"];
  const statuses = ["Aprovada", "Pendente", "Rejeitada"];
  const terminals = ["T100", "T101", "T102", "T103", "T104", "T105"];
  const brands = ["Visa", "Mastercard", "Elo", "Pix", "Amex"];
  const sources = ["PagSeguro", "Rede Cartão", "Rede Pix", "Sigma"];
  
  const mockData: NormalizedSale[] = [];
  
  for (let i = 0; i < count; i++) {
    // Choose random payment type
    const paymentType = paymentTypes[Math.floor(Math.random() * paymentTypes.length)];
    
    // Determine brand and installments based on payment type
    let brand = brands[Math.floor(Math.random() * (brands.length - 1))]; // Exclude "Pix" by default
    let installments = Math.floor(Math.random() * 12) + 1;
    
    // Override for Pix
    if (paymentType === "Pix") {
      brand = "Pix";
      installments = 1;
    }
    
    // Generate random date between 90 days ago and now
    const now = new Date();
    const pastDate = new Date(now.getTime() - Math.random() * 90 * 24 * 60 * 60 * 1000);
    
    mockData.push({
      id: `mock-${i}`,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      payment_type: paymentType,
      gross_amount: Math.floor(Math.random() * 1000000) / 100, // Random amount between 0 and 10,000
      transaction_date: pastDate,
      installments: installments,
      terminal: terminals[Math.floor(Math.random() * terminals.length)],
      brand: brand,
      source: sources[Math.floor(Math.random() * sources.length)]
    });
  }
  
  return mockData;
};

// Alias for backward compatibility
export const generateMockSales = generateMockSalesData;

// Function to generate daily sales data for charts
export const generateDailySalesData = (days: number = 30) => {
  const result = [];
  const now = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(now.getDate() - i);
    
    result.push({
      date: date.toISOString().split('T')[0],
      amount: Math.random() * 10000 + 1000
    });
  }
  
  return result;
};

// Function to generate payment methods breakdown data
export const generatePaymentMethodsData = () => {
  return [
    { name: "Crédito", value: Math.floor(Math.random() * 5000) + 3000 },
    { name: "Débito", value: Math.floor(Math.random() * 3000) + 1000 },
    { name: "Pix", value: Math.floor(Math.random() * 2000) + 500 },
  ];
};

// Function to calculate sales totals
export const calculateSalesTotals = (sales: NormalizedSale[]) => {
  return {
    grossAmount: sales.reduce((sum, sale) => sum + sale.gross_amount, 0),
    netAmount: sales.reduce((sum, sale) => {
      // Calculate a simulated net amount (gross minus ~3% fee)
      const fee = sale.gross_amount * 0.03;
      return sum + (sale.gross_amount - fee);
    }, 0),
  };
};

// Function to convert NormalizedSale to Sale type
export const convertNormalizedSaleToSale = (normalizedSale: NormalizedSale): Sale => {
  return {
    id: normalizedSale.id || "",
    code: normalizedSale.id || "",
    terminal: normalizedSale.terminal,
    client_name: "Cliente", // Default value
    gross_amount: normalizedSale.gross_amount,
    net_amount: normalizedSale.gross_amount * 0.97, // 3% fee
    date: typeof normalizedSale.transaction_date === 'string' 
      ? normalizedSale.transaction_date 
      : normalizedSale.transaction_date.toISOString(),
    payment_method: normalizedSale.payment_type.toLowerCase().includes('crédito') 
      ? "credit" 
      : normalizedSale.payment_type.toLowerCase().includes('débito') 
        ? "debit" 
        : "pix",
    client_id: "",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    status: normalizedSale.status,
  };
};

// Function to convert array of NormalizedSale to array of Sale
export const convertNormalizedSalesToSales = (normalizedSales: NormalizedSale[]): Sale[] => {
  return normalizedSales.map(convertNormalizedSaleToSale);
};
