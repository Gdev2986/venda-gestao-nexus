
// Format CNPJ: 00000000000000 -> 00.000.000/0001-00
export function formatCNPJ(cnpj: string): string {
  // Remove non-numeric characters
  cnpj = cnpj.replace(/\D/g, '');
  
  // Ensure it's the right length
  if (cnpj.length !== 14) {
    return cnpj;
  }
  
  // Format as 00.000.000/0001-00
  return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
}

// Remove CNPJ formatting: 00.000.000/0001-00 -> 00000000000000
export function cleanCNPJ(cnpj: string): string {
  return cnpj.replace(/\D/g, '');
}

// Format phone: 00000000000 -> (00) 00000-0000
export function formatPhone(phone: string): string {
  // Remove non-numeric characters
  phone = phone.replace(/\D/g, '');
  
  // Ensure it's the right length (11 digits for Brazilian mobile, 10 for landline)
  if (phone.length !== 10 && phone.length !== 11) {
    return phone;
  }
  
  // Format as (00) 0000-0000 or (00) 00000-0000
  if (phone.length === 11) {
    return phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  } else {
    return phone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }
}

// Format CEP: 00000000 -> 00000-000
export function formatCEP(cep: string): string {
  // Remove non-numeric characters
  cep = cep.replace(/\D/g, '');
  
  // Ensure it's the right length
  if (cep.length !== 8) {
    return cep;
  }
  
  // Format as 00000-000
  return cep.replace(/(\d{5})(\d{3})/, '$1-$2');
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
  
  // Validate check digits
  // This is a simplified implementation - for production, consider a more thorough validation
  return true;
}
