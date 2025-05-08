
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
      business_name: `Business Name ${i}`,
      commission_rate: Math.random() * 10, // Random commission rate between 0-10%
      created_at: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
      updated_at: new Date(Date.now() - Math.random() * 1000000000).toISOString(),
      contact_name: `Contact Person ${i}`,
      email: `partner${i}@example.com`,
      phone: `+55 11 ${Math.floor(10000000 + Math.random() * 90000000)}`,
      address: `Street ${i}, Building ${Math.floor(Math.random() * 1000)}`,
      // Properties to match the Partner interface
      total_sales: Math.floor(Math.random() * 1000),
      total_commission: Math.floor(Math.random() * 50000) / 100
    };
    
    partners.push(partner);
  }
  
  return partners;
};

/**
 * Filters partners data based on search term
 * @param partners Array of partners to filter
 * @param searchTerm Search term to filter by
 * @returns Filtered partners array
 */
export const filterPartners = (partners: Partner[], searchTerm: string): Partner[] => {
  if (!searchTerm) {
    return partners;
  }
  
  const term = searchTerm.toLowerCase();
  return partners.filter(partner => 
    partner.company_name.toLowerCase().includes(term) ||
    partner.business_name.toLowerCase().includes(term) ||
    partner.contact_name.toLowerCase().includes(term) ||
    partner.email.toLowerCase().includes(term) ||
    partner.phone.toLowerCase().includes(term)
  );
};
