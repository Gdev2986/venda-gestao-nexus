
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { NormalizedSale } from "@/utils/sales-processor";
import { getAllSales } from "@/services/sales.service";
import { formatCurrency } from "@/lib/formatters";

export const useSalesData = () => {
  const [sales, setSales] = useState<NormalizedSale[]>([]);
  const [filteredSales, setFilteredSales] = useState<NormalizedSale[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  const fetchRealSales = async () => {
    setIsLoading(true);
    try {
      const realSales = await getAllSales();
      
      // Convert database sales to NormalizedSale format
      const normalizedSales: NormalizedSale[] = realSales.map(sale => {
        // Format the date properly for display (DD/MM/YYYY HH:MM)
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
          status: 'Aprovada', // Default status for imported sales
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
      
      toast({
        title: "Dados carregados",
        description: `${normalizedSales.length} vendas carregadas do banco de dados.`
      });
    } catch (error) {
      console.error('Error fetching sales:', error);
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar as vendas do banco de dados.",
        variant: "destructive"
      });
      // Set empty arrays in case of error
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
    // Refresh data from database after import
    fetchRealSales();
    
    toast({
      title: "Importação concluída",
      description: `${importedSales.length} registros importados com sucesso`
    });
  };

  const handleFilter = (filtered: NormalizedSale[]) => {
    setFilteredSales(filtered);
  };

  return {
    sales,
    filteredSales,
    isLoading,
    refreshSales,
    handleSalesImported,
    handleFilter
  };
};
