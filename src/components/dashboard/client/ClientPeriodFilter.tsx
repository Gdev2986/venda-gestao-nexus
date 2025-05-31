
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, RotateCcw } from "lucide-react";
import { DatePicker } from "@/components/ui/date-picker";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ClientPeriodFilterProps {
  onPeriodChange: (startDate: Date, endDate: Date) => void;
}

export const ClientPeriodFilter = ({ onPeriodChange }: ClientPeriodFilterProps) => {
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  const handleApplyFilter = () => {
    if (startDate && endDate) {
      onPeriodChange(startDate, endDate);
    }
  };

  const handleResetFilter = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    // Aplicar filtro para ontem por padrão
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    onPeriodChange(yesterday, yesterday);
  };

  // Aplicar filtro de ontem como padrão ao carregar
  useState(() => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    setStartDate(yesterday);
    setEndDate(yesterday);
    onPeriodChange(yesterday, yesterday);
  });

  return (
    <Card className="border-l-4 border-l-blue-500">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-blue-600" />
          Filtro de Período
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="start-date">Data Inicial</Label>
            <DatePicker
              selected={startDate}
              onSelect={setStartDate}
              placeholder="Selecionar data inicial"
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="end-date">Data Final</Label>
            <DatePicker
              selected={endDate}
              onSelect={setEndDate}
              placeholder="Selecionar data final"
              className="w-full"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Button 
            onClick={handleApplyFilter}
            disabled={!startDate || !endDate}
            className="flex-1"
          >
            Aplicar Filtro
          </Button>
          
          <Button
            variant="outline"
            onClick={handleResetFilter}
            className="flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Ontem
          </Button>
        </div>
        
        {/* Resumo do filtro aplicado */}
        {startDate && endDate && (
          <div className="text-sm text-muted-foreground border-t pt-3">
            <strong>Período selecionado:</strong><br />
            {format(startDate, 'dd/MM/yyyy', { locale: ptBR })} até {format(endDate, 'dd/MM/yyyy', { locale: ptBR })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
