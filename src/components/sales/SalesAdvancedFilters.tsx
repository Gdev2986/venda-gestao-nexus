
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { PaymentMethod, SalesFilterParams } from "@/types";
import { Calendar } from "@/components/ui/calendar";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { CalendarIcon, Search, X } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";

interface DateRange {
  from: Date;
  to?: Date;
}

interface SalesAdvancedFiltersProps {
  filters: SalesFilterParams;
  dateRange?: DateRange;
  onFilterChange: (filters: SalesFilterParams) => void;
  onDateRangeChange: (dateRange: DateRange | undefined) => void;
  onClearFilters: () => void;
}

const PAYMENT_METHODS = [
  { value: PaymentMethod.CREDIT, label: "Crédito" },
  { value: PaymentMethod.DEBIT, label: "Débito" },
  { value: PaymentMethod.PIX, label: "Pix" }
];

const TERMINALS = [
  "T100", "T101", "T102", "T103", "T104", "T105"
];

const HOUR_RANGES = [
  { value: [0, 23], label: "Qualquer horário" },
  { value: [9, 12], label: "Manhã (9h-12h)" },
  { value: [13, 17], label: "Tarde (13h-17h)" },
  { value: [18, 22], label: "Noite (18h-22h)" }
];

const INSTALLMENTS = [
  { value: "1", label: "À vista (1x)" },
  { value: "2-6", label: "2 a 6 vezes" },
  { value: "7-12", label: "7 a 12 vezes" }
];

