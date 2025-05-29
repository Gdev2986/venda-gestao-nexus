
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CalendarIcon, Clock } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { SalesFilters } from "@/services/optimized-sales.service";

interface PeriodAndTimeFilterProps {
  filters: SalesFilters;
  availableDates: string[];
  onFiltersChange: (filters: Partial<SalesFilters>) => void;
}

interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

const PeriodAndTimeFilter = ({ 
  filters, 
  availableDates, 
  onFiltersChange 
}: PeriodAndTimeFilterProps) => {
  const [dateRange, setDateRange] = useState<DateRange>({ from: undefined, to: undefined });

  // Sincronizar dateRange com filters
  useEffect(() => {
    if (filters.dateStart) {
      const fromDate = new Date(filters.dateStart);
      const toDate = filters.dateEnd ? new Date(filters.dateEnd) : fromDate;
      setDateRange({ from: fromDate, to: toDate });
    } else {
      setDateRange({ from: undefined, to: undefined });
    }
  }, [filters.dateStart, filters.dateEnd]);

  // Atualizar filtros quando dateRange muda
  useEffect(() => {
    if (dateRange.from) {
      const dateStart = format(dateRange.from, 'yyyy-MM-dd');
      const dateEnd = dateRange.to ? format(dateRange.to, 'yyyy-MM-dd') : dateStart;
      
      onFiltersChange({
        dateStart,
        dateEnd
      });
    } else {
      onFiltersChange({
        dateStart: undefined,
        dateEnd: undefined
      });
    }
  }, [dateRange, onFiltersChange]);

  // Função para verificar se uma data tem vendas
  const isDateWithSales = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return availableDates.includes(dateStr);
  };

  // Obter range de datas disponíveis
  const minDate = availableDates.length > 0 ? new Date(availableDates[0]) : undefined;
  const maxDate = availableDates.length > 0 ? new Date(availableDates[availableDates.length - 1]) : undefined;

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-end">
      {/* Filtro de Período */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Período</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-[280px] justify-start text-left font-normal",
                !dateRange.from && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateRange.from ? (
                dateRange.to && dateRange.to.getTime() !== dateRange.from.getTime() ? (
                  <>
                    {format(dateRange.from, "dd/MM/yyyy", { locale: ptBR })} -{" "}
                    {format(dateRange.to, "dd/MM/yyyy", { locale: ptBR })}
                  </>
                ) : (
                  format(dateRange.from, "dd/MM/yyyy", { locale: ptBR })
                )
              ) : (
                "Selecione o período"
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="range"
              selected={dateRange}
              onSelect={(range) => setDateRange(range ? { from: range.from, to: range.to } : { from: undefined, to: undefined })}
              numberOfMonths={2}
              locale={ptBR}
              fromDate={minDate}
              toDate={maxDate}
              disabled={(date) => {
                if (minDate && date < minDate) return true;
                if (maxDate && date > maxDate) return true;
                return !isDateWithSales(date);
              }}
              className="pointer-events-auto"
            />
            {minDate && maxDate && (
              <div className="p-3 border-t text-sm text-muted-foreground">
                Período disponível: {format(minDate, "dd/MM/yyyy", { locale: ptBR })} - {format(maxDate, "dd/MM/yyyy", { locale: ptBR })}
              </div>
            )}
          </PopoverContent>
        </Popover>
      </div>

      {/* Filtros de Horário */}
      <div className="flex gap-2">
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-1">
            <Clock className="h-4 w-4" />
            Hora Início
          </label>
          <Input
            type="time"
            value={filters.hourStart || ""}
            onChange={(e) => onFiltersChange({ hourStart: e.target.value || undefined })}
            className="w-32"
            placeholder="00:00"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Hora Fim</label>
          <Input
            type="time"
            value={filters.hourEnd || ""}
            onChange={(e) => onFiltersChange({ hourEnd: e.target.value || undefined })}
            className="w-32"
            placeholder="23:59"
          />
        </div>
      </div>
    </div>
  );
};

export default PeriodAndTimeFilter;
