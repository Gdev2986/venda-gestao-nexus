
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, DownloadIcon, SearchIcon, UploadIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { PaymentMethod, SalesFilterParams } from "@/types";

interface DateRange {
  from: Date;
  to?: Date;
}

interface SalesFiltersProps {
  filters: SalesFilterParams;
  onFilterChange: (key: keyof SalesFilterParams, value: any) => void;
  date: DateRange | undefined;
  onDateChange: (date: DateRange | undefined) => void;
  onClearFilters: () => void;
  onExport: () => void;
  onShowImportDialog: () => void;
}

const SalesFilters = ({
  filters,
  onFilterChange,
  date,
  onDateChange,
  onClearFilters,
  onExport,
  onShowImportDialog,
}: SalesFiltersProps) => {
  const [selectedDates, setSelectedDates] = useState<DateRange | undefined>(date);

  // Handle date selection with two clicks
  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (!selectedDate) return;

    if (!selectedDates?.from || selectedDates.to) {
      // Reset range and set new 'from' date
      const newDates = {
        from: selectedDate,
        to: undefined,
      };
      setSelectedDates(newDates);
      
      // Don't trigger onDateChange yet, wait for the second click
    } else {
      // Second click - complete the range
      const from = selectedDate < selectedDates.from ? selectedDate : selectedDates.from;
      const to = selectedDate < selectedDates.from ? selectedDates.from : selectedDate;
      
      const newRange = { from, to };
      setSelectedDates(newRange);
      onDateChange(newRange);
    }
  };

  // Format date for display
  const formatDateString = () => {
    if (!selectedDates?.from) {
      return "Selecione uma data";
    }
    
    if (!selectedDates.to) {
      return `${format(selectedDates.from, "dd/MM/yyyy", { locale: ptBR })} - Selecione fim`;
    }
    
    return `${format(selectedDates.from, "dd/MM/yyyy", { locale: ptBR })} - ${format(selectedDates.to, "dd/MM/yyyy", { locale: ptBR })}`;
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Filtros</CardTitle>
        <CardDescription>
          Filtre as vendas por período, forma de pagamento, terminal e mais
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="date">Período</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !selectedDates && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formatDateString()}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 pointer-events-auto" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDates?.to || selectedDates?.from}
                  onSelect={handleDateSelect}
                  numberOfMonths={2}
                  className="p-3 pointer-events-auto"
                  modifiers={{
                    selected: selectedDates?.to 
                      ? [selectedDates.from, selectedDates.to] 
                      : selectedDates?.from ? [selectedDates.from] : [],
                    range: selectedDates?.to 
                      ? { from: selectedDates.from, to: selectedDates.to } 
                      : undefined,
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="paymentMethod">Forma de Pagamento</Label>
            <Select
              value={filters.paymentMethod}
              onValueChange={(value) =>
                onFilterChange("paymentMethod", value as PaymentMethod)
              }
            >
              <SelectTrigger id="paymentMethod">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value={PaymentMethod.CREDIT}>Crédito</SelectItem>
                <SelectItem value={PaymentMethod.DEBIT}>Débito</SelectItem>
                <SelectItem value={PaymentMethod.PIX}>Pix</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="terminal">Terminal</Label>
            <Select
              value={filters.terminal}
              onValueChange={(value) => onFilterChange("terminal", value)}
            >
              <SelectTrigger id="terminal">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="T123456">T123456</SelectItem>
                <SelectItem value="T789012">T789012</SelectItem>
                <SelectItem value="T345678">T345678</SelectItem>
                <SelectItem value="T901234">T901234</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="search">Código da Venda</Label>
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Buscar por código..."
                className="pl-9"
                value={filters.search || ""}
                onChange={(e) => onFilterChange("search", e.target.value)}
              />
            </div>
          </div>
        </div>
        
        <div className="flex justify-between mt-4">
          <Button variant="outline" onClick={onClearFilters}>
            Limpar Filtros
          </Button>
          <div className="space-x-2">
            <Button variant="outline" onClick={onShowImportDialog}>
              <UploadIcon className="h-4 w-4 mr-2" />
              Importar Vendas
            </Button>
            <Button onClick={onExport}>
              <DownloadIcon className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default SalesFilters;
