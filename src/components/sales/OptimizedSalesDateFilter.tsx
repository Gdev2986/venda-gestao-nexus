
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, X, Clock } from "lucide-react";
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

  const handleApplyDateFilter = () => {
    onFiltersChange({
      dateStart: localStartDate || undefined,
      dateEnd: localEndDate || undefined,
      hourStart: localHourStart || undefined,
      minuteStart: localMinuteStart || undefined,
      hourEnd: localHourEnd || undefined,
      minuteEnd: localMinuteEnd || undefined
    });
  };

  const hasDateFilters = filters.dateStart || filters.dateEnd;
  const hasTimeFilters = filters.hourStart || filters.minuteStart || filters.hourEnd || filters.minuteEnd;
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

        {/* Time filters */}
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
        
        {(hasDateFilters || hasTimeFilters) && (
          <div className="text-sm text-muted-foreground space-y-1">
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
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OptimizedSalesDateFilter;
