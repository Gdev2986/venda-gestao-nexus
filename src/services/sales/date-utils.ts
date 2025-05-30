
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
      
      // Create date in Brazilian timezone (UTC-3)
      // We need to create the date as if it's in Brazil, then convert to UTC properly
      const brazilDate = new Date(
        parseInt(year),
        parseInt(month) - 1, // Month is 0-indexed
        parseInt(day),
        parseInt(hours),
        parseInt(minutes),
        parseInt(seconds)
      );
      
      // Verificar se a data é válida
      if (isNaN(brazilDate.getTime())) {
        console.warn('Invalid date created:', dateStr, brazilDate);
        return new Date().toISOString();
      }
      
      // Adjust for Brazilian timezone (UTC-3)
      // The date was created as local time, but we need to treat it as Brazilian time
      // So we need to add 3 hours to convert from Brazil time to UTC
      const utcDate = new Date(brazilDate.getTime() + (3 * 60 * 60 * 1000));
      
      return utcDate.toISOString();
    }
  }
  
  // If no pattern matches, try to parse as-is
  try {
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
      // Apply the same Brazilian timezone adjustment
      const utcDate = new Date(date.getTime() + (3 * 60 * 60 * 1000));
      return utcDate.toISOString();
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
