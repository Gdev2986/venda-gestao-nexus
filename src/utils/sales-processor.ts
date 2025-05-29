
// Utility functions for processing sales data from CSV files

/**
 * Normalizes text: removes accents, converts to lowercase and trims
 */
export function normalizeText(text: string | undefined | null): string {
  if (!text) return '';
  return String(text)
    .trim()
    .toLowerCase()
    // remove accents
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

/**
 * Converts a value to number with robust cleaning for currency and formatted values
 */
export function toNumber(v: string | number): number {
  if (typeof v === 'number') {
    return Number(v) || 0;
  }
  
  if (typeof v === 'string') {
    // Remove currency symbols, quotes, and spaces
    let cleaned = v
      .replace(/["']/g, '') // Remove quotes
      .replace(/R\$/, '') // Remove R$ symbol
      .replace(/\s+/g, '') // Remove spaces
      .trim();
    
    // For Brazilian format: remove dots (thousands separator), then convert comma to dot
    // This handles cases like "1.234,56" -> "1234.56"
    cleaned = cleaned
      .replace(/\./g, '') // Remove dots (thousands separator)
      .replace(',', '.'); // Convert comma to dot for decimal
    
    return parseFloat(cleaned) || 0;
  }
  
  return 0;
}

/**
 * Gets a value from an object using multiple possible keys
 */
export function getValue(row: Record<string, any>, possibleKeys: string[], defaultValue: any = ''): any {
  // Remove quotes from possible key names
  const clean = (s: string) => normalizeText(s).replace(/"/g, '').replace(/'/g, '').trim();
  
  // First try exact keys (removing quotes)
  for (const key of possibleKeys) {
    if (row[key] !== undefined) return row[key];
    // Also try without quotes
    if (row[clean(key)] !== undefined) return row[clean(key)];
  }
  
  // Then try normalized keys
  const normalizedKeys = possibleKeys.map(k => clean(k));
  const rowKeys = Object.keys(row);
  for (const key of rowKeys) {
    const normalizedKey = clean(key);
    if (normalizedKeys.includes(normalizedKey)) {
      return row[key];
    }
  }
  return defaultValue;
}

/**
 * Formats date to standard DD/MM/YYYY HH:MM format
 */
export function formatDateStandard(dateInput: string, timeInput: string = ''): string {
  try {
    if (!dateInput) return '01/01/2000 00:00';

    let dateStr = String(dateInput);
    let timeStr = String(timeInput);

    // If timeInput is not provided but dateInput has a space
    if (!timeInput && dateInput.includes(' ')) {
      const parts = dateInput.split(' ');
      timeStr = parts[1]?.substring(0, 5) || '00:00';
      dateStr = parts[0];
    }

    const dateParts = dateStr.split(/[-\/]/);
    let day, month, year;

    if (dateStr.includes('-')) {  // ISO
      [year, month, day] = dateParts;
    } else {  // Brazilian
      [day, month, year] = dateParts;
    }

    // Ensure we have proper time format
    if (!timeStr || timeStr === '') {
      timeStr = '00:00';
    }

    return `${day?.padStart(2,'0')}/${month?.padStart(2,'0')}/${year || '2000'} ${timeStr}`;
  } catch (e) {
    console.error('Error formatting date:', e);
    return '01/01/2000 00:00';
  }
}

/**
 * Parses a date string to Date object
 */
export function parseDate(dateStr: string): Date | null {
  if (!dateStr) return null;
  
  try {
    // Try different formats
    if (dateStr.includes('/')) {
      // Format DD/MM/YYYY or DD/MM/YYYY HH:MM
      const parts = dateStr.split(' ')[0].split('/');
      const timeParts = dateStr.split(' ')[1]?.split(':') || ["0", "0"];
      
      if (parts.length >= 3) {
        return new Date(
          parseInt(parts[2]), // Year
          parseInt(parts[1]) - 1, // Month (0-11)
          parseInt(parts[0]), // Day
          parseInt(timeParts[0] || "0"), // Hour
          parseInt(timeParts[1] || "0") // Minute
        );
      }
    }
    
    // Last resort, try with native Date constructor
    return new Date(dateStr);
  } catch (e) {
    console.error('Error converting date string:', e);
    return null;
  }
}

/**
 * Formats a number as currency
 */
export function formatCurrency(value: number | string): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(toNumber(value) || 0);
}

/**
 * Detects source type based on CSV headers
 */
export function detectSourceByHeaders(data: Array<Record<string, any>>): string {
  if (!data || !data.length) return 'Desconhecido';
  
  const keys = Object.keys(data[0]);
  const normKeys = keys.map(k => normalizeText(k));
  console.log('detectSourceByHeaders keys:', keys); // debug

  // Sigma: robust to variations like "ValorVenda", "valorvenda", etc
  if (
    normKeys.some(k => k.includes('modalidade') || k.includes('tipo')) &&
    normKeys.some(k => k.replace(/\s/g, '').includes('valorvenda'))
  ) return 'Sigma';

  if (normKeys.includes('forma de pagamento') && normKeys.includes('identificacao da maquininha'))
    return 'PagSeguro';

  if (normKeys.includes('modalidade') && normKeys.includes('numero de parcelas'))
    return 'Rede Cartão';

  if (normKeys.includes('modalidade') && normKeys.includes('codigo da maquininha') &&
      data.some(r => normalizeText(getValue(r, ['modalidade', 'Modalidade', 'MODALIDADE'])) === 'pix'))
    return 'Rede Pix';

  return 'Desconhecido';
}

export interface NormalizedSale {
  status: string;
  payment_type: string;
  gross_amount: number;
  transaction_date: string | Date;
  installments: number;
  terminal: string;
  brand: string;
  source: string;
  id?: string;
  formatted_amount?: string;
}

interface NormalizeResult {
  data: NormalizedSale[];
  warnings: Array<{
    rowIndex: number;
    message: string;
  }>;
}

/**
 * Normalizes data based on source
 */
export function normalizeData(data: Array<Record<string, any>>, source: string): NormalizeResult {
  console.log(`Normalizing data for: ${source}`, data.length, 'records');
  
  const normalizedData: NormalizedSale[] = [];
  const warnings: Array<{rowIndex: number; message: string}> = [];
  
  data.forEach((row, index) => {
    // Clean the row first using cleanCsvRow
    const cleanedRow = cleanCsvRow(row);
    
    // Check if row has data
    if (!cleanedRow || Object.keys(cleanedRow).length === 0) {
      warnings.push({
        rowIndex: index,
        message: 'Empty row, skipping'
      });
      return; // Skip empty rows
    }
    
    let normalizedRow: NormalizedSale = {
      status: 'Aprovada',  // Default for all
      payment_type: '',
      gross_amount: 0,
      transaction_date: '',
      installments: 1,     // Default 1 for all
      terminal: '',
      brand: '',
      source: source
    };
    
    try {
      switch (source) {
        case 'Rede Cartão':
          normalizedRow.status = "Aprovada";
          
          const modalidadeRede = getValue(cleanedRow, [
            'modalidade', 'MODALIDADE', 'Modalidade'
          ], '').trim();
          
          if (normalizeText(modalidadeRede).includes('debito')) {
            normalizedRow.payment_type = 'Cartão de Débito';
          } else if (normalizeText(modalidadeRede).includes('credito')) {
            normalizedRow.payment_type = 'Cartão de Crédito';
          } else {
            normalizedRow.payment_type = modalidadeRede;
          }
          
          const valorBrutoRede = getValue(cleanedRow, [
            'valor da venda original', 'VALOR DA VENDA ORIGINAL', 
            'Valor da Venda Original', 'valor da venda', 'VALOR DA VENDA'
          ], 0);
          
          normalizedRow.gross_amount = toNumber(valorBrutoRede);
          
          const dataVendaRede = getValue(cleanedRow, [
            'data da venda', 'DATA DA VENDA', 'Data da Venda'
          ], '');
          
          const horaVendaRede = getValue(cleanedRow, [
            'hora da venda', 'HORA DA VENDA', 'Hora da Venda'
          ], '');
          
          normalizedRow.transaction_date = formatDateStandard(dataVendaRede, horaVendaRede);
          
          const parcelasRede = getValue(cleanedRow, [
            'número de parcelas', 'NÚMERO DE PARCELAS', 'Número de Parcelas',
            'numero de parcelas', 'NUMERO DE PARCELAS'
          ], '1');
          
          normalizedRow.installments = parseInt(parcelasRede as string) || 1;
          
          normalizedRow.terminal = getValue(cleanedRow, [
            'Terminal', 'terminal', 'TERMINAL',
            'código da maquininha', 'CÓDIGO DA MAQUININHA',
            'codigo da maquininha', 'CODIGO DA MAQUININHA'
          ], '');
          
          normalizedRow.brand = getValue(cleanedRow, [
            'bandeira', 'BANDEIRA', 'Bandeira'
          ], '');
          break;
          
        case 'Rede Pix':
          normalizedRow.status = "Aprovada";
          normalizedRow.payment_type = 'Pix';
          
          const valorPixBruto = getValue(cleanedRow, [
            'valor da venda original', 'VALOR DA VENDA ORIGINAL', 
            'Valor da Venda Original', 'valor da venda', 'VALOR DA VENDA'
          ], 0);
          
          normalizedRow.gross_amount = toNumber(valorPixBruto);
          
          const dataPixRede = getValue(cleanedRow, [
            'data da venda', 'DATA DA VENDA', 'Data da Venda'
          ], '');
          
          const horaPixRede = getValue(cleanedRow, [
            'hora da venda', 'HORA DA VENDA', 'Hora da Venda'
          ], '');
          
          normalizedRow.transaction_date = formatDateStandard(dataPixRede, horaPixRede);
          normalizedRow.installments = 1;
          
          normalizedRow.terminal = getValue(cleanedRow, [
            'código da maquininha', 'CÓDIGO DA MAQUININHA',
            'codigo da maquininha', 'CODIGO DA MAQUININHA',
            'Terminal', 'terminal', 'TERMINAL'
          ], '');
          
          normalizedRow.brand = 'Pix';
          break;
          
        case 'PagSeguro':
          normalizedRow.status = getValue(cleanedRow, [
            'Status', 'STATUS', 'status'
          ], 'Aprovada');
          
          const formaPagamento = getValue(cleanedRow, [
            'Forma de Pagamento', 'FORMA DE PAGAMENTO', 
            'forma de pagamento', 'Meio de Pagamento'
          ], '').trim();
          
          if (normalizeText(formaPagamento).includes('credito')) {
            normalizedRow.payment_type = 'Cartão de Crédito';
          } else if (normalizeText(formaPagamento).includes('debito')) {
            normalizedRow.payment_type = 'Cartão de Débito';
          } else if (normalizeText(formaPagamento).includes('pix')) {
            normalizedRow.payment_type = 'Pix';
          } else {
            normalizedRow.payment_type = formaPagamento;
          }
          
          const valorPagSeguro = getValue(cleanedRow, [
            'Valor Bruto', 'VALOR BRUTO', 'valor bruto',
            'Valor', 'VALOR', 'valor'
          ], 0);
          
          normalizedRow.gross_amount = toNumber(valorPagSeguro);
          
          const dataPagSeguro = getValue(cleanedRow, [
            'Data da Transação', 'DATA DA TRANSAÇÃO', 
            'data da transacao', 'Data', 'DATA'
          ], '');
          
          normalizedRow.transaction_date = formatDateStandard(dataPagSeguro);
          
          // Processamento corrigido da coluna Parcela para PagSeguro
          const parcelasPagSeguro = getValue(cleanedRow, [
            'Parcela', 'PARCELA', 'parcela',
            'Parcelas', 'PARCELAS', 'parcelas'
          ], '');
          
          // Lógica específica para PagSeguro
          let installments = 1;
          const parcelaStr = String(parcelasPagSeguro).trim();
          
          if (!parcelaStr || parcelaStr === '' || normalizeText(parcelaStr).includes('vista')) {
            // Se vazio ou contém "vista", usar 1
            installments = 1;
          } else if (parcelaStr.toLowerCase().includes('parcelado')) {
            // Se contém "Parcelado", extrair o número (ex: "Parcelado 2x" -> 2)
            const match = parcelaStr.match(/(\d+)/);
            installments = match ? parseInt(match[1]) : 1;
          } else {
            // Tentar converter diretamente para número
            const parsed = parseInt(parcelaStr);
            installments = isNaN(parsed) ? 1 : parsed;
          }
          
          normalizedRow.installments = installments;
          
          normalizedRow.terminal = getValue(cleanedRow, [
            'Identificação da Maquininha', 'IDENTIFICAÇÃO DA MAQUININHA',
            'Identificacao da Maquininha', 'IDENTIFICACAO DA MAQUININHA',
            'Serial_Leitor', 'SERIAL_LEITOR', 'serial_leitor',
            'Terminal', 'TERMINAL', 'terminal'
          ], '');
          
          normalizedRow.brand = getValue(cleanedRow, [
            'Bandeira', 'BANDEIRA', 'bandeira'
          ], '');
          
          if (normalizedRow.payment_type === 'Pix') {
            normalizedRow.brand = 'Pix';
            normalizedRow.installments = 1;
          }
          break;
          
        case 'Sigma':
          normalizedRow.status = getValue(cleanedRow, [
            'Situacao', 'SITUACAO', 'situacao',
            'Status', 'STATUS', 'status',
            'Estado', 'ESTADO', 'estado'
          ], 'Aprovada');

          const modalidadeSigma = getValue(cleanedRow, [
            'Modalidade', 'MODALIDADE', 'modalidade',
            'Tipo', 'TIPO', 'tipo',
            'Forma', 'FORMA', 'forma',
            'Pagamento', 'PAGAMENTO', 'pagamento'
          ], '').trim();

          const modalidadeNormalizada = normalizeText(modalidadeSigma);

          if (modalidadeNormalizada.includes('debito') || modalidadeNormalizada.includes('débito')) {
            normalizedRow.payment_type = 'Cartão de Débito';
          } else if (modalidadeNormalizada.includes('credito') || modalidadeNormalizada.includes('crédito')) {
            normalizedRow.payment_type = 'Cartão de Crédito';
          } else if (modalidadeNormalizada.includes('pix')) {
            normalizedRow.payment_type = 'Pix';
          } else {
            normalizedRow.payment_type = modalidadeSigma;
          }

          let valorSigma = getValue(cleanedRow, ['Valor Venda', 'VALOR VENDA', 'valor venda', 'ValorVenda', 'VALORVENDA', 'valorvenda'], undefined);
          if (valorSigma === undefined) {
            valorSigma = getValue(cleanedRow, ['Valor Total', 'VALOR TOTAL', 'valor total', 'ValorTotal', 'VALORTOTAL', 'valortotal'], undefined);
          }
          if (valorSigma === undefined) {
            valorSigma = getValue(cleanedRow, ['Valor', 'VALOR', 'valor'], undefined);
          }
          if (valorSigma === undefined) {
            valorSigma = getValue(cleanedRow, ['Total', 'TOTAL', 'total'], 0);
          }
          
          normalizedRow.gross_amount = toNumber(valorSigma);

          let dataSigma = getValue(cleanedRow, ['Data Venda', 'DATA VENDA', 'data venda', 'DataVenda', 'DATAVENDA', 'datavenda'], undefined);
          if (dataSigma === undefined) {
            dataSigma = getValue(cleanedRow, ['Data', 'DATA', 'data'], undefined);
          }
          if (dataSigma === undefined) {
            dataSigma = getValue(cleanedRow, ['Data Transacao', 'DATA TRANSACAO', 'data transacao', 'Data Transação', 'DATA TRANSAÇÃO', 'data transação'], '');
          }
          normalizedRow.transaction_date = formatDateStandard(dataSigma);
          if (!dataSigma) normalizedRow.transaction_date = '01/01/2000 00:00';

          let parcelasSigma = getValue(cleanedRow, ['Parcelas', 'parcelas', 'PARCELAS', 'QtdeParcelas', 'QtdParcelas'], '1');
          if (parcelasSigma === undefined) {
            parcelasSigma = getValue(cleanedRow, ['Parcela', 'parcela', 'PARCELA'], '1');
          }
          normalizedRow.installments = parseInt(parcelasSigma as string) || 1;

          let terminalSigma = getValue(cleanedRow, ['Terminal', 'terminal', 'TERMINAL', 'Maquininha', 'maquininha', 'Equipamento', 'POS'], '');
          normalizedRow.terminal = terminalSigma;

          let brandSigma = getValue(cleanedRow, ['Bandeira', 'bandeira', 'BANDEIRA', 'Cartao', 'CARTAO', 'cartao', 'Cartão', 'CARTÃO', 'cartão'], '');
          normalizedRow.brand = brandSigma;

          if (normalizedRow.payment_type === 'Pix') {
            normalizedRow.brand = 'Pix';
            normalizedRow.installments = 1;
          }
          break;
          
        default:
          normalizedRow.status = getValue(cleanedRow, [
            'Status', 'status', 'STATUS',
            'Situacao', 'situacao', 'SITUACAO'
          ], 'Aprovada');
          
          const tipoPagamentoGenerico = getValue(cleanedRow, [
            'Tipo de Pagamento', 'tipo pagamento', 'TIPO DE PAGAMENTO',
            'Forma de Pagamento', 'forma pagamento', 'FORMA DE PAGAMENTO',
            'Modalidade', 'modalidade', 'MODALIDADE'
          ], '').trim();
          
          if (normalizeText(tipoPagamentoGenerico).includes('debito')) {
            normalizedRow.payment_type = 'Cartão de Débito';
          } else if (normalizeText(tipoPagamentoGenerico).includes('credito')) {
            normalizedRow.payment_type = 'Cartão de Crédito';
          } else if (normalizeText(tipoPagamentoGenerico).includes('pix')) {
            normalizedRow.payment_type = 'Pix';
          } else {
            normalizedRow.payment_type = tipoPagamentoGenerico;
          }
          
          const valorGenerico = getValue(cleanedRow, [
            'Valor', 'valor', 'VALOR',
            'Valor Bruto', 'valor bruto', 'VALOR BRUTO',
            'Valor Venda', 'valor venda', 'VALOR VENDA'
          ], 0);
          
          normalizedRow.gross_amount = toNumber(valorGenerico);
          
          const dataGenerico = getValue(cleanedRow, [
            'Data', 'data', 'DATA',
            'Data Transacao', 'data transacao', 'DATA TRANSACAO',
            'Data Venda', 'data venda', 'DATA VENDA'
          ], '');
          
          normalizedRow.transaction_date = formatDateStandard(dataGenerico);
          
          const parcelasGenerico = getValue(cleanedRow, [
            'Parcelas', 'parcelas', 'PARCELAS',
            'Parcela', 'parcela', 'PARCELA'
          ], '1');
          
          normalizedRow.installments = parseInt(parcelasGenerico as string) || 1;
          
          normalizedRow.terminal = getValue(cleanedRow, [
            'Terminal', 'terminal', 'TERMINAL',
            'Maquininha', 'maquininha', 'MAQUININHA'
          ], '');
          
          normalizedRow.brand = getValue(cleanedRow, [
            'Bandeira', 'bandeira', 'BANDEIRA'
          ], '');
          
          if (normalizedRow.payment_type === 'Pix') {
            normalizedRow.brand = 'Pix';
            normalizedRow.installments = 1;
          }
      }
      
      // Validate if gross amount is a number
      if (isNaN(normalizedRow.gross_amount)) {
        warnings.push({
          rowIndex: index,
          message: `Invalid gross amount detected: ${normalizedRow.gross_amount}`
        });
        normalizedRow.gross_amount = 0;
      }
      
      // Format the value
      normalizedRow.formatted_amount = formatCurrency(normalizedRow.gross_amount);
      
    } catch (error) {
      warnings.push({
        rowIndex: index,
        message: `Error processing row: ${error instanceof Error ? error.message : String(error)}`
      });
    }
    
    normalizedData.push(normalizedRow);
  });
  
  return {
    data: normalizedData,
    warnings
  };
}

/**
 * Get metadata from sales data for filters
 */
export function getSalesMetadata(data: NormalizedSale[]): {
  paymentTypes: string[];
  statuses: string[];
  terminals: string[];
  brands: string[];
} {
  const paymentTypes = new Set<string>();
  const statuses = new Set<string>();
  const terminals = new Set<string>();
  const brands = new Set<string>();
  
  data.forEach(item => {
    if (item.payment_type) paymentTypes.add(item.payment_type);
    if (item.status) statuses.add(item.status);
    if (item.terminal) terminals.add(item.terminal);
    if (item.brand) brands.add(item.brand);
  });
  
  return {
    paymentTypes: Array.from(paymentTypes),
    statuses: Array.from(statuses),
    terminals: Array.from(terminals),
    brands: Array.from(brands)
  };
}

/**
 * Generate mock sales data for testing
 */
export function generateMockSalesData(count = 10): NormalizedSale[] {
  const sources = ['Rede Cartão', 'Rede Pix', 'PagSeguro', 'Sigma'];
  const paymentTypes = ['Cartão de Crédito', 'Cartão de Débito', 'Pix'];
  const statuses = ['Aprovada', 'Rejeitada', 'Pendente', 'Cancelada'];
  const brands = ['Visa', 'Mastercard', 'Elo', 'Amex', 'Pix'];
  const terminals = ['TERM001', 'TERM002', 'TERM003', 'TERM004', 'TERM005'];
  
  const result: NormalizedSale[] = [];
  
  for (let i = 0; i < count; i++) {
    const source = sources[Math.floor(Math.random() * sources.length)];
    const payment_type = paymentTypes[Math.floor(Math.random() * paymentTypes.length)];
    
    // Make sure Pix is always paid in full with Pix brand
    let brand = payment_type === 'Pix' 
      ? 'Pix' 
      : brands[Math.floor(Math.random() * (brands.length - 1))]; // Exclude Pix from cards
    
    const installments = payment_type === 'Pix' || payment_type === 'Cartão de Débito'
      ? 1
      : Math.floor(Math.random() * 12) + 1; // 1-12 installments for credit card
    
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 30)); // Random date in the last 30 days
    
    const gross_amount = Number((Math.random() * 1000 + 50).toFixed(2));
    
    result.push({
      id: `mock-${i}`,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      payment_type,
      gross_amount,
      transaction_date: formatDateStandard(date.toISOString().split('T')[0]),
      installments,
      terminal: terminals[Math.floor(Math.random() * terminals.length)],
      brand,
      source,
      formatted_amount: formatCurrency(gross_amount)
    });
  }
  
  return result;
}

// Utility function to clean quotes from headers and values when reading CSV
export function cleanCsvRow(row: Record<string, any>): Record<string, any> {
  const cleaned: Record<string, any> = {};
  Object.entries(row).forEach(([k, v]) => {
    const key = typeof k === 'string' ? k.replace(/"/g, '').replace(/'/g, '').trim() : k;
    let value = v;
    if (typeof value === 'string') value = value.replace(/"/g, '').replace(/'/g, '').trim();
    cleaned[key] = value;
  });
  return cleaned;
}