const SalesAdvancedFilters = ({
  filters,
  dateRange,
  onFilterChange,
  onDateRangeChange,
  onClearFilters
}: SalesAdvancedFiltersProps) => {
  const [searchTerm, setSearchTerm] = useState(filters.search || "");
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [amountRange, setAmountRange] = useState([0, 2000]);
  
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange({ ...filters, search: searchTerm });
  };
  
  const handleAmountRangeChange = (values: number[]) => {
    setAmountRange(values);
    onFilterChange({
      ...filters,
      minAmount: values[0],
      maxAmount: values[1]
    });
  };
  
  const handleHourRangeChange = (rangeString: string) => {
    if (!rangeString) {
      onFilterChange({
        ...filters,
        startHour: undefined,
        endHour: undefined
      });
      return;
    }
    
    const selectedRange = HOUR_RANGES.find(hr => hr.value.join('-') === rangeString);
    if (selectedRange) {
      onFilterChange({
        ...filters,
        startHour: selectedRange.value[0],
        endHour: selectedRange.value[1]
      });
    }
  };
  
  const handleDatePreset = (preset: 'today' | 'week' | 'month') => {
    const today = new Date();
    let from = new Date();
    let to = new Date();
    
    switch (preset) {
      case 'today':
        // Already set to today
        break;
        
      case 'week':
        // Start of the week (Monday)
        const day = today.getDay();
        const diff = today.getDate() - day + (day === 0 ? -6 : 1);
        from = new Date(today.setDate(diff));
        to = new Date();
        break;
        
      case 'month':
        from = new Date(today.getFullYear(), today.getMonth(), 1);
        to = new Date();
        break;
    }
    
    onDateRangeChange({ from, to });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search Bar */}
        <form 
          className="flex-1" 
          onSubmit={handleSearchSubmit}
        >
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por código, terminal ou cliente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            {searchTerm && (
              <button
                type="button"
                className="absolute right-3 top-2.5"
                onClick={() => {
                  setSearchTerm("");
                  if (filters.search) {
                    onFilterChange({ ...filters, search: "" });
                  }
                }}
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            )}
          </div>
        </form>
        
        {/* Date Range Picker */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "justify-start text-left font-normal w-[240px]",
                !dateRange && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateRange?.from ? (
                dateRange.to ? (
                  <>
                    {format(dateRange.from, "dd/MM/yyyy", { locale: ptBR })} -{" "}
                    {format(dateRange.to, "dd/MM/yyyy", { locale: ptBR })}
                  </>
                ) : (
                  format(dateRange.from, "dd/MM/yyyy", { locale: ptBR })
                )
              ) : (
                <span>Selecionar período</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <div className="p-3 border-b">
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleDatePreset('today')}
                  className="text-xs"
                >
                  Hoje
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleDatePreset('week')}
                  className="text-xs"
                >
                  Esta semana
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleDatePreset('month')}
                  className="text-xs"
                >
                  Este mês
                </Button>
              </div>
            </div>
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={dateRange?.from}
              selected={dateRange}
              onSelect={onDateRangeChange}
              numberOfMonths={2}
              className="pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Payment Method Filter */}
        <div className="w-full sm:w-1/3">
          <Label htmlFor="paymentMethod" className="mb-1 block">Forma de Pagamento</Label>
          <Select
            value={filters.paymentMethod || ""}
            onValueChange={(value) => onFilterChange({ ...filters, paymentMethod: value || undefined })}
          >
            <SelectTrigger id="paymentMethod">
              <SelectValue placeholder="Qualquer método" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Qualquer método</SelectItem>
              {PAYMENT_METHODS.map((method) => (
                <SelectItem key={method.value} value={method.value}>
                  {method.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Terminal Filter */}
        <div className="w-full sm:w-1/3">
          <Label htmlFor="terminal" className="mb-1 block">Terminal</Label>
          <Select
            value={filters.terminal || ""}
            onValueChange={(value) => onFilterChange({ ...filters, terminal: value || undefined })}
          >
            <SelectTrigger id="terminal">
              <SelectValue placeholder="Qualquer terminal" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Qualquer terminal</SelectItem>
              {TERMINALS.map((terminal) => (
                <SelectItem key={terminal} value={terminal}>
                  {terminal}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Hours Filter */}
        <div className="w-full sm:w-1/3">
          <Label htmlFor="hourRange" className="mb-1 block">Horário</Label>
          <Select
            value={filters.startHour !== undefined ? `${filters.startHour}-${filters.endHour}` : ""}
            onValueChange={handleHourRangeChange}
          >
            <SelectTrigger id="hourRange">
              <SelectValue placeholder="Qualquer horário" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Qualquer horário</SelectItem>
              {HOUR_RANGES.map((range, index) => (
                <SelectItem key={index} value={range.value.join('-')}>
                  {range.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {showMoreFilters && (
        <div className="pt-4 border-t">
          <div className="flex flex-col sm:flex-row gap-8">
            {/* Amount Range Filter */}
            <div className="flex-1">
              <div className="flex justify-between mb-2">
                <Label>Valor</Label>
                <span className="text-sm text-muted-foreground">
                  R$ {amountRange[0]} - R$ {amountRange[1]}
                </span>
              </div>
              <Slider
                defaultValue={[0, 2000]} 
                max={2000} 
                step={50}
                value={amountRange}
                onValueChange={handleAmountRangeChange}
                className="mt-6"
              />
            </div>
            
            {/* Installments Filter */}
            <div className="w-full sm:w-1/3">
              <Label htmlFor="installments" className="mb-1 block">Parcelas</Label>
              <Select
                value={filters.installments || ""}
                onValueChange={(value) => onFilterChange({ ...filters, installments: value || undefined })}
              >
                <SelectTrigger id="installments">
                  <SelectValue placeholder="Qualquer parcela" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Qualquer parcela</SelectItem>
                  {INSTALLMENTS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex justify-between items-center pt-2">
        <Button
          variant="ghost"
          onClick={() => setShowMoreFilters(!showMoreFilters)}
          className="text-sm"
          type="button"
        >
          {showMoreFilters ? "Menos filtros" : "Mais filtros"}
        </Button>
        
        <Button
          variant="ghost"
          onClick={onClearFilters}
          className="text-sm text-muted-foreground"
          type="button"
        >
          Limpar filtros
        </Button>
      </div>
    </div>
  );
};

export default SalesAdvancedFilters;
