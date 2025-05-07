
import { Partner } from "@/types";

/**
 * Generates mock partner data for development and testing
 * @param count Number of partners to generate
 * @returns An array of mock partner data
 */
export const generateMockPartners = (count: number): Partner[] => {
  const partners: Partner[] = [];
  
  for (let i = 1; i <= count; i++) {
    const partner: Partner = {
      id: `partner-${i}`,
      company_name: `Partner Company ${i}`,
      commission_rate: Math.random() * 10, // Random commission rate between 0-10%
      created_at: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
      updated_at: new Date(Date.now() - Math.random() * 1000000000).toISOString(),
      contact_name: `Contact Person ${i}`,
      email: `partner${i}@example.com`,
      phone: `+55 11 ${Math.floor(10000000 + Math.random() * 90000000)}`,
      status: Math.random() > 0.2 ? 'active' : 'inactive',
      address: `Street ${i}, Building ${Math.floor(Math.random() * 1000)}`,
      city: ['São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Brasília', 'Salvador'][Math.floor(Math.random() * 5)],
      state: ['SP', 'RJ', 'MG', 'DF', 'BA'][Math.floor(Math.random() * 5)],
      total_sales: Math.floor(Math.random() * 1000),
      total_commission: Math.floor(Math.random() * 50000) / 100
    };
    
    partners.push(partner);
  }
  
  return partners;
};
