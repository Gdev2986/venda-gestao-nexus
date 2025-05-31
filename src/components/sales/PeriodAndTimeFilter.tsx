
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, X, Clock, Filter, ChevronDown, ChevronUp } from "lucide-react";
import { SalesFilters } from "@/services/optimized-sales.service";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import TerminalFilter from "./TerminalFilter";
import { DatePicker } from "@/components/ui/date-picker";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface PeriodAndTimeFilterProps {
  filters: SalesFilters;
  availableDates: string[];
  onFiltersChange: (filters: Partial<SalesFilters>) => void;
  totalRecords?: number;
  isLoading?: boolean;
}

const PeriodAndTimeFilter = ({ 
  filters, 
  availableDates,
  onFiltersChange, 
  totalRecords,
  isLoading
}: PeriodAndTimeFilterProps) => {
  // Função para obter a data de ontem
  const getYesterday = () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday;
  };

  // Inicializar com a data de ontem por padrão
  const [localStartDate, setLocalStartDate] = useState<Date | undefined>(
    filters.dateStart ? new Date(filters.dateStart) : getYesterday()
  );
  const [localEndDate, setLocalEndDate] = useState<Date | undefined>(
    filters.dateEnd ? new Date(filters.dateEnd) : getYesterday()
  );
  const [localHourStart, setLocalHourStart] = useState(filters.hourStart || '');
  const [localMinuteStart, setLocalMinuteStart] = useState(filters.minuteStart || '');
  const [localHourEnd, setLocalHourEnd] = useState(filters.hourEnd || '');
  const [localMinuteEnd, setLocalMinuteEnd] = useState(filters.minuteEnd || '');
  const [localTerminals, setLocalTerminals] = useState<string[]>(filters.terminals || []);
  const [localMinAmount, setLocalMinAmount] = useState(filters.minAmount?.toString() || '');
  const [localMaxAmount, setLocalMaxAmount] = useState(filters.maxAmount?.toString() || '');
  const [showAdditionalFilters, setShowAdditionalFilters] = useState(false);

  // Sincronizar as datas locais quando os filtros mudarem de fora
  useEffect(() => {
    if (filters.dateStart) {
      setLocalStartDate(new Date(filters.dateStart));
    } else {
      setLocalStartDate(getYesterday());
    }
    if (filters.dateEnd) {
      setLocalEndDate(new Date(filters.dateEnd));
    } else {
      setLocalEndDate(getYesterday());
    }
  }, [filters.dateStart, filters.dateEnd]);

  const handleApplyDateFilter = () => {
    onFiltersChange({
      dateStart: localStartDate ? format(localStartDate, 'yyyy-MM-dd') : undefined,
      dateEnd: localEndDate ? format(localEndDate, 'yyyy-MM-dd') : undefined,
      hourStart: localHourStart || undefined,
      minuteStart: localMinuteStart || undefined,
      hourEnd: localHourEnd || undefined,
      minuteEnd: localMinuteEnd || undefined,
      terminals: localTerminals.length > 0 ? localTerminals : undefined,
      minAmount: localMinAmount ? parseFloat(localMinAmount) : undefined,
      maxAmount: localMaxAmount ? parseFloat(localMaxAmount) : undefined
    });
  };

  const handleResetFilters = () => {
    const yesterday = getYesterday();
    setLocalStartDate(yesterday);
    setLocalEndDate(yesterday);
    setLocalHourStart('');
    setLocalMinuteStart('');
    setLocalHourEnd('');
    setLocalMinuteEnd('');
    setLocalTerminals([]);
    setLocalMinAmount('');
    setLocalMaxAmount('');
    
    onFiltersChange({
      dateStart: format(yesterday, 'yyyy-MM-dd'),
      dateEnd: format(yesterday, 'yyyy-MM-dd'),
      hourStart: undefined,
      minuteStart: undefined,
      hourEnd: undefined,
      minuteEnd: undefined,
      terminals: undefined,
      minAmount: undefined,
      maxAmount: undefined
    });
  };

  const hasDateFilters = filters.dateStart || filters.dateEnd;
  const hasTimeFilters = filters.hourStart || filters.minuteStart || filters.hourEnd || filters.minuteEnd;
  const hasOtherFilters = filters.terminals?.length || filters.minAmount || filters.maxAmount || filters.paymentType;
  const hasAnyFilters = Object.keys(filters).some(key => filters[key as keyof SalesFilters]);

  // Generate hour options (00-23)
  const hourOptions = Array.from({ length: 24 }, (_, i) => 
    i.toString().padStart(2, '0')
  );

  // Generate minute options (00-59)
  const minuteOptions = Array.from({ length: 60 }, (_, i) => 
    i.toString().padStart(2, '0')
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Filtro de Período e Horário
          {totalRecords && (
            <span className="text-sm font-normal text-muted-foreground ml-auto">
              {totalRecords.toLocaleString('pt-BR')} registros
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Filtros de Data */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="start-date">Data Inicial</Label>
            <DatePicker
              selected={localStartDate}
              onSelect={setLocalStartDate}
              placeholder="Selecionar data inicial"
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="end-date">Data Final</Label>
            <DatePicker
              selected={localEndDate}
              onSelect={setLocalEndDate}
              placeholder="Selecionar data final"
              className="w-full"
            />
          </div>
        </div>

        {/* Filtros de Horário */}
        <div className="border-t pt-4">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="h-4 w-4" />
            <Label className="text-sm font-medium">Filtro de Horário</Label>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm">Horário Inicial</Label>
              <div className="flex gap-2">
                <Select value={localHourStart} onValueChange={setLocalHourStart} disabled={isLoading}>
                  <SelectTrigger className="w-20">
                    <SelectValue placeholder="HH" />
                  </SelectTrigger>
                  <SelectContent>
                    {hourOptions.map(hour => (
                      <SelectItem key={hour} value={hour}>{hour}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <span className="self-center">:</span>
                <Select value={localMinuteStart} onValueChange={setLocalMinuteStart} disabled={isLoading}>
                  <SelectTrigger className="w-20">
                    <SelectValue placeholder="MM" />
                  </SelectTrigger>
                  <SelectContent>
                    {minuteOptions.map(minute => (
                      <SelectItem key={minute} value={minute}>{minute}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm">Horário Final</Label>
              <div className="flex gap-2">
                <Select value={localHourEnd} onValueChange={setLocalHourEnd} disabled={isLoading}>
                  <SelectTrigger className="w-20">
                    <SelectValue placeholder="HH" />
                  </SelectTrigger>
                  <SelectContent>
                    {hourOptions.map(hour => (
                      <SelectItem key={hour} value={hour}>{hour}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <span className="self-center">:</span>
                <Select value={localMinuteEnd} onValueChange={setLocalMinuteEnd} disabled={isLoading}>
                  <SelectTrigger className="w-20">
                    <SelectValue placeholder="MM" />
                  </SelectTrigger>
                  <SelectContent>
                    {minuteOptions.map(minute => (
                      <SelectItem key={minute} value={minute}>{minute}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Botão para mostrar filtros adicionais */}
        <div className="border-t pt-4">
          <Button
            variant="outline"
            onClick={() => setShowAdditionalFilters(!showAdditionalFilters)}
            className="flex items-center gap-2"
            disabled={isLoading}
          >
            <Filter className="h-4 w-4" />
            {showAdditionalFilters ? 'Ocultar Filtros' : 'Mostrar Filtros'}
            {showAdditionalFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>

        {/* Filtros Adicionais - mostrados apenas quando solicitado */}
        {showAdditionalFilters && (
          <div className="border-t pt-4">
            <div className="flex items-center gap-2 mb-3">
              <Filter className="h-4 w-4" />
              <Label className="text-sm font-medium">Filtros Adicionais</Label>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Filtro por Terminal */}
              <div className="space-y-2">
                <Label htmlFor="terminals">Terminais</Label>
                <TerminalFilter
                  terminals={localTerminals}
                  selectedTerminals={localTerminals}
                  onTerminalsChange={setLocalTerminals}
                />
              </div>

              {/* Tipo de Pagamento */}
              <div className="space-y-2">
                <Label>Tipo de Pagamento</Label>
                <Select 
                  value={filters.paymentType || "all"} 
                  onValueChange={(value) => onFiltersChange({ paymentType: value === "all" ? undefined : value })}
                  disabled={isLoading}
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

              {/* Valor Mínimo */}
              <div className="space-y-2">
                <Label htmlFor="min-amount">Valor Mínimo (R$)</Label>
                <Input
                  id="min-amount"
                  type="number"
                  step="0.01"
                  placeholder="0,00"
                  value={localMinAmount}
                  onChange={(e) => setLocalMinAmount(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              {/* Valor Máximo */}
              <div className="space-y-2">
                <Label htmlFor="max-amount">Valor Máximo (R$)</Label>
                <Input
                  id="max-amount"
                  type="number"
                  step="0.01"
                  placeholder="0,00"
                  value={localMaxAmount}
                  onChange={(e) => setLocalMaxAmount(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>
        )}
        
        <div className="flex gap-2">
          <Button 
            onClick={handleApplyDateFilter}
            disabled={isLoading}
            className="flex-1"
          >
            Aplicar Filtros
          </Button>
          
          {hasAnyFilters && (
            <Button
              variant="outline"
              onClick={handleResetFilters}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Limpar
            </Button>
          )}
        </div>
        
        {/* Resumo dos filtros aplicados */}
        {(hasDateFilters || hasTimeFilters || hasOtherFilters) && (
          <div className="text-sm text-muted-foreground space-y-1 border-t pt-3">
            {hasDateFilters && (
              <div>
                <strong>Período:</strong> {filters.dateStart ? format(new Date(filters.dateStart), 'dd/MM/yyyy', { locale: ptBR }) : 'Início'} 
                {' até '}
                {filters.dateEnd ? format(new Date(filters.dateEnd), 'dd/MM/yyyy', { locale: ptBR }) : 'Fim'}
              </div>
            )}
            {hasTimeFilters && (
              <div>
                <strong>Horário:</strong> {filters.hourStart || '00'}:{filters.minuteStart || '00'} 
                {' até '}
                {filters.hourEnd || '23'}:{filters.minuteEnd || '59'}
              </div>
            )}
            {filters.terminals && filters.terminals.length > 0 && (
              <div><strong>Terminais:</strong> {filters.terminals.join(', ')}</div>
            )}
            {filters.paymentType && (
              <div><strong>Pagamento:</strong> {filters.paymentType === 'CREDIT' ? 'Cartão de Crédito' : filters.paymentType === 'DEBIT' ? 'Cartão de Débito' : 'Pix'}</div>
            )}
            {(filters.minAmount || filters.maxAmount) && (
              <div>
                <strong>Valor:</strong> 
                {filters.minAmount && ` R$ ${filters.minAmount.toFixed(2)} ou mais`}
                {filters.minAmount && filters.maxAmount && ' e '}
                {filters.maxAmount && ` R$ ${filters.maxAmount.toFixed(2)} ou menos`}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PeriodAndTimeFilter;
