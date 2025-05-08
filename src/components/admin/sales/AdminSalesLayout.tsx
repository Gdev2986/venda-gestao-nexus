
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold">Gestão de Vendas</h1>
          <p className="text-muted-foreground">
            Visualize, filtre e gerencie todas as vendas realizadas
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            className="flex items-center gap-1"
            onClick={onRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? "Atualizando..." : "Atualizar"}
          </Button>
          
          <Button 
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
            onClick={onImport}
          >
            <Upload className="h-4 w-4" />
            Importar
          </Button>
          
          <Button 
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
            onClick={onExport}
          >
            <Download className="h-4 w-4" />
            Exportar
          </Button>
        </div>
      </div>
      
      {children}
    </>
  );
};

export default AdminSalesLayout;
