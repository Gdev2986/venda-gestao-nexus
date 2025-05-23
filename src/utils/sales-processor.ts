
// Normalization and data processing utilities for sales imports

import { NormalizedSale } from "@/pages/admin/Sales";

// Types for file sources
export type FileSource = "PagSeguro" | "Rede Cartão" | "Rede Pix" | "Sigma" | "Desconhecido";

// Types for normalization results
export interface NormalizationResult {
  data: NormalizedSale[];
  warnings: Array<{
    row: number;
    message: string;
    original?: any;
  }>;
}

// Function to normalize text (remove accents, convert to lowercase)
export function normalizeText(text: string): string {
  if (!text) return "";
  
  return text.normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .toLowerCase()
    .trim();
}

// Function to convert string currency values to number
export function toNumber(value: string | number): number {
  if (typeof value === "number") return value;
  if (!value) return 0;
  
  // Remove non-numeric chars except decimal separators
  const normalized = String(value)
    .replace(/[^\d.,]/g, '')
    .replace(/,/g, '.');
  
  // Handle numbers with multiple dots (use last as decimal)
  const parts = normalized.split('.');
  if (parts.length > 2) {
    const decimal = parts.pop() || '0';
    const integer = parts.join('');
    return parseFloat(`${integer}.${decimal}`);
  }
  
  return parseFloat(normalized) || 0;
}

// Function to get a value from multiple possible column names
export function getValue(
  row: any, 
  keys: string[], 
  defaultValue: any = null
): any {
  for (const key of keys) {
    if (row[key] !== undefined && row[key] !== null && row[key] !== '') {
      return row[key];
    }
  }
  return defaultValue;
}

