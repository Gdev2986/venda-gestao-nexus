
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { PaymentMethod } from "@/types";
import { CalendarIcon, FilterIcon } from "lucide-react";
import { format, addDays, subDays } from "date-fns";
import { ptBR } from "date-fns/locale";

interface SalesFiltersProps {
  onFilter: (filters: any) => void;
}

const SalesFilters = ({ onFilter }: SalesFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [method, setMethod] = useState<string | undefined>();
  const [terminal, setTerminal] = useState("");
  const [dateRange, setDateRange] = useState<{
    from: Date;
    to?: Date;
  }>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });
  const [amountRange, setAmountRange] = useState<[number, number]>([0, 5000]);

  const handleApplyFilters = () => {
    onFilter({
      method,
      terminal,
      dateRange,
      amountRange,
    });
    setIsOpen(false);
  };

  const handleResetFilters = () => {
    setMethod(undefined);
    setTerminal("");
    setDateRange({
      from: subDays(new Date(), 30),
      to: new Date(),
    });
    setAmountRange([0, 5000]);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <FilterIcon className="h-4 w-4" />
          <span className="hidden sm:inline">Filtros</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-4" align="end">
        <div className="space-y-4">
          <h4 className="font-medium mb-2">Filtros de Vendas</h4>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Método de Pagamento</label>
            <Select value={method} onValueChange={setMethod}>
              <SelectTrigger>
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos</SelectItem>
                <SelectItem value={PaymentMethod.CREDIT}>Crédito</SelectItem>
                <SelectItem value={PaymentMethod.DEBIT}>Débito</SelectItem>
                <SelectItem value={PaymentMethod.PIX}>Pix</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Terminal</label>
            <Input 
              placeholder="Número do terminal"
              value={terminal}
              onChange={(e) => setTerminal(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Período</label>
            <div className="flex gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange?.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "P", { locale: ptBR })} -{" "}
                          {format(dateRange.to, "P", { locale: ptBR })}
                        </>
                      ) : (
                        format(dateRange.from, "P", { locale: ptBR })
                      )
                    ) : (
                      <span>Selecione as datas</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="center">
                  <Calendar
                    mode="range"
                    defaultMonth={dateRange?.from}
                    selected={dateRange}
                    onSelect={(range) => setDateRange(range || { from: new Date() })}
                    numberOfMonths={1}
                    locale={ptBR}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-sm font-medium">Valor</label>
              <span className="text-sm text-muted-foreground">
                R$ {amountRange[0]} - R$ {amountRange[1]}
              </span>
            </div>
            <Slider
              defaultValue={amountRange}
              max={5000}
              step={100}
              onValueChange={(values) => setAmountRange(values as [number, number])}
            />
          </div>
          
          <div className="flex gap-2 pt-2">
            <Button variant="outline" className="flex-1" onClick={handleResetFilters}>
              Limpar
            </Button>
            <Button className="flex-1" onClick={handleApplyFilters}>
              Aplicar
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default SalesFilters;
