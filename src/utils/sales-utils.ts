
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
  const amount = faker.number.float({ min, max, fractionDigits: 2 });
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
    code: faker.string.alphanumeric(8).toUpperCase(),
    terminal: `T${faker.number.int({ min: 100, max: 200 })}`,
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
export const generateMockSalesData = (count: number): Sale[] => {
  return Array.from({ length: count }, () => generateRandomSale());
};

// Adding alias for backward compatibility
export const generateMockSales = (count: number, dateRange?: { from: Date; to: Date }): Sale[] => {
  if (!dateRange) {
    return generateMockSalesData(count);
  }

  // Filter sales to be within the date range
  const sales = generateMockSalesData(count * 2); // Generate extra to allow for filtering
  return sales.filter(sale => {
    const saleDate = new Date(sale.date);
    return saleDate >= dateRange.from && saleDate <= dateRange.to;
  }).slice(0, count);
};

/**
 * Calculate sales totals for the Sales page
 */
export const calculateSalesTotals = (sales: Sale[]) => {
  return {
    grossAmount: sales.reduce((sum, sale) => sum + sale.gross_amount, 0),
    netAmount: sales.reduce((sum, sale) => sum + sale.net_amount, 0),
    count: sales.length
  };
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

/**
 * Generate daily sales data for charts
 */
export const generateDailySalesData = (dateRange: { from: Date; to: Date }) => {
  const result = [];
  const currentDate = new Date(dateRange.from);
  const endDate = new Date(dateRange.to);
  
  while (currentDate <= endDate) {
    result.push({
      name: currentDate.toISOString().split('T')[0],
      total: faker.number.int({ min: 200, max: 1500 })
    });
    
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return result;
};

/**
 * Generate payment methods data for charts
 */
export const generatePaymentMethodsData = (dateRange: { from: Date; to: Date }) => {
  const methods = Object.values(PaymentMethod);
  
  return methods.map(method => ({
    name: method,
    value: faker.number.int({ min: 1, max: 20 })
  }));
};