// Function to format date in standard format DD/MM/YYYY HH:MM
export function formatDateStandard(date: Date): string {
  if (!date) return "";
  
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  
  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

// Function to parse date from various formats
export function parseDate(dateStr: string, timeStr?: string): Date | null {
  if (!dateStr) return null;
  
  // Try to extract date components
  let day, month, year, hours = 0, minutes = 0;
  
  // Check different date formats
  const dateParts = dateStr.split(/[\/.-]/);
  
  if (dateParts.length === 3) {
    // Handle DD/MM/YYYY or YYYY-MM-DD
    if (dateParts[0].length === 4) {
      // YYYY-MM-DD format
      year = parseInt(dateParts[0], 10);
      month = parseInt(dateParts[1], 10) - 1;
      day = parseInt(dateParts[2], 10);
    } else {
      // DD/MM/YYYY format
      day = parseInt(dateParts[0], 10);
      month = parseInt(dateParts[1], 10) - 1;
      year = parseInt(dateParts[2], 10);
      
      // Handle two-digit year
      if (year < 100) {
        year += 2000;
      }
    }
    
    // Process time if provided
    if (timeStr) {
      const timeParts = timeStr.split(':');
      if (timeParts.length >= 2) {
        hours = parseInt(timeParts[0], 10);
        minutes = parseInt(timeParts[1], 10);
      }
    } else {
      // Check if date string has time portion
      const dateTimeParts = dateStr.split(' ');
      if (dateTimeParts.length > 1) {
        const timeStr = dateTimeParts[1];
        const timeParts = timeStr.split(':');
        if (timeParts.length >= 2) {
          hours = parseInt(timeParts[0], 10);
          minutes = parseInt(timeParts[1], 10);
        }
      }
    }
    
    // Create date object
    const date = new Date(year, month, day, hours, minutes);
    
    // Validate date
    if (isNaN(date.getTime())) {
      return null;
    }
    
    return date;
  }
  
  // Try standard JS date parsing as fallback
  const fallbackDate = new Date(dateStr);
  if (!isNaN(fallbackDate.getTime())) {
    return fallbackDate;
  }
  
  return null;
}

// Function to detect source by headers
export function detectSourceByHeaders(headers: string[]): FileSource {
  if (!headers || headers.length === 0) {
    return "Desconhecido";
  }
  
  // Normalize headers for case-insensitive comparison
  const normalizedHeaders = headers.map(normalizeText);
  
  // Check for PagSeguro
  if (
    normalizedHeaders.some(h => h.includes("forma de pagamento")) &&
    normalizedHeaders.some(h => h.includes("identificacao da maquininha") || h.includes("serial_leitor"))
  ) {
    return "PagSeguro";
  }
  
  // Check for Rede Cartão
  if (
    normalizedHeaders.some(h => h.includes("modalidade")) &&
    normalizedHeaders.some(h => h.includes("numero de parcelas") || h.includes("parcelas")) &&
    !normalizedHeaders.some(h => h.toLowerCase() === "pix")
  ) {
    return "Rede Cartão";
  }
  
  // Check for Rede Pix
  if (
    normalizedHeaders.some(h => h.includes("modalidade") && h.includes("pix")) ||
    (
      normalizedHeaders.some(h => h.includes("modalidade")) &&
      normalizedHeaders.some(h => h.includes("codigo da maquininha")) &&
      normalizedHeaders.some(h => h === "pix" || h.includes("tipo pix"))
    )
  ) {
    return "Rede Pix";
  }
  
  // Check for Sigma
  if (
    normalizedHeaders.some(h => h === "modalidade" || h === "tipo") &&
    normalizedHeaders.some(h => h.includes("valor venda") || h === "valor")
  ) {
    return "Sigma";
  }
  
  return "Desconhecido";
}

// Function to normalize data based on detected source
export function normalizeData(data: any[], source: FileSource): NormalizationResult {
  const normalizedData: NormalizedSale[] = [];
  const warnings: any[] = [];
  
  // Skip processing if source is unknown or data is empty
  if (source === "Desconhecido" || !data || data.length === 0) {
    return { data: [], warnings: [{ row: 0, message: "Formato desconhecido ou dados vazios" }] };
  }
  
  // Process each row
  data.forEach((row, index) => {
    try {
      let normalizedRow: NormalizedSale;
      
      switch (source) {
        case "PagSeguro":
          normalizedRow = normalizePagSeguroRow(row);
          break;
        case "Rede Cartão":
          normalizedRow = normalizeRedeCartaoRow(row);
          break;
        case "Rede Pix":
          normalizedRow = normalizeRedePixRow(row);
          break;
        case "Sigma":
          normalizedRow = normalizeSigmaRow(row);
          break;
        default:
          throw new Error("Fonte desconhecida");
      }
      
      // Validate required fields
      if (!normalizedRow.gross_amount) {
        warnings.push({
          row: index,
          message: "Valor bruto não encontrado ou inválido",
          original: row
        });
        return; // Skip this row
      }
      
      if (!normalizedRow.transaction_date) {
        warnings.push({
          row: index,
          message: "Data de transação não encontrada ou inválida",
          original: row
        });
        return; // Skip this row
      }
      
      normalizedData.push(normalizedRow);
      
    } catch (error) {
      warnings.push({
        row: index,
        message: `Erro ao processar linha: ${error}`,
        original: row
      });
    }
  });
  
  return { data: normalizedData, warnings };
}

// Function to normalize PagSeguro rows
function normalizePagSeguroRow(row: any): NormalizedSale {
  // Extract payment type
  const paymentForm = normalizeText(getValue(row, [
    "Forma de Pagamento", 
    "forma de pagamento", 
    "FormaPagamento"
  ], ""));
  
  let paymentType = "Outro";
  let brand = getValue(row, ["Bandeira", "bandeira"], "");
  let installments = parseInt(getValue(row, ["Parcela", "Parcelas", "parcelas"], 1), 10) || 1;
  
  if (paymentForm.includes("credito")) {
    paymentType = "Cartão de Crédito";
  } else if (paymentForm.includes("debito")) {
    paymentType = "Cartão de Débito";
  } else if (paymentForm.includes("pix")) {
    paymentType = "Pix";
    brand = "Pix";
    installments = 1;
  }
  
  // Extract date
  const dateStr = getValue(row, [
    "Data da Transação", 
    "Data Transacao", 
    "data da transacao"
  ], "");
  
  let transactionDate = parseDate(dateStr);
  if (!transactionDate) {
    // Default to current date if parsing fails
    transactionDate = new Date();
  }
  
  return {
    status: getValue(row, ["Status", "status"], "Aprovada"),
    payment_type: paymentType,
    gross_amount: toNumber(getValue(row, ["Valor Bruto", "Valor", "valor"], 0)),
    transaction_date: transactionDate,
    installments: installments,
    terminal: getValue(row, [
      "Identificação da Maquininha", 
      "Serial_Leitor", 
      "Terminal",
      "terminal"
    ], "Desconhecido"),
    brand: brand,
    source: "PagSeguro"
  };
}

// Function to normalize Rede Cartão rows
function normalizeRedeCartaoRow(row: any): NormalizedSale {
  // Extract payment type
  const modalidade = normalizeText(getValue(row, ["modalidade", "Modalidade"], ""));
  let paymentType = "Outro";
  
  if (modalidade.includes("credito")) {
    paymentType = "Cartão de Crédito";
  } else if (modalidade.includes("debito")) {
    paymentType = "Cartão de Débito";
  }
  
  // Extract date and time
  const dateStr = getValue(row, ["data da venda", "Data Venda", "data"], "");
  const timeStr = getValue(row, ["hora da venda", "Hora Venda", "hora"], "");
  
  let transactionDate = parseDate(dateStr, timeStr);
  if (!transactionDate) {
    // Default to current date if parsing fails
    transactionDate = new Date();
  }
  
  return {
    status: "Aprovada", // Always approved for Rede
    payment_type: paymentType,
    gross_amount: toNumber(getValue(row, [
      "valor da venda original", 
      "valor da venda",
      "Valor Venda",
      "valor"
    ], 0)),
    transaction_date: transactionDate,
    installments: parseInt(getValue(row, [
      "número de parcelas", 
      "numero de parcelas",
      "parcelas"
    ], 1), 10) || 1,
    terminal: getValue(row, [
      "código da maquininha", 
      "codigo da maquininha",
      "Terminal",
      "terminal"
    ], "Desconhecido"),
    brand: getValue(row, ["bandeira", "Bandeira"], "Desconhecido"),
    source: "Rede Cartão"
  };
}

// Function to normalize Rede Pix rows
function normalizeRedePixRow(row: any): NormalizedSale {
  // Extract date and time
  const dateStr = getValue(row, ["data da venda", "Data Venda", "data"], "");
  const timeStr = getValue(row, ["hora da venda", "Hora Venda", "hora"], "");
  
  let transactionDate = parseDate(dateStr, timeStr);
  if (!transactionDate) {
    // Default to current date if parsing fails
    transactionDate = new Date();
  }
  
  return {
    status: "Aprovada", // Always approved for Rede Pix
    payment_type: "Pix",
    gross_amount: toNumber(getValue(row, [
      "valor da venda original", 
      "valor da venda",
      "valor",
      "Valor"
    ], 0)),
    transaction_date: transactionDate,
    installments: 1, // Always 1 for Pix
    terminal: getValue(row, [
      "código da maquininha", 
      "codigo da maquininha",
      "Terminal",
      "terminal"
    ], "Desconhecido"),
    brand: "Pix", // Always Pix
    source: "Rede Pix"
  };
}

// Function to normalize Sigma rows
function normalizeSigmaRow(row: any): NormalizedSale {
  // Extract payment type
  const modalidade = normalizeText(getValue(row, ["Modalidade", "Tipo", "tipo"], ""));
  let paymentType = "Outro";
  let brand = getValue(row, ["Bandeira", "bandeira"], "Desconhecido");
  let installments = parseInt(getValue(row, ["Parcelas", "Parcela", "parcela"], 1), 10) || 1;
  
  if (modalidade.includes("credito")) {
    paymentType = "Cartão de Crédito";
  } else if (modalidade.includes("debito")) {
    paymentType = "Cartão de Débito";
  } else if (modalidade.includes("pix")) {
    paymentType = "Pix";
    brand = "Pix";
    installments = 1;
  }
  
  // Extract date
  const dateStr = getValue(row, ["Data Venda", "data venda", "data"], "");
  let transactionDate = parseDate(dateStr);
  if (!transactionDate) {
    // Default to current date if parsing fails
    transactionDate = new Date();
  }
  
  return {
    status: getValue(row, ["Situacao", "Status", "status"], "Aprovada"),
    payment_type: paymentType,
    gross_amount: toNumber(getValue(row, ["Valor Venda", "Valor", "valor"], 0)),
    transaction_date: transactionDate,
    installments: installments,
    terminal: getValue(row, ["Terminal", "Maquininha", "maquininha"], "Desconhecido"),
    brand: brand,
    source: "Sigma"
  };
}

// Get metadata from sales data for filters
export function getSalesMetadata(sales: NormalizedSale[]) {
  const paymentTypes = new Set<string>();
  const statuses = new Set<string>();
  const terminals = new Set<string>();
  const brands = new Set<string>();
  
  sales.forEach(sale => {
    if (sale.payment_type) paymentTypes.add(sale.payment_type);
    if (sale.status) statuses.add(sale.status);
    if (sale.terminal) terminals.add(sale.terminal);
    if (sale.brand) brands.add(sale.brand);
  });
  
  return {
    paymentTypes: Array.from(paymentTypes),
    statuses: Array.from(statuses),
    terminals: Array.from(terminals),
    brands: Array.from(brands)
  };
}
