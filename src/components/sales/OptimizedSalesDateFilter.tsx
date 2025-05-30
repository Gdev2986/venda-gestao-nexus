
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, RotateCcw } from "lucide-react";
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range";
import TimeRangePicker from "./filters/TimeRangePicker";
import { Badge } from "@/components/ui/badge";

interface OptimizedSalesDateFilterProps {
  filters: any;
  onFiltersChange: (filters: any) => void;
  onResetFilters: () => void;
  totalRecords: number;
  isLoading: boolean;
}

const OptimizedSalesDateFilter = ({
  filters,
  onFiltersChange,
  onResetFilters,
  totalRecords,
  isLoading
}: OptimizedSalesDateFilterProps) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleDateRangeChange = (dateRange: any) => {
    onFiltersChange({
      ...filters,
      startDate: dateRange?.from?.toISOString().split('T')[0],
      endDate: dateRange?.to?.toISOString().split('T')[0]
    });
  };

  const handleTimeRangeChange = (timeRange: [number, number]) => {
    onFiltersChange({
      ...filters,
      startHour: timeRange[0],
      endHour: timeRange[1]
    });
  };

  const activeFiltersCount = Object.keys(filters).filter(key => 
    filters[key] !== undefined && filters[key] !== null && filters[key] !== ''
  ).length;

  return (
    <Card className="shadow-md rounded-lg border bg-card border-l-4" style={{ borderLeftColor: '#115464' }}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Filtros de Data e Horário
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeFiltersCount} {activeFiltersCount === 1 ? 'filtro ativo' : 'filtros ativos'}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              {showAdvanced ? 'Ocultar' : 'Mostrar'} Avançado
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onResetFilters}
              disabled={activeFiltersCount === 0}
            >
              <RotateCcw className="h-4 w-4 mr-1" />
              Limpar
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Filtro de data */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Período</label>
              <DatePickerWithRange
                date={{
                  from: filters.startDate ? new Date(filters.startDate) : undefined,
                  to: filters.endDate ? new Date(filters.endDate) : undefined
                }}
                onDateChange={handleDateRangeChange}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Horário</label>
              <TimeRangePicker
                value={[filters.startHour || 0, filters.endHour || 23]}
                onChange={handleTimeRangeChange}
              />
            </div>
          </div>

          {/* Informações do resultado */}
          <div className="flex items-center justify-between pt-4 border-t border-muted">
            <div className="text-sm text-muted-foreground">
              {isLoading ? (
                "Carregando..."
              ) : (
                `${totalRecords.toLocaleString('pt-BR')} registros encontrados`
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OptimizedSalesDateFilter;
