
import { Button } from "@/components/ui/button";
import { RefreshCw, Upload, Download, Filter } from "lucide-react";

interface SalesActionButtonsProps {
  filteredSales: any[];
  isLoading: boolean;
  showImportPanel: boolean;
  setShowImportPanel: (show: boolean) => void;
  onRefresh: () => void;
}

export const SalesActionButtons = ({
  filteredSales,
  isLoading,
  showImportPanel,
  setShowImportPanel,
  onRefresh
}: SalesActionButtonsProps) => {
  const handleExport = () => {
    // TODO: Implementar exportação
    console.log("Exportar dados", filteredSales);
  };

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={onRefresh}
        disabled={isLoading}
        className="flex items-center gap-2"
      >
        <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        Atualizar
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={handleExport}
        disabled={isLoading}
        className="flex items-center gap-2"
      >
        <Download className="h-4 w-4" />
        Exportar CSV
      </Button>
      
      <Button
        variant="default"
        size="sm"
        onClick={() => setShowImportPanel(!showImportPanel)}
        className="flex items-center gap-2"
      >
        <Upload className="h-4 w-4" />
        Importar Vendas
      </Button>
    </div>
  );
};
