
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import BasicFilters from "./filters/BasicFilters";
import { SalesFilterParams } from "@/types";

export interface SalesFiltersProps {
  date?: { from: Date; to?: Date } | undefined;
  filters: SalesFilterParams;
  onDateChange: (date: { from: Date; to?: Date } | undefined) => void;
  onFilterChange: (key: keyof SalesFilterParams, value: any) => void;
  onClearFilters: () => void;
  onExport?: () => void;
  onShowImportDialog?: () => void; // Make this optional to support both components
  onFilter?: (filters: any) => void; // Add this prop to support the Sales.tsx component
}

const SalesFilters = ({
  date,
  filters,
  onDateChange,
  onFilterChange,
  onClearFilters,
  onExport,
  onShowImportDialog,
  onFilter
}: SalesFiltersProps) => {
  // Format date range for display
  const formatDateRange = () => {
    if (!date?.from) return "Selecionar período";
    
    if (date.to) {
      return `${format(date.from, 'PP', { locale: ptBR })} - ${format(date.to, 'PP', { locale: ptBR })}`;
    }
    
    return format(date.from, 'PP', { locale: ptBR });
  };
  
  // Add a handler for the Apply button
  const handleApply = () => {
    if (onFilter) {
      onFilter(filters);
    }
  };
  
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">{formatDateRange()}</span>
            <span className="sm:hidden">Período</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <CalendarComponent
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={onDateChange}
            numberOfMonths={1}
          />
        </PopoverContent>
      </Popover>
      
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">Filtros</Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] sm:w-[400px]" align="end">
          <div className="space-y-4">
            <h4 className="font-medium text-sm">Filtros de Vendas</h4>
            <BasicFilters filters={filters} onFilterChange={onFilterChange} />
            
            <div className="flex items-center justify-between pt-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onClearFilters}
              >
                Limpar filtros
              </Button>
              <Button 
                size="sm"
                onClick={handleApply}
              >
                Aplicar
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
      
      {onExport && (
        <Button variant="outline" onClick={onExport}>
          Exportar
        </Button>
      )}
      
      {onShowImportDialog && (
        <Button variant="outline" onClick={onShowImportDialog}>
          Importar
        </Button>
      )}
    </div>
  );
};

export default SalesFilters;
