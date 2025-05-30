
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon, X } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface OptimizedSalesDateFilterProps {
  startDate: Date | undefined;
  endDate: Date | undefined;
  onStartDateChange: (date: Date | undefined) => void;
  onEndDateChange: (date: Date | undefined) => void;
  onClearDates: () => void;
  availableDates: Date[];
}

const OptimizedSalesDateFilter = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onClearDates,
  availableDates
}: OptimizedSalesDateFilterProps) => {
  const formatDateDisplay = (date: Date | undefined) => {
    if (!date) return "Selecionar data";
    return format(date, "dd/MM/yyyy", { locale: ptBR });
  };

  const isDateAvailable = (date: Date) => {
    return availableDates.some(availableDate => 
      date.toDateString() === availableDate.toDateString()
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center justify-between">
          Filtro de Período e Horário
          {(startDate || endDate) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearDates}
              className="h-8 px-2 text-muted-foreground hover:text-foreground"
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
                    !startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formatDateDisplay(startDate)}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={onStartDateChange}
                  disabled={(date) => !isDateAvailable(date)}
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
                    !endDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formatDateDisplay(endDate)}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={onEndDateChange}
                  disabled={(date) => {
                    const isUnavailable = !isDateAvailable(date);
                    const isBeforeStart = startDate ? date < startDate : false;
                    return isUnavailable || isBeforeStart;
                  }}
                  initialFocus
                  locale={ptBR}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {startDate && endDate && (
          <div className="mt-4 p-3 bg-muted/50 rounded-md">
            <p className="text-sm text-muted-foreground">
              Período selecionado: {formatDateDisplay(startDate)} até {formatDateDisplay(endDate)}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OptimizedSalesDateFilter;
