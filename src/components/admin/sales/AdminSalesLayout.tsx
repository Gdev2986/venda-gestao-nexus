
import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Download, RefreshCw } from "lucide-react";

interface AdminSalesLayoutProps {
  children: ReactNode;
  isRefreshing: boolean;
  onRefresh: () => void;
  onImport: () => void;
  onExport: () => void;
}

const AdminSalesLayout = ({ 
  children, 
  isRefreshing, 
  onRefresh, 
  onImport, 
  onExport 
}: AdminSalesLayoutProps) => {
  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 md:gap-4 mb-4 md:mb-8 w-full">
        <div className="w-full md:w-auto">
          <h1 className="text-xl md:text-2xl font-bold">Gestão de Vendas</h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Visualize, filtre e gerencie todas as vendas realizadas
          </p>
        </div>
        
        <div className="flex items-center gap-1 md:gap-2 w-full md:w-auto mt-2 md:mt-0">
          <Button 
            variant="outline" 
            size="sm"
            className="flex items-center gap-1 flex-1 md:flex-auto justify-center"
            onClick={onRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-3 w-3 md:h-4 md:w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="text-xs md:text-sm">{isRefreshing ? "Atualizando..." : "Atualizar"}</span>
          </Button>
          
          <Button 
            variant="outline"
            size="sm"
            className="flex items-center gap-1 flex-1 md:flex-auto justify-center"
            onClick={onImport}
          >
            <Upload className="h-3 w-3 md:h-4 md:w-4" />
            <span className="text-xs md:text-sm">Importar</span>
          </Button>
          
          <Button 
            variant="outline"
            size="sm"
            className="flex items-center gap-1 flex-1 md:flex-auto justify-center"
            onClick={onExport}
          >
            <Download className="h-3 w-3 md:h-4 md:w-4" />
            <span className="text-xs md:text-sm">Exportar</span>
          </Button>
        </div>
      </div>
      
      <div className="w-full overflow-x-auto">
        {children}
      </div>
    </>
  );
};

export default AdminSalesLayout;
