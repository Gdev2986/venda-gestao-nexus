
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, X, Clock, Filter, ChevronDown, ChevronUp } from "lucide-react";
import { SalesFilters } from "@/services/optimized-sales.service";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  const [localHourStart, setLocalHourStart] = useState(filters.hourStart || '');
  const [localMinuteStart, setLocalMinuteStart] = useState(filters.minuteStart || '');
  const [localHourEnd, setLocalHourEnd] = useState(filters.hourEnd || '');
  const [localMinuteEnd, setLocalMinuteEnd] = useState(filters.minuteEnd || '');
  const [localTerminal, setLocalTerminal] = useState(filters.terminal || '');
  const [localMinAmount, setLocalMinAmount] = useState(filters.minAmount?.toString() || '');
  const [localMaxAmount, setLocalMaxAmount] = useState(filters.maxAmount?.toString() || '');
  const [showAdditionalFilters, setShowAdditionalFilters] = useState(false);

  const handleApplyDateFilter = () => {
    onFiltersChange({
      dateStart: localStartDate || undefined,
      dateEnd: localEndDate || undefined,
      hourStart: localHourStart || undefined,
      minuteStart: localMinuteStart || undefined,
      hourEnd: localHourEnd || undefined,
      minuteEnd: localMinuteEnd || undefined,
      terminal: localTerminal || undefined,
      minAmount: localMinAmount ? parseFloat(localMinAmount) : undefined,
      maxAmount: localMaxAmount ? parseFloat(localMaxAmount) : undefined
    });
  };

  const hasDateFilters = filters.dateStart || filters.dateEnd;
  const hasTimeFilters = filters.hourStart || filters.minuteStart || filters.hourEnd || filters.minuteEnd;
  const hasOtherFilters = filters.terminal || filters.minAmount || filters.maxAmount || filters.paymentType;
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
                <Label htmlFor="terminal">Terminal</Label>
                <Input
                  id="terminal"
                  placeholder="Digite o terminal..."
                  value={localTerminal}
                  onChange={(e) => setLocalTerminal(e.target.value)}
                  disabled={isLoading}
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
              onClick={onResetFilters}
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
                <strong>Período:</strong> {filters.dateStart ? new Date(filters.dateStart).toLocaleDateString('pt-BR') : 'Início'} 
                {' até '}
                {filters.dateEnd ? new Date(filters.dateEnd).toLocaleDateString('pt-BR') : 'Fim'}
              </div>
            )}
            {hasTimeFilters && (
              <div>
                <strong>Horário:</strong> {filters.hourStart || '00'}:{filters.minuteStart || '00'} 
                {' até '}
                {filters.hourEnd || '23'}:{filters.minuteEnd || '59'}
              </div>
            )}
            {filters.terminal && (
              <div><strong>Terminal:</strong> {filters.terminal}</div>
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

export default OptimizedSalesDateFilter;
