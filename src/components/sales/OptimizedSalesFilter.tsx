
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, Filter, X, Clock } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { SalesFilters } from "@/services/optimized-sales.service";
import TerminalFilter from "./TerminalFilter";
import TimeRangeFilter from "./TimeRangeFilter";

interface OptimizedSalesFilterProps {
  filters: SalesFilters;
  availableDates: string[];
  onFiltersChange: (filters: Partial<SalesFilters>) => void;
  onResetFilters: () => void;
}

interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

const OptimizedSalesFilter = ({ 
  filters, 
  availableDates, 
  onFiltersChange, 
  onResetFilters 
}: OptimizedSalesFilterProps) => {
  const [dateRange, setDateRange] = useState<DateRange>({ from: undefined, to: undefined });
  const [selectedTerminals, setSelectedTerminals] = useState<string[]>([]);

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

  // Atualizar filtro de terminais
  useEffect(() => {
    if (selectedTerminals.length > 0) {
      onFiltersChange({ terminals: selectedTerminals });
    } else {
      onFiltersChange({ terminals: undefined });
    }
  }, [selectedTerminals, onFiltersChange]);

  // Função para verificar se uma data tem vendas
  const isDateWithSales = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return availableDates.includes(dateStr);
  };

  // Obter range de datas disponíveis
  const minDate = availableDates.length > 0 ? new Date(availableDates[0]) : undefined;
  const maxDate = availableDates.length > 0 ? new Date(availableDates[availableDates.length - 1]) : undefined;

  const hasActiveFilters = 
    filters.dateStart || 
    filters.paymentType || 
    filters.source || 
    filters.hourStart !== undefined || 
    filters.hourEnd !== undefined ||
    (filters.terminals && filters.terminals.length > 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Filtros Otimizados
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Primeira linha: Período | Horário | Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Filtro de Período */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Período</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
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

          {/* Filtro de Horário */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Horário
            </label>
            <TimeRangeFilter
              startHour={filters.hourStart}
              endHour={filters.hourEnd}
              onTimeRangeChange={(startHour, endHour) => {
                onFiltersChange({ 
                  hourStart: startHour, 
                  hourEnd: endHour 
                });
              }}
            />
          </div>

          {/* Filtro de Status */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Status</label>
            <Select 
              value={filters.status || "all"} 
              onValueChange={(value) => onFiltersChange({ status: value === "all" ? undefined : value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="Aprovada">Aprovada</SelectItem>
                <SelectItem value="Rejeitada">Rejeitada</SelectItem>
                <SelectItem value="Pendente">Pendente</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Segunda linha: Tipo de Pagamento | Bandeira | Origem */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Filtro de Tipo de Pagamento */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Tipo de Pagamento</label>
            <Select 
              value={filters.paymentType || "all"} 
              onValueChange={(value) => onFiltersChange({ paymentType: value === "all" ? undefined : value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="CREDIT">Cartão de Crédito</SelectItem>
                <SelectItem value="DEBIT">Cartão de Débito</SelectItem>
                <SelectItem value="PIX">Pix</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Filtro de Bandeira */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Bandeira</label>
            <Select 
              value={filters.brand || "all"} 
              onValueChange={(value) => onFiltersChange({ brand: value === "all" ? undefined : value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="Visa">Visa</SelectItem>
                <SelectItem value="Mastercard">Mastercard</SelectItem>
                <SelectItem value="Elo">Elo</SelectItem>
                <SelectItem value="Pix">Pix</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Filtro de Origem */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Origem</label>
            <Select 
              value={filters.source || "all"} 
              onValueChange={(value) => onFiltersChange({ source: value === "all" ? undefined : value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="PagSeguro">PagSeguro</SelectItem>
                <SelectItem value="PagBank">PagBank</SelectItem>
                <SelectItem value="Getnet">Getnet</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Terceira linha: Terminais e botão limpar */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-3">
            <TerminalFilter
              terminals={[]} // Será preenchido quando disponível
              selectedTerminals={selectedTerminals}
              onTerminalsChange={setSelectedTerminals}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium invisible">Ações</label>
            {hasActiveFilters && (
              <Button
                variant="outline"
                onClick={onResetFilters}
                className="w-full flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                Limpar Filtros
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OptimizedSalesFilter;
