
// Mask for phone numbers
export const phoneMask = (value: string): string => {
  if (!value) return '';
  
  // Remove non-numeric characters
  const numericValue = value.replace(/\D/g, '');
  
  // Format phone number
  if (numericValue.length <= 2) {
    return `(${numericValue}`;
  } else if (numericValue.length <= 6) {
    return `(${numericValue.substring(0, 2)}) ${numericValue.substring(2)}`;
  } else if (numericValue.length <= 10) {
    return `(${numericValue.substring(0, 2)}) ${numericValue.substring(2, 6)}-${numericValue.substring(6)}`;
  } else {
    return `(${numericValue.substring(0, 2)}) ${numericValue.substring(2, 7)}-${numericValue.substring(7, 11)}`;
  }
};

// For PixKeyForm component
export const maskCPF = (value: string): string => {
  if (!value) return '';
  
  const numericValue = value.replace(/\D/g, '');
  
  if (numericValue.length <= 3) {
    return numericValue;
  } else if (numericValue.length <= 6) {
    return `${numericValue.substring(0, 3)}.${numericValue.substring(3)}`;
  } else if (numericValue.length <= 9) {
    return `${numericValue.substring(0, 3)}.${numericValue.substring(3, 6)}.${numericValue.substring(6)}`;
  } else {
    return `${numericValue.substring(0, 3)}.${numericValue.substring(3, 6)}.${numericValue.substring(6, 9)}-${numericValue.substring(9, 11)}`;
  }
};

export const maskCNPJ = (value: string): string => {
  if (!value) return '';
  
  const numericValue = value.replace(/\D/g, '');
  
  if (numericValue.length <= 2) {
    return numericValue;
  } else if (numericValue.length <= 5) {
    return `${numericValue.substring(0, 2)}.${numericValue.substring(2)}`;
  } else if (numericValue.length <= 8) {
    return `${numericValue.substring(0, 2)}.${numericValue.substring(2, 5)}.${numericValue.substring(5)}`;
  } else if (numericValue.length <= 12) {
    return `${numericValue.substring(0, 2)}.${numericValue.substring(2, 5)}.${numericValue.substring(5, 8)}/${numericValue.substring(8)}`;
  } else {
    return `${numericValue.substring(0, 2)}.${numericValue.substring(2, 5)}.${numericValue.substring(5, 8)}/${numericValue.substring(8, 12)}-${numericValue.substring(12, 14)}`;
  }
};

// Alias for phone mask to match function name in PixKeyForm
export const maskPhoneNumber = phoneMask;

// Mask for CEP (Brazilian postal code)
export const cepMask = (value: string): string => {
  if (!value) return '';
  
  const numericValue = value.replace(/\D/g, '');
  
  if (numericValue.length <= 5) {
    return numericValue;
  } else {
    return `${numericValue.substring(0, 5)}-${numericValue.substring(5, 8)}`;
  }
};

// Mask for currency (BRL)
export const currencyMask = (value: number | string): string => {
  if (value === undefined || value === null || value === '') return 'R$ 0,00';
  
  let numericValue: number;
  
  if (typeof value === 'string') {
    // Remove non-numeric characters except decimal point
    const cleanValue = value.replace(/[^\d.,]/g, '').replace(',', '.');
    numericValue = parseFloat(cleanValue);
    
    if (isNaN(numericValue)) return 'R$ 0,00';
  } else {
    numericValue = value;
  }
  
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(numericValue);
};

// Mask for dates (dd/mm/yyyy)
export const dateMask = (value: string): string => {
  if (!value) return '';
  
  const numericValue = value.replace(/\D/g, '');
  
  if (numericValue.length <= 2) {
    return numericValue;
  } else if (numericValue.length <= 4) {
    return `${numericValue.substring(0, 2)}/${numericValue.substring(2)}`;
  } else {
    return `${numericValue.substring(0, 2)}/${numericValue.substring(2, 4)}/${numericValue.substring(4, 8)}`;
  }
};
