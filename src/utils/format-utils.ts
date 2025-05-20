
/**
 * Format a number as Brazilian currency (BRL)
 * @param value The value to format
 * @returns Formatted currency string
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

/**
 * Format a number with thousand separators
 * @param value The value to format
 * @returns Formatted number string with thousand separators
 */
export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('pt-BR').format(value);
};

/**
 * Format a percentage value
 * @param value The value to format (e.g. 0.12 for 12%)
 * @param showPlusSign Whether to show a plus sign for positive values
 * @returns Formatted percentage string
 */
export const formatPercentage = (value: number, showPlusSign = false): string => {
  const formatted = new Intl.NumberFormat('pt-BR', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value);
  
  return value > 0 && showPlusSign ? `+${formatted}` : formatted;
};

/**
 * Format a commission block/plan name for display
 * @param name The name of the commission block/plan
 * @returns Formatted commission block/plan name
 */
export const formatCommissionPlan = (name: string): string => {
  return name || 'Plano Padrão';
};
