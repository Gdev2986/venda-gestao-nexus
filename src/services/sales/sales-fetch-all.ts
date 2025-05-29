
import { supabase } from "@/integrations/supabase/client";

export interface SaleWithMachine {
  id: string;
  code: string;
  terminal: string;
  date: string;
  gross_amount: number;
  net_amount: number;
  payment_method: string;
  installments: number;
  source: string;
  machines: {
    serial_number: string;
    model: string;
  } | null;
}

export const fetchAllSales = async (): Promise<SaleWithMachine[]> => {
  const pageSize = 100;
  let allData: SaleWithMachine[] = [];
  let page = 0;
  let finished = false;

  console.log('Iniciando carregamento de todos os registros de vendas...');

  while (!finished) {
    const from = page * pageSize;
    const to = from + pageSize - 1;

    console.log(`Carregando página ${page + 1} (registros ${from + 1} a ${to + 1})...`);

    const { data, error } = await supabase
      .from('sales')
      .select(`
        *,
        machines (
          serial_number,
          model
        )
      `, { count: 'exact' })
      .limit(null) // 👈 ESSENCIAL para remover limite padrão
      .range(from, to)
      .order('date', { ascending: false });

    if (error) {
      console.error('Erro ao carregar vendas:', error);
      throw new Error(`Erro ao buscar vendas: ${error.message}`);
    }

    if (!data || data.length === 0) {
      finished = true;
      console.log('Carregamento concluído - não há mais registros.');
    } else {
      allData.push(...data);
      page++;
      console.log(`Página ${page} carregada: ${data.length} registros. Total acumulado: ${allData.length}`);
    }
  }

  console.log(`Carregamento finalizado: ${allData.length} registros totais carregados.`);
  return allData;
};

export const fetchAllSalesWithFilters = async (filters?: {
  dateStart?: string;
  dateEnd?: string;
  hourStart?: string;
  hourEnd?: string;
  terminals?: string[];
  paymentType?: string;
  source?: string;
}): Promise<SaleWithMachine[]> => {
  const pageSize = 100;
  let allData: SaleWithMachine[] = [];
  let page = 0;
  let finished = false;

  console.log('Iniciando carregamento de vendas com filtros:', filters);

  while (!finished) {
    const from = page * pageSize;
    const to = from + pageSize - 1;

    let query = supabase
      .from('sales')
      .select(`
        *,
        machines (
          serial_number,
          model
        )
      `)
      .limit(null) // 👈 ESSENCIAL para remover limite padrão
      .range(from, to)
      .order('date', { ascending: false });

    // Aplicar filtros se fornecidos
    if (filters?.dateStart && filters?.dateEnd) {
      // Combinar data com horário
      const startTime = filters.hourStart || '00:00';
      const endTime = filters.hourEnd || '23:59';
      const startDateTime = `${filters.dateStart}T${startTime}:00`;
      const endDateTime = `${filters.dateEnd}T${endTime}:59`;
      
      query = query
        .gte('date', startDateTime)
        .lte('date', endDateTime);
    } else if (filters?.dateStart) {
      const startTime = filters.hourStart || '00:00';
      const startDateTime = `${filters.dateStart}T${startTime}:00`;
      query = query.gte('date', startDateTime);
    } else if (filters?.dateEnd) {
      const endTime = filters.hourEnd || '23:59';
      const endDateTime = `${filters.dateEnd}T${endTime}:59`;
      query = query.lte('date', endDateTime);
    }
    
    if (filters?.terminals && filters.terminals.length > 0) {
      query = query.in('terminal', filters.terminals);
    }
    if (filters?.paymentType && ['CREDIT', 'DEBIT', 'PIX'].includes(filters.paymentType)) {
      query = query.eq('payment_method', filters.paymentType as 'CREDIT' | 'DEBIT' | 'PIX');
    }
    if (filters?.source) {
      query = query.eq('source', filters.source);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Erro ao carregar vendas com filtros:', error);
      throw new Error(`Erro ao buscar vendas: ${error.message}`);
    }

    if (!data || data.length === 0) {
      finished = true;
    } else {
      allData.push(...data);
      page++;
      console.log(`Página ${page} carregada: ${data.length} registros. Total acumulado: ${allData.length}`);
    }
  }

  console.log(`Carregamento com filtros finalizado: ${allData.length} registros totais.`);
  return allData;
};
