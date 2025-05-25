
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export const parseCurrency = (value: string): number => {
  // Remove all non-numeric characters except dots and commas
  const cleanValue = value.replace(/[^\d.,]/g, '');
  
  // Replace comma with dot for decimal separation
  const normalizedValue = cleanValue.replace(',', '.');
  
  return parseFloat(normalizedValue) || 0;
};
