
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import DateRangePicker from "./DateRangePicker";
import TimeRangePicker from "./TimeRangePicker";
import { SalesFilterParams } from "@/types";

// Add installments to SalesFilterParams interface
interface ExtendedSalesFilterParams extends SalesFilterParams {
  installments?: number;
}

interface AdvancedFiltersProps {
  filterValues: ExtendedSalesFilterParams;
  onFilterChange: (filters: ExtendedSalesFilterParams) => void;
  onResetFilters: () => void;
}

export const AdvancedFilters = ({
  filterValues,
  onFilterChange,
  onResetFilters
}: AdvancedFiltersProps) => {
  const [localFilters, setLocalFilters] = useState<ExtendedSalesFilterParams>(filterValues);
  
  useEffect(() => {
    setLocalFilters(filterValues);
  }, [filterValues]);
  
  const handleInputChange = (field: keyof ExtendedSalesFilterParams, value: any) => {
    setLocalFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleApplyFilters = () => {
    onFilterChange(localFilters);
  };
  
  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Terminal</Label>
            <Input 
              placeholder="Número do terminal"
              value={localFilters.terminal || ''}
              onChange={(e) => handleInputChange('terminal', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Valor mínimo</Label>
            <Input 
              type="number"
              placeholder="R$ 0,00"
              value={localFilters.minAmount || ''}
              onChange={(e) => handleInputChange('minAmount', parseFloat(e.target.value))}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Valor máximo</Label>
            <Input 
              type="number"
              placeholder="R$ 0,00"
              value={localFilters.maxAmount || ''}
              onChange={(e) => handleInputChange('maxAmount', parseFloat(e.target.value))}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Parcelas</Label>
            <Input 
              type="number"
              placeholder="Número de parcelas"
              value={localFilters.installments || ''}
              onChange={(e) => handleInputChange('installments', parseInt(e.target.value))}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Período</Label>
            <DateRangePicker 
              dateRange={{
                from: localFilters.dateFrom ? new Date(localFilters.dateFrom) : undefined,
                to: localFilters.dateTo ? new Date(localFilters.dateTo) : undefined
              }}
              onDateRangeChange={(range) => {
                handleInputChange('dateFrom', range?.from?.toISOString());
                handleInputChange('dateTo', range?.to?.toISOString());
              }}
              onDatePreset={() => {}} // Empty function to meet interface requirements
            />
          </div>
          
          <div className="space-y-2">
            <Label>Horário</Label>
            <TimeRangePicker 
              value={[localFilters.startHour || 0, localFilters.endHour || 23]}
              onChange={(range) => {
                handleInputChange('startHour', range[0]);
                handleInputChange('endHour', range[1]);
              }}
              className="w-full"
            />
          </div>
          
          <div className="space-y-2 md:col-span-2 lg:col-span-3 flex space-x-2 justify-end pt-4">
            <Button variant="outline" onClick={onResetFilters}>
              Limpar filtros
            </Button>
            <Button onClick={handleApplyFilters}>
              Aplicar filtros
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdvancedFilters;
