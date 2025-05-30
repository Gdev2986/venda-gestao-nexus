
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon, X } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

export interface SalesFilters {
  startDate?: Date;
  endDate?: Date;
  terminal?: string;
  paymentMethod?: string;
  search?: string;
  minAmount?: number;
  maxAmount?: number;
  startHour?: number;
  endHour?: number;
}

interface OptimizedSalesDateFilterProps {
  filters: SalesFilters;
  onFiltersChange: (newFilters: Partial<SalesFilters>) => void;
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
  const formatDateDisplay = (date: Date | undefined) => {
    if (!date) return "Selecionar data";
    return format(date, "dd/MM/yyyy", { locale: ptBR });
  };

  const handleStartDateChange = (date: Date | undefined) => {
    onFiltersChange({ startDate: date });
  };

  const handleEndDateChange = (date: Date | undefined) => {
    onFiltersChange({ endDate: date });
  };

  const handleClearDates = () => {
    onResetFilters();
  };

  const hasFilters = filters.startDate || filters.endDate;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center justify-between">
          Filtro de Período e Horário
          {hasFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearDates}
              className="h-8 px-2 text-muted-foreground hover:text-foreground"
              disabled={isLoading}
            >
              <X className="h-4 w-4" />
              Limpar
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Data Inicial</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !filters.startDate && "text-muted-foreground"
                  )}
                  disabled={isLoading}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formatDateDisplay(filters.startDate)}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={filters.startDate}
                  onSelect={handleStartDateChange}
                  initialFocus
                  locale={ptBR}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Data Final</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !filters.endDate && "text-muted-foreground"
                  )}
                  disabled={isLoading}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formatDateDisplay(filters.endDate)}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={filters.endDate}
                  onSelect={handleEndDateChange}
                  disabled={(date) => {
                    const isBeforeStart = filters.startDate ? date < filters.startDate : false;
                    return isBeforeStart;
                  }}
                  initialFocus
                  locale={ptBR}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {filters.startDate && filters.endDate && (
          <div className="mt-4 p-3 bg-muted/50 rounded-md">
            <p className="text-sm text-muted-foreground">
              Período selecionado: {formatDateDisplay(filters.startDate)} até {formatDateDisplay(filters.endDate)}
            </p>
            {totalRecords > 0 && (
              <p className="text-sm text-muted-foreground mt-1">
                Total de registros: {totalRecords.toLocaleString('pt-BR')}
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OptimizedSalesDateFilter;
