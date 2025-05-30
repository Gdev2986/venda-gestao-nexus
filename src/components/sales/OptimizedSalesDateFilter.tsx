
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, X } from "lucide-react";
import { SalesFilters } from "@/services/optimized-sales.service";

interface OptimizedSalesDateFilterProps {
  filters: SalesFilters;
  onFiltersChange: (filters: Partial<SalesFilters>) => void;
  onResetFilters: () => void;
  totalRecords?: number;
  isLoading?: boolean;
}

const OptimizedSalesDateFilter = ({ 
  filters, 
  onFiltersChange, 
  onResetFilters,
  totalRecords,
  isLoading
}: OptimizedSalesDateFilterProps) => {
  const [localStartDate, setLocalStartDate] = useState(filters.dateStart || '');
  const [localEndDate, setLocalEndDate] = useState(filters.dateEnd || '');

  const handleApplyDateFilter = () => {
    onFiltersChange({
      dateStart: localStartDate || undefined,
      dateEnd: localEndDate || undefined
    });
  };

  const hasDateFilters = filters.dateStart || filters.dateEnd;
  const hasAnyFilters = Object.keys(filters).some(key => filters[key as keyof SalesFilters]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Filtro de Período
          {totalRecords && (
            <span className="text-sm font-normal text-muted-foreground ml-auto">
              {totalRecords.toLocaleString('pt-BR')} registros
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="start-date">Data Inicial</Label>
            <Input
              id="start-date"
              type="date"
              value={localStartDate}
              onChange={(e) => setLocalStartDate(e.target.value)}
              disabled={isLoading}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="end-date">Data Final</Label>
            <Input
              id="end-date"
              type="date"
              value={localEndDate}
              onChange={(e) => setLocalEndDate(e.target.value)}
              disabled={isLoading}
            />
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={handleApplyDateFilter}
            disabled={isLoading}
            className="flex-1"
          >
            Aplicar Filtro
          </Button>
          
          {hasAnyFilters && (
            <Button
              variant="outline"
              onClick={onResetFilters}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Limpar
            </Button>
          )}
        </div>
        
        {hasDateFilters && (
          <div className="text-sm text-muted-foreground">
            Período ativo: {filters.dateStart ? new Date(filters.dateStart).toLocaleDateString('pt-BR') : 'Início'} 
            {' até '}
            {filters.dateEnd ? new Date(filters.dateEnd).toLocaleDateString('pt-BR') : 'Fim'}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OptimizedSalesDateFilter;
