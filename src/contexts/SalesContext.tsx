
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from "@/hooks/use-toast";
import { NormalizedSale } from "@/utils/sales-processor";
import { getAllSales } from "@/services/sales.service";
import { formatCurrency } from "@/lib/formatters";

interface SalesContextType {
  sales: NormalizedSale[];
  filteredSales: NormalizedSale[];
  isLoading: boolean;
  refreshSales: () => void;
  handleSalesImported: (importedSales: NormalizedSale[]) => void;
  handleFilter: (filtered: NormalizedSale[]) => void;
  // Dashboard specific data
  getMonthlyData: () => {
    grossSales: number;
    totalCommissions: number;
  };
  getFilteredData: () => {
    totalSales: number;
    grossSales: number;
    netSales: number;
    totalCommissions: number;
    salesGrowth: number;
    isGrowthPositive: boolean;
  };
  getChartsData: () => {
    dailySales: Array<{ name: string; gross: number; net: number }>;
    paymentMethodsDetail: Array<{
      method: string;
      count: number;
      amount: number;
      percentage: number;
      installments?: Array<{
        installments: string;
        count: number;
        amount: number;
        percentage: number;
      }>;
    }>;
  };
}

const SalesContext = createContext<SalesContextType | undefined>(undefined);

export const useSalesContext = () => {
  const context = useContext(SalesContext);
  if (context === undefined) {
    throw new Error('useSalesContext must be used within a SalesProvider');
  }
  return context;
};

interface SalesProviderProps {
  children: ReactNode;
}

