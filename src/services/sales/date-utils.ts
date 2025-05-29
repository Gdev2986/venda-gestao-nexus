
// Helper function to convert Brazilian date format to ISO
export const convertBrazilianDateToISO = (dateStr: string): string => {
  // Handle different Brazilian date formats
  const patterns = [
    /^(\d{2})\/(\d{2})\/(\d{4})\s+(\d{2}):(\d{2})$/,     // dd/MM/yyyy HH:mm
    /^(\d{2})\/(\d{2})\/(\d{4})\s+(\d{2}):(\d{2}):(\d{2})$/, // dd/MM/yyyy HH:mm:ss
    /^(\d{2})\/(\d{2})\/(\d{4})$/,                        // dd/MM/yyyy
  ];

  for (const pattern of patterns) {
    const match = dateStr.match(pattern);
    if (match) {
      const [, day, month, year, hours = '00', minutes = '00', seconds = '00'] = match;
      // Create ISO string: YYYY-MM-DDTHH:mm:ss.sssZ
      // CORRIGIR: usar timezone local em vez de UTC
      const isoDate = new Date(
        parseInt(year),
        parseInt(month) - 1, // Month is 0-indexed
        parseInt(day),
        parseInt(hours),
        parseInt(minutes),
        parseInt(seconds)
      );
      
      // Verificar se a data é válida
      if (isNaN(isoDate.getTime())) {
        console.warn('Invalid date created:', dateStr, isoDate);
        return new Date().toISOString();
      }
      
      return isoDate.toISOString();
    }
  }
  
  // If no pattern matches, try to parse as-is
  try {
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
      return date.toISOString();
    }
  } catch (e) {
    console.warn('Could not parse date:', dateStr);
  }
  
  // Fallback to current date
  return new Date().toISOString();
};

// Helper function to convert payment type to enum
export const convertPaymentMethod = (paymentType: string): "CREDIT" | "DEBIT" | "PIX" => {
  const normalizedType = paymentType.toLowerCase();
  if (normalizedType.includes('crédito') || normalizedType.includes('credito')) {
    return 'CREDIT';
  } else if (normalizedType.includes('débito') || normalizedType.includes('debito')) {
    return 'DEBIT';
  } else {
    return 'PIX';
  }
};
