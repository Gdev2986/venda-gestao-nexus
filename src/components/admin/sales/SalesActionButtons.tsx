
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { FileUp, Download, RefreshCw, Filter } from "lucide-react";
import { NormalizedSale } from "@/utils/sales-processor";

interface SalesActionButtonsProps {
  filteredSales: NormalizedSale[];
  isLoading: boolean;
  showImportPanel: boolean;
  setShowImportPanel: (show: boolean) => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  onRefresh: () => void;
}

export const SalesActionButtons = ({
  filteredSales,
  isLoading,
  showImportPanel,
  setShowImportPanel,
  showFilters,
  setShowFilters,
  onRefresh
}: SalesActionButtonsProps) => {
  const { toast } = useToast();

  const handleExport = () => {
    if (filteredSales.length === 0) {
      toast({
        title: "Nenhum dado para exportar",
        description: "Não há dados disponíveis para exportação",
        variant: "destructive"
      });
      return;
    }
    
    const header = ['Status', 'Tipo de Pagamento', 'Valor Bruto', 'Data de Transação', 'Parcelas', 'Terminal', 'Bandeira', 'Origem'];
    
    const rows = filteredSales.map(sale => [
      sale.status,
      sale.payment_type,
      sale.gross_amount.toFixed(2).replace('.', ','),
      typeof sale.transaction_date === 'string' ? sale.transaction_date : sale.transaction_date.toLocaleString('pt-BR'),
      sale.installments,
      sale.terminal,
      sale.brand,
      sale.source
    ]);
    
    const csvContent = [header, ...rows].map(row => row.join(';')).join('\n');
    const bom = '\uFEFF';
    
    const blob = new Blob([bom + csvContent], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Vendas_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Exportação concluída",
      description: `${filteredSales.length} registros exportados para CSV`
    });
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Button 
        variant="outline"
        onClick={handleExport}
        disabled={filteredSales.length === 0}
      >
        <Download className="mr-2 h-4 w-4" />
        Exportar CSV
      </Button>
      <Button
        variant="outline"
        onClick={onRefresh}
        disabled={isLoading}
      >
        <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        Atualizar
      </Button>
      <Button 
        variant="outline"
        onClick={() => setShowFilters(!showFilters)}
      >
        <Filter className="mr-2 h-4 w-4" />
        {showFilters ? "Ocultar Filtros" : "Mostrar Filtros"}
      </Button>
      <Button onClick={() => setShowImportPanel(!showImportPanel)}>
        <FileUp className="mr-2 h-4 w-4" />
        {showImportPanel ? "Ocultar Importação" : "Importar Vendas"}
      </Button>
    </div>
  );
};
