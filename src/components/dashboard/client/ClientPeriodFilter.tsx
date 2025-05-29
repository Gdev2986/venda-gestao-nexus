
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format, subDays, startOfDay, endOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface ClientPeriodFilterProps {
  onPeriodChange: (startDate: Date, endDate: Date) => void;
}

export const ClientPeriodFilter = ({ onPeriodChange }: ClientPeriodFilterProps) => {
  const [selectedPeriod, setSelectedPeriod] = useState("yesterday");
  const [customStartDate, setCustomStartDate] = useState<Date>();
  const [customEndDate, setCustomEndDate] = useState<Date>();
  const [isCustomOpen, setIsCustomOpen] = useState(false);

  const periods = [
    { id: "yesterday", label: "Ontem", days: 1 },
    { id: "last7days", label: "Últimos 7 dias", days: 7 },
    { id: "last15days", label: "Últimos 15 dias", days: 15 },
    { id: "last30days", label: "Últimos 30 dias", days: 30 },
    { id: "custom", label: "Período customizado", days: 0 }
  ];

  const handlePeriodSelect = (periodId: string, days: number) => {
    setSelectedPeriod(periodId);
    
    if (periodId === "custom") {
      setIsCustomOpen(true);
      return;
    }

    const endDate = endOfDay(subDays(new Date(), 1)); // Sempre termina "ontem"
    const startDate = startOfDay(subDays(endDate, days - 1));
    
    onPeriodChange(startDate, endDate);
  };

  const handleCustomPeriodApply = () => {
    if (customStartDate && customEndDate) {
      const maxEndDate = endOfDay(subDays(new Date(), 1)); // Não pode ser hoje
      const endDate = customEndDate > maxEndDate ? maxEndDate : endOfDay(customEndDate);
      const startDate = startOfDay(customStartDate);
      
      onPeriodChange(startDate, endDate);
      setIsCustomOpen(false);
    }
  };

  // Inicializar com "ontem" por padrão
  useState(() => {
    const yesterday = endOfDay(subDays(new Date(), 1));
    const startDate = startOfDay(yesterday);
    onPeriodChange(startDate, yesterday);
  });

  return (
    <Card className="border-l-4 border-l-indigo-500">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <CalendarIcon className="h-5 w-5 text-indigo-600" />
          Filtro de Período
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {periods.map((period) => (
            <Button
              key={period.id}
              variant={selectedPeriod === period.id ? "default" : "outline"}
              size="sm"
              onClick={() => handlePeriodSelect(period.id, period.days)}
              className="text-xs"
            >
              {period.label}
            </Button>
          ))}
        </div>

        {selectedPeriod === "custom" && (
          <Popover open={isCustomOpen} onOpenChange={setIsCustomOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full mt-3">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {customStartDate && customEndDate
                  ? `${format(customStartDate, "dd/MM/yyyy")} - ${format(customEndDate, "dd/MM/yyyy")}`
                  : "Selecione o período"
                }
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <div className="p-4 space-y-4">
                <div>
                  <label className="text-sm font-medium">Data Inicial</label>
                  <Calendar
                    mode="single"
                    selected={customStartDate}
                    onSelect={setCustomStartDate}
                    disabled={(date) => date >= new Date()}
                    className="pointer-events-auto"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Data Final</label>
                  <Calendar
                    mode="single"
                    selected={customEndDate}
                    onSelect={setCustomEndDate}
                    disabled={(date) => date >= new Date() || (customStartDate && date < customStartDate)}
                    className="pointer-events-auto"
                  />
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleCustomPeriodApply} className="flex-1">
                    Aplicar
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setIsCustomOpen(false)} className="flex-1">
                    Cancelar
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        )}
      </CardContent>
    </Card>
  );
};
