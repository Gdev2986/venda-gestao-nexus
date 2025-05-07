import { faker } from '@faker-js/faker';
import { PaymentMethod, Sale } from "@/types";

/**
 * Generates a random date within the last year
 */
export const getRandomDate = (): Date => {
  const today = new Date();
  const lastYear = new Date(today);
  lastYear.setFullYear(today.getFullYear() - 1);
  return faker.date.between({ from: lastYear, to: today });
};

/**
 * Generates a random amount between min and max
 */
export const getRandomAmount = (min: number, max: number): number => {
  const amount = faker.number.float({ min, max, precision: 2 });
  return parseFloat(amount.toFixed(2));
};

/**
 * Generates a random payment method
 */
export const getRandomPaymentMethod = (): PaymentMethod => {
  const methods = Object.values(PaymentMethod);
  return methods[Math.floor(Math.random() * methods.length)];
};

/**
 * Generates a random sale object
 */
export const generateRandomSale = (): Sale => {
  const gross_amount = getRandomAmount(50, 2000);
  const net_amount = gross_amount * 0.8; // Simulate a 20% reduction
  return {
    id: faker.string.uuid(),
    code: faker.string.alphanumeric(8),
    terminal: faker.string.alphanumeric(6),
    client_name: faker.company.name(),
    gross_amount: gross_amount,
    net_amount: net_amount,
    date: getRandomDate().toISOString(),
    payment_method: getRandomPaymentMethod(),
    client_id: faker.string.uuid(),
    created_at: getRandomDate().toISOString(),
    updated_at: getRandomDate().toISOString()
  };
};

/**
 * Generates an array of random sale objects
 */
export const generateSales = (count: number): Sale[] => {
  return Array.from({ length: count }, () => generateRandomSale());
};

export const generateMockSalesData = (count: number): Sale[] => {
  const mockSales: Sale[] = [];
  const today = new Date();
  const paymentMethods = Object.values(PaymentMethod);
  
  const clients = [
    "Empresa A",
    "Empresa B",
    "Empresa C", 
    "Comércio XYZ",
    "Tech Solutions"
  ];
  
  const terminals = ["T100", "T101", "T102", "T103", "T104"];
  
  for (let i = 0; i < count; i++) {
    const createdDate = new Date(today);
    createdDate.setDate(today.getDate() - Math.floor(Math.random() * 30));
    
    const grossAmount = Math.floor(Math.random() * 10000) / 10;
    const fee = grossAmount * 0.05; // 5% fee
    const netAmount = grossAmount - fee;
    
    const clientIndex = Math.floor(Math.random() * clients.length);
    const terminalIndex = Math.floor(Math.random() * terminals.length);
    const paymentMethodIndex = Math.floor(Math.random() * paymentMethods.length);
    
    mockSales.push({
      id: `sale-${i + 1}`,
      code: `VND${String(i + 1).padStart(3, '0')}`,
      terminal: terminals[terminalIndex],
      client_name: clients[clientIndex],
      gross_amount: grossAmount,
      net_amount: netAmount,
      date: createdDate.toISOString(),
      payment_method: paymentMethods[paymentMethodIndex],
      client_id: `client-${clientIndex + 1}`,
      created_at: createdDate.toISOString(),
      updated_at: createdDate.toISOString()
    });
  }
  
  return mockSales;
};

/**
 * Helper function to filter sales data based on search term
 */
export const filterSalesData = (sales: Sale[], searchTerm: string): Sale[] => {
  if (!searchTerm) {
    return sales;
  }

  const lowerSearchTerm = searchTerm.toLowerCase();

  return sales.filter(sale => {
    return (
      sale.code.toLowerCase().includes(lowerSearchTerm) ||
      sale.terminal.toLowerCase().includes(lowerSearchTerm) ||
      sale.client_name.toLowerCase().includes(lowerSearchTerm) ||
      sale.payment_method.toLowerCase().includes(lowerSearchTerm)
    );
  });
};
