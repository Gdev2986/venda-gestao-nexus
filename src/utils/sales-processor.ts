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
 * Converts a value to number
 */
export function toNumber(v: string | number): number {
  if (typeof v === 'string') {
    return parseFloat(v.replace(/\./g, '').replace(',', '.')) || 0;
  }
  return Number(v) || 0;
}

/**
 * Gets a value from an object using multiple possible keys
 */
export function getValue(row: Record<string, any>, possibleKeys: string[], defaultValue: any = ''): any {
  // Remove aspas dos possíveis nomes de chave
  const clean = (s: string) => normalizeText(s).replace(/"/g, '').replace(/'/g, '').trim();
  // First try exact keys (removendo aspas)
  for (const key of possibleKeys) {
    if (row[key] !== undefined) return row[key];
    // Tenta também sem aspas
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

    let dateStr = dateInput;
    let timeStr = timeInput;

    // If timeInput is not provided but dateInput has a space
    if (!timeInput && dateInput.includes(' ')) {
      timeStr = dateInput.split(' ')[1]?.substring(0, 5) || '';
      dateStr = dateInput.split(' ')[0];
    }

    const dateParts = dateStr.split(/[-\/]/);
    let day, month, year;

    if (dateStr.includes('-')) {  // ISO
      [year, month, day] = dateParts;
    } else {  // Brazilian
      [day, month, year] = dateParts;
    }

    return `${day?.padStart(2,'0')}/${month?.padStart(2,'0')}/${year || '2000'} ${timeStr || '00:00'}`;
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

  // Sigma: robusto a variações como "ValorVenda", "valorvenda", etc
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
    // Check if row has data
    if (!row || Object.keys(row).length === 0) {
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
          // Status always "Aprovada" for Rede files
          normalizedRow.status = "Aprovada";
          
          // Standardize payment type: Debit Card or Credit Card
          const modalidadeRede = getValue(row, [
            'modalidade', 'MODALIDADE', 'Modalidade'
          ], '').trim();
          
          if (normalizeText(modalidadeRede).includes('debito')) {
            normalizedRow.payment_type = 'Cartão de Débito';
          } else if (normalizeText(modalidadeRede).includes('credito')) {
            normalizedRow.payment_type = 'Cartão de Crédito';
          } else {
            normalizedRow.payment_type = modalidadeRede;
          }
          
          // Get gross amount correctly - may be in different formats or columns
          const valorBrutoRede = getValue(row, [
            'valor da venda original', 'VALOR DA VENDA ORIGINAL', 
            'Valor da Venda Original', 'valor da venda', 'VALOR DA VENDA'
          ], 0);
          
          // Process value using toNumber function
          normalizedRow.gross_amount = toNumber(valorBrutoRede);
          
          // Get date and time data
          const dataVendaRede = getValue(row, [
            'data da venda', 'DATA DA VENDA', 'Data da Venda'
          ], '');
          
          const horaVendaRede = getValue(row, [
            'hora da venda', 'HORA DA VENDA', 'Hora da Venda'
          ], '');
          
          // Format date using formatDateStandard function
          normalizedRow.transaction_date = formatDateStandard(dataVendaRede, horaVendaRede);
          
          // Installments (default 1 if not present)
          const parcelasRede = getValue(row, [
            'número de parcelas', 'NÚMERO DE PARCELAS', 'Número de Parcelas',
            'numero de parcelas', 'NUMERO DE PARCELAS'
          ], '1');
          
          normalizedRow.installments = parseInt(parcelasRede as string) || 1;
          
          // Terminal - may come in different formats
          normalizedRow.terminal = getValue(row, [
            'Terminal', 'terminal', 'TERMINAL',
            'código da maquininha', 'CÓDIGO DA MAQUININHA',
            'codigo da maquininha', 'CODIGO DA MAQUININHA'
          ], '');
          
          // Brand
          normalizedRow.brand = getValue(row, [
            'bandeira', 'BANDEIRA', 'Bandeira'
          ], '');
          break;
          
        case 'Rede Pix':
          // Status always "Aprovada" for Rede files
          normalizedRow.status = "Aprovada";
          
          // Payment type for Pix
          normalizedRow.payment_type = 'Pix';
          
          // Gross amount correctly
          const valorPixBruto = getValue(row, [
            'valor da venda original', 'VALOR DA VENDA ORIGINAL', 
            'Valor da Venda Original', 'valor da venda', 'VALOR DA VENDA'
          ], 0);
          
          // Process value using toNumber function
          normalizedRow.gross_amount = toNumber(valorPixBruto);
          
          // Get date and time data
          const dataPixRede = getValue(row, [
            'data da venda', 'DATA DA VENDA', 'Data da Venda'
          ], '');
          
          const horaPixRede = getValue(row, [
            'hora da venda', 'HORA DA VENDA', 'Hora da Venda'
          ], '');
          
          // Format date using formatDateStandard function
          normalizedRow.transaction_date = formatDateStandard(dataPixRede, horaPixRede);
          
          // Pix is always paid in full (1 installment)
          normalizedRow.installments = 1;
          
          // Terminal - may come as maquininha or terminal code
          normalizedRow.terminal = getValue(row, [
            'código da maquininha', 'CÓDIGO DA MAQUININHA',
            'codigo da maquininha', 'CODIGO DA MAQUININHA',
            'Terminal', 'terminal', 'TERMINAL'
          ], '');
          
          // Brand always Pix
          normalizedRow.brand = 'Pix';
          break;
          
        case 'PagSeguro':
          normalizedRow.status = getValue(row, [
            'Status', 'STATUS', 'status'
          ], 'Aprovada');
          
          // Standardize payment type
          const formaPagamento = getValue(row, [
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
          
          // Gross amount - may be in different formats
          const valorPagSeguro = getValue(row, [
            'Valor Bruto', 'VALOR BRUTO', 'valor bruto',
            'Valor', 'VALOR', 'valor'
          ], 0);
          
          // Use toNumber for conversion
          normalizedRow.gross_amount = toNumber(valorPagSeguro);
          
          // Transaction date
          const dataPagSeguro = getValue(row, [
            'Data da Transação', 'DATA DA TRANSAÇÃO', 
            'data da transacao', 'Data', 'DATA'
          ], '');
          
          // Format date using formatDateStandard function
          normalizedRow.transaction_date = formatDateStandard(dataPagSeguro);
          
          // Installments
          const parcelasPagSeguro = getValue(row, [
            'Parcela', 'PARCELA', 'parcela',
            'Parcelas', 'PARCELAS', 'parcelas'
          ], '1');
          
          normalizedRow.installments = parseInt(parcelasPagSeguro as string) || 1;
          
          // Check different possible fields for terminal
          normalizedRow.terminal = getValue(row, [
            'Identificação da Maquininha', 'IDENTIFICAÇÃO DA MAQUININHA',
            'Identificacao da Maquininha', 'IDENTIFICACAO DA MAQUININHA',
            'Serial_Leitor', 'SERIAL_LEITOR', 'serial_leitor',
            'Terminal', 'TERMINAL', 'terminal'
          ], '');
          
          normalizedRow.brand = getValue(row, [
            'Bandeira', 'BANDEIRA', 'bandeira'
          ], '');
          
          // If Pix, adjust brand and installments
          if (normalizedRow.payment_type === 'Pix') {
            normalizedRow.brand = 'Pix';
            normalizedRow.installments = 1;
          }
          break;
          
        case 'Sigma':
          normalizedRow.status = getValue(row, [
            'Situacao', 'SITUACAO', 'situacao',
            'Status', 'STATUS', 'status',
            'Estado', 'ESTADO', 'estado'
          ], 'Aprovada');

          // Tipo de pagamento (mais variações)
          const modalidadeSigma = getValue(row, [
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

          // Valor bruto: priorize sempre o campo mais específico e todas as variações
          let valorSigma = getValue(row, ['Valor Venda', 'VALOR VENDA', 'valor venda', 'ValorVenda', 'VALORVENDA', 'valorvenda'], undefined);
          if (valorSigma === undefined) {
            valorSigma = getValue(row, ['Valor Total', 'VALOR TOTAL', 'valor total', 'ValorTotal', 'VALORTOTAL', 'valortotal'], undefined);
          }
          if (valorSigma === undefined) {
            valorSigma = getValue(row, ['Valor', 'VALOR', 'valor'], undefined);
          }
          if (valorSigma === undefined) {
            valorSigma = getValue(row, ['Total', 'TOTAL', 'total'], 0);
          }
          normalizedRow.gross_amount = toNumber(valorSigma);

          // Data da transação: priorize sempre o campo mais específico e todas as variações
          let dataSigma = getValue(row, ['Data Venda', 'DATA VENDA', 'data venda', 'DataVenda', 'DATAVENDA', 'datavenda'], undefined);
          if (dataSigma === undefined) {
            dataSigma = getValue(row, ['Data', 'DATA', 'data'], undefined);
          }
          if (dataSigma === undefined) {
            dataSigma = getValue(row, ['Data Transacao', 'DATA TRANSACAO', 'data transacao', 'Data Transação', 'DATA TRANSAÇÃO', 'data transação'], '');
          }
          normalizedRow.transaction_date = formatDateStandard(dataSigma);
          if (!dataSigma) normalizedRow.transaction_date = '01/01/2000 00:00';

          // Parcelas: priorize sempre o campo mais específico e todas as variações
          let parcelasSigma = getValue(row, ['Parcelas', 'parcelas', 'PARCELAS', 'QtdeParcelas', 'QtdParcelas'], '1');
          if (parcelasSigma === undefined) {
            parcelasSigma = getValue(row, ['Parcela', 'parcela', 'PARCELA'], '1');
          }
          normalizedRow.installments = parseInt(parcelasSigma as string) || 1;

          // Terminal: priorize sempre o campo mais específico e todas as variações
          let terminalSigma = getValue(row, ['Terminal', 'terminal', 'TERMINAL', 'Maquininha', 'maquininha', 'Equipamento', 'POS'], '');
          normalizedRow.terminal = terminalSigma;

          // Bandeira: priorize sempre o campo mais específico e todas as variações
          let brandSigma = getValue(row, ['Bandeira', 'bandeira', 'BANDEIRA', 'Cartao', 'CARTAO', 'cartao', 'Cartão', 'CARTÃO', 'cartão'], '');
          normalizedRow.brand = brandSigma;

          // Se for Pix, ajusta
          if (normalizedRow.payment_type === 'Pix') {
            normalizedRow.brand = 'Pix';
            normalizedRow.installments = 1;
          }
          break;
          
        default:
          // Try to map generic fields
          normalizedRow.status = getValue(row, [
            'Status', 'status', 'STATUS',
            'Situacao', 'situacao', 'SITUACAO'
          ], 'Aprovada');
          
          // Standardize generic payment type
          const tipoPagamentoGenerico = getValue(row, [
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
          
          // Generic gross amount
          const valorGenerico = getValue(row, [
            'Valor', 'valor', 'VALOR',
            'Valor Bruto', 'valor bruto', 'VALOR BRUTO',
            'Valor Venda', 'valor venda', 'VALOR VENDA'
          ], 0);
          
          // Use toNumber for conversion
          normalizedRow.gross_amount = toNumber(valorGenerico);
          
          // Generic date
          const dataGenerico = getValue(row, [
            'Data', 'data', 'DATA',
            'Data Transacao', 'data transacao', 'DATA TRANSACAO',
            'Data Venda', 'data venda', 'DATA VENDA'
          ], '');
          
          // Format date using formatDateStandard function
          normalizedRow.transaction_date = formatDateStandard(dataGenerico);
          
          // Generic installments
          const parcelasGenerico = getValue(row, [
            'Parcelas', 'parcelas', 'PARCELAS',
            'Parcela', 'parcela', 'PARCELA'
          ], '1');
          
          normalizedRow.installments = parseInt(parcelasGenerico as string) || 1;
          
          normalizedRow.terminal = getValue(row, [
            'Terminal', 'terminal', 'TERMINAL',
            'Maquininha', 'maquininha', 'MAQUININHA'
          ], '');
          
          normalizedRow.brand = getValue(row, [
            'Bandeira', 'bandeira', 'BANDEIRA'
          ], '');
          
          // If Pix, adjust brand and installments
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

// Função utilitária para limpar aspas dos headers e valores ao ler CSV
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
