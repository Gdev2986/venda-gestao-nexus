
/**
 * Formata uma data em string localizada
 */
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('pt-BR').format(date);
};

/**
 * Formata um número como moeda (BRL)
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

/**
 * Formata um valor percentual
 */
export const formatPercent = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value / 100);
};

/**
 * Formata um número de documento (CPF/CNPJ)
 */
export const formatDocument = (doc: string): string => {
  // Remove caracteres não numéricos
  const numbers = doc.replace(/\D/g, '');
  
  // Formata como CPF ou CNPJ baseado no comprimento
  if (numbers.length === 11) {
    // CPF: 000.000.000-00
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  } else if (numbers.length === 14) {
    // CNPJ: 00.000.000/0000-00
    return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  }
  
  // Se não corresponder aos comprimentos esperados, retorna o original
  return doc;
};

/**
 * Formata um número de telefone
 */
export const formatPhone = (phone: string): string => {
  // Remove caracteres não numéricos
  const numbers = phone.replace(/\D/g, '');
  
  // Formata baseado no comprimento
  if (numbers.length === 11) {
    // Celular: (00) 00000-0000
    return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  } else if (numbers.length === 10) {
    // Telefone fixo: (00) 0000-0000
    return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }
  
  // Se não corresponder aos comprimentos esperados, retorna o original
  return phone;
};

/**
 * Trunca texto com reticências
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};
