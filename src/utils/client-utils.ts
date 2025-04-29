
// Format CNPJ: 00000000000000 -> 00.000.000/0001-00
export function formatCNPJ(cnpj: string): string {
  // Remove non-numeric characters
  cnpj = cnpj.replace(/\D/g, '');
  
  // Ensure it's the right length
  if (cnpj.length > 14) {
    cnpj = cnpj.substring(0, 14);
  }
  
  // Apply partial formatting based on the length
  if (cnpj.length <= 2) {
    return cnpj;
  } else if (cnpj.length <= 5) {
    return cnpj.replace(/(\d{2})(\d+)/, '$1.$2');
  } else if (cnpj.length <= 8) {
    return cnpj.replace(/(\d{2})(\d{3})(\d+)/, '$1.$2.$3');
  } else if (cnpj.length <= 12) {
    return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d+)/, '$1.$2.$3/$4');
  } else {
    return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  }
}

// Remove CNPJ formatting: 00.000.000/0001-00 -> 00000000000000
export function cleanCNPJ(cnpj: string): string {
  return cnpj.replace(/\D/g, '');
}

// Format phone: 00000000000 -> (00) 00000-0000
export function formatPhone(phone: string): string {
  // Remove non-numeric characters
  phone = phone.replace(/\D/g, '');
  
  // Limit to max 11 digits
  if (phone.length > 11) {
    phone = phone.substring(0, 11);
  }

  // Apply partial formatting based on the length
  if (phone.length <= 2) {
    return phone;
  } else if (phone.length <= 6) {
    return phone.replace(/(\d{2})(\d+)/, '($1) $2');
  } else if (phone.length <= 10) {
    return phone.replace(/(\d{2})(\d{4})(\d+)/, '($1) $2-$3');
  } else {
    return phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }
}

// Format CEP: 00000000 -> 00000-000
export function formatCEP(cep: string): string {
  // Remove non-numeric characters
  cep = cep.replace(/\D/g, '');
  
  // Limit to max 8 digits
  if (cep.length > 8) {
    cep = cep.substring(0, 8);
  }
  
  // Apply partial formatting based on the length
  if (cep.length <= 5) {
    return cep;
  } else {
    return cep.replace(/(\d{5})(\d+)/, '$1-$2');
  }
}

// Validate email
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validate CNPJ
export function isValidCNPJ(cnpj: string): boolean {
  cnpj = cleanCNPJ(cnpj);
  
  // Check for obvious errors
  if (cnpj.length !== 14 || 
      cnpj === '00000000000000' || 
      cnpj === '11111111111111' ||
      cnpj === '22222222222222') {
    return false;
  }
  
  // Validate first check digit
  let sum = 0;
  let weight = 5;
  for (let i = 0; i < 12; i++) {
    sum += parseInt(cnpj.charAt(i)) * weight;
    weight = (weight === 2) ? 9 : weight - 1;
  }
  let checkDigit1 = 11 - (sum % 11);
  checkDigit1 = (checkDigit1 >= 10) ? 0 : checkDigit1;
  
  // Validate second check digit
  sum = 0;
  weight = 6;
  for (let i = 0; i < 13; i++) {
    sum += parseInt(cnpj.charAt(i)) * weight;
    weight = (weight === 2) ? 9 : weight - 1;
  }
  let checkDigit2 = 11 - (sum % 11);
  checkDigit2 = (checkDigit2 >= 10) ? 0 : checkDigit2;
  
  // Check if the calculated check digits match the provided ones
  return parseInt(cnpj.charAt(12)) === checkDigit1 && parseInt(cnpj.charAt(13)) === checkDigit2;
}

// Format currency: 1000 -> R$ 1.000,00
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}

// Parse currency string to number: R$ 1.000,00 -> 1000
export function parseCurrency(value: string): number {
  return parseFloat(value.replace(/[^\d,.-]/g, '').replace(',', '.'));
}

// Format date to Brazilian format: 2023-03-15 -> 15/03/2023
export function formatDate(date: Date | string): string {
  if (typeof date === 'string') {
    date = new Date(date);
  }
  return date.toLocaleDateString('pt-BR');
}

// Format percentage: 0.15 -> 15%
export function formatPercentage(value: number): string {
  return `${(value * 100).toFixed(2)}%`;
}

// Validate CEP
export function isValidCEP(cep: string): boolean {
  cep = cep.replace(/\D/g, '');
  return cep.length === 8;
}

// Auto format input value based on type
export function autoFormatValue(value: string, type: 'cnpj' | 'phone' | 'cep' | 'currency'): string {
  switch (type) {
    case 'cnpj':
      return formatCNPJ(value);
    case 'phone':
      return formatPhone(value);
    case 'cep':
      return formatCEP(value);
    case 'currency':
      // Convert string to number, then format
      const numValue = parseFloat(value.replace(/[^\d,.-]/g, '').replace(',', '.'));
      return isNaN(numValue) ? 'R$ 0,00' : formatCurrency(numValue);
    default:
      return value;
  }
}