export const SalesProvider = ({ children }: SalesProviderProps) => {
  const [sales, setSales] = useState<NormalizedSale[]>([]);
  const [filteredSales, setFilteredSales] = useState<NormalizedSale[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  const fetchRealSales = async () => {
    setIsLoading(true);
    try {
      const realSales = await getAllSales();
      
      const normalizedSales: NormalizedSale[] = realSales.map(sale => {
        const saleDate = new Date(sale.date);
        const formattedDate = saleDate.toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        }) + ' ' + saleDate.toLocaleTimeString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        });
        
        return {
          id: sale.id,
          status: 'Aprovada',
          payment_type: sale.payment_method === 'CREDIT' ? 'Cartão de Crédito' : 
                       sale.payment_method === 'DEBIT' ? 'Cartão de Débito' : 'Pix',
          gross_amount: Number(sale.gross_amount),
          transaction_date: formattedDate,
          installments: sale.installments || 1,
          terminal: sale.terminal,
          brand: sale.payment_method === 'PIX' ? 'Pix' : 
                 ['Visa', 'Mastercard', 'Elo'][Math.floor(Math.random() * 3)],
          source: sale.source || 'PagSeguro',
          formatted_amount: formatCurrency(Number(sale.gross_amount))
        };
      });
      
      setSales(normalizedSales);
      setFilteredSales(normalizedSales);
      
      console.log(`Sales loaded: ${normalizedSales.length} records`);
    } catch (error) {
      console.error('Error fetching sales:', error);
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar as vendas do banco de dados.",
        variant: "destructive"
      });
      setSales([]);
      setFilteredSales([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRealSales();
  }, []);

  const refreshSales = () => {
    fetchRealSales();
    toast({
      title: "Dados atualizados",
      description: "Os dados foram atualizados com sucesso"
    });
  };

  const handleSalesImported = (importedSales: NormalizedSale[]) => {
    fetchRealSales();
    toast({
      title: "Importação concluída",
      description: `${importedSales.length} registros importados com sucesso`
    });
  };

  const handleFilter = (filtered: NormalizedSale[]) => {
    setFilteredSales(filtered);
  };

  // Get current month data for main cards (Faturamento and Comissão)
  const getMonthlyData = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    const monthlyData = sales.filter(sale => {
      const saleDate = new Date(sale.transaction_date.split(' ')[0].split('/').reverse().join('-'));
      return saleDate.getMonth() === currentMonth && saleDate.getFullYear() === currentYear;
    });
    
    const grossSales = monthlyData.reduce((sum, sale) => sum + sale.gross_amount, 0);
    const totalCommissions = grossSales * 0.015; // 1.5% do bruto
    
    return { grossSales, totalCommissions };
  };

  // Get filtered data for other cards
  const getFilteredData = () => {
    const totalSales = filteredSales.length;
    const grossSales = filteredSales.reduce((sum, sale) => sum + sale.gross_amount, 0);
    const netSales = grossSales * 0.97; // 97% do valor bruto
    const totalCommissions = grossSales * 0.015; // 1.5% do bruto
    
    // For now, set growth to 0 since we're focusing on current data
    const salesGrowth = 0;
    const isGrowthPositive = false;
    
    return {
      totalSales,
      grossSales,
      netSales,
      totalCommissions,
      salesGrowth,
      isGrowthPositive
    };
  };

  // Get charts data based on filtered sales
  const getChartsData = () => {
    // Daily sales data
    const dailySalesMap = new Map();
    filteredSales.forEach(sale => {
      const date = sale.transaction_date.split(' ')[0]; // Get just the date part
      if (!dailySalesMap.has(date)) {
        dailySalesMap.set(date, { gross: 0, net: 0 });
      }
      const current = dailySalesMap.get(date);
      current.gross += sale.gross_amount;
      current.net += sale.gross_amount * 0.97; // 97% for net
    });

    const dailySales = Array.from(dailySalesMap.entries())
      .map(([date, data]) => ({
        name: date,
        gross: data.gross,
        net: data.net
      }))
      .sort((a, b) => a.name.localeCompare(b.name))
      .slice(-7); // Last 7 days

    // Payment methods breakdown
    const paymentMethodsMap = new Map();
    filteredSales.forEach(sale => {
      const method = sale.payment_type;
      if (!paymentMethodsMap.has(method)) {
        paymentMethodsMap.set(method, { count: 0, amount: 0, installments: new Map() });
      }
      const current = paymentMethodsMap.get(method);
      current.count += 1;
      current.amount += sale.gross_amount;

      // Track installments for credit cards
      if (method === 'Cartão de Crédito') {
        const installments = sale.installments || 1;
        if (!current.installments.has(installments)) {
          current.installments.set(installments, { count: 0, amount: 0 });
        }
        const installmentData = current.installments.get(installments);
        installmentData.count += 1;
        installmentData.amount += sale.gross_amount;
      }
    });

    const totalAmount = filteredSales.reduce((sum, sale) => sum + sale.gross_amount, 0);

    const paymentMethodsDetail = Array.from(paymentMethodsMap.entries()).map(([method, data]) => {
      const percentage = totalAmount > 0 ? (data.amount / totalAmount) * 100 : 0;
      
      let installments = undefined;
      if (method === 'Cartão de Crédito' && data.installments.size > 0) {
        const creditTotal = data.amount;
        installments = Array.from(data.installments.entries()).map(([inst, instData]) => ({
          installments: inst.toString(),
          count: instData.count,
          amount: instData.amount,
          percentage: creditTotal > 0 ? (instData.amount / creditTotal) * 100 : 0
        })).sort((a, b) => Number(a.installments) - Number(b.installments));
      }

      return {
        method,
        count: data.count,
        amount: data.amount,
        percentage: Math.round(percentage * 10) / 10,
        installments
      };
    });

    return {
      dailySales,
      paymentMethodsDetail
    };
  };

  const value: SalesContextType = {
    sales,
    filteredSales,
    isLoading,
    refreshSales,
    handleSalesImported,
    handleFilter,
    getMonthlyData,
    getFilteredData,
    getChartsData
  };

  return (
    <SalesContext.Provider value={value}>
      {children}
    </SalesContext.Provider>
  );
};
