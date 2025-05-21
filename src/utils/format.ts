
/**
 * Formata um valor numérico para moeda brasileira (R$)
 * @param value Valor numérico a ser formatado
 * @returns String formatada em padrão monetário brasileiro
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

/**
 * Formata uma data para o padrão brasileiro
 * @param date Data a ser formatada
 * @returns String no formato DD/MM/YYYY
 */
export const formatDate = (date: Date | string): string => {
  if (!date) return '';
  
  const d = typeof date === 'string' ? new Date(date) : date;
  
  return new Intl.NumberFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(d);
};

/**
 * Formata um CPF/CNPJ para exibição
 * @param value String contendo o CPF ou CNPJ
 * @returns String formatada no padrão xxx.xxx.xxx-xx ou xx.xxx.xxx/xxxx-xx
 */
export const formatDocument = (value: string): string => {
  if (!value) return '';
  
  // Remove caracteres não numéricos
  const numbers = value.replace(/\D/g, '');
  
  if (numbers.length === 11) {
    // CPF: xxx.xxx.xxx-xx
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  } else if (numbers.length === 14) {
    // CNPJ: xx.xxx.xxx/xxxx-xx
    return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  }
  
  return numbers;
};

/**
 * Formata um número de telefone para exibição
 * @param value String contendo o número de telefone
 * @returns String formatada no padrão (xx) xxxxx-xxxx
 */
export const formatPhone = (value: string): string => {
  if (!value) return '';
  
  // Remove caracteres não numéricos
  const numbers = value.replace(/\D/g, '');
  
  if (numbers.length === 11) {
    // Celular: (xx) xxxxx-xxxx
    return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  } else if (numbers.length === 10) {
    // Fixo: (xx) xxxx-xxxx
    return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }
  
  return numbers;
};
