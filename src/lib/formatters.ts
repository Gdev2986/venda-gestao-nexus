
/**
 * Format a date to a localized string
 */
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('pt-BR').format(date);
};

/**
 * Format a number as currency (BRL)
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

/**
 * Format a percentage value
 */
export const formatPercent = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value / 100);
};

/**
 * Format a document number (CPF/CNPJ)
 */
export const formatDocument = (doc: string): string => {
  // Remove non-numeric characters
  const numbers = doc.replace(/\D/g, '');
  
  // Format as CPF or CNPJ based on length
  if (numbers.length === 11) {
    // CPF: 000.000.000-00
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  } else if (numbers.length === 14) {
    // CNPJ: 00.000.000/0000-00
    return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  }
  
  // If doesn't match expected lengths, return original
  return doc;
};

/**
 * Format a phone number
 */
export const formatPhone = (phone: string): string => {
  // Remove non-numeric characters
  const numbers = phone.replace(/\D/g, '');
  
  // Format based on length
  if (numbers.length === 11) {
    // Mobile: (00) 00000-0000
    return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  } else if (numbers.length === 10) {
    // Landline: (00) 0000-0000
    return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }
  
  // If doesn't match expected lengths, return original
  return phone;
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};
