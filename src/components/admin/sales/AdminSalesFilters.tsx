
import { CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { CalendarIcon, Search } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { SalesFilterParams } from "@/types";

interface DateRange {
  from: Date;
  to?: Date;
}

interface AdminSalesFiltersProps {
  filters: SalesFilterParams;
  dateRange?: DateRange;
  onFilterChange: (filters: SalesFilterParams) => void;
  onDateRangeChange: (range: DateRange | undefined) => void;
  onClearFilters: () => void;
}

const PAYMENT_METHODS = [
  { value: "credit", label: "Crédito" },
  { value: "debit", label: "Débito" },
  { value: "pix", label: "Pix" }
];

const AdminSalesFilters = ({
  filters,
  dateRange,
  onFilterChange,
  onDateRangeChange,
  onClearFilters
}: AdminSalesFiltersProps) => {
  const [searchValue, setSearchValue] = useState(filters.search || "");
  const [minAmount, setMinAmount] = useState(filters.minAmount || 0);
  const [maxAmount, setMaxAmount] = useState(filters.maxAmount || 5000);
  const [timeRange, setTimeRange] = useState<[number, number]>([
    filters.startHour || 0,
    filters.endHour || 23
  ]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange({ ...filters, search: searchValue });
  };

  const handleAmountFilterChange = (values: number[]) => {
    setMinAmount(values[0]);
    setMaxAmount(values[1]);
    onFilterChange({
      ...filters,
      minAmount: values[0],
      maxAmount: values[1]
    });
  };

  const handleTimeRangeChange = (values: number[]) => {
    setTimeRange([values[0], values[1]]);
    onFilterChange({
      ...filters,
      startHour: values[0],
      endHour: values[1]
    });
  };

  return (
    <CardContent className="space-y-6">
      {/* Search Filter */}
      <form onSubmit={handleSearchSubmit}>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar vendas..."
            className="pl-8"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
      </form>

      {/* Payment Method Filter */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Forma de Pagamento</label>
        <Select 
          value={filters.paymentMethod || ""} 
          onValueChange={(value) => onFilterChange({
            ...filters,
            paymentMethod: value || undefined
          })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todas</SelectItem>
            {PAYMENT_METHODS.map(method => (
              <SelectItem key={method.value} value={method.value}>
                {method.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Date Range Filter */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Período</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !dateRange && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateRange?.from ? (
                dateRange.to ? (
                  <>
                    {format(dateRange.from, "dd/MM/yyyy")} -{" "}
                    {format(dateRange.to, "dd/MM/yyyy")}
                  </>
                ) : (
                  format(dateRange.from, "dd/MM/yyyy")
                )
              ) : (
                <span>Selecione o período</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
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

      {/* Amount Range Filter */}
      <div className="space-y-4">
        <label className="text-sm font-medium">Faixa de Valor (R$)</label>
        <Slider
          defaultValue={[minAmount, maxAmount]}
          max={5000}
          step={100}
          onValueChange={handleAmountFilterChange}
          className="my-6"
        />
        <div className="flex items-center justify-between text-sm">
          <span>R$ {minAmount}</span>
          <span>R$ {maxAmount}</span>
        </div>
      </div>

      {/* Time Range Filter */}
      <div className="space-y-4">
        <label className="text-sm font-medium">Horário (h)</label>
        <Slider
          defaultValue={[timeRange[0], timeRange[1]]}
          min={0}
          max={23}
          step={1}
          onValueChange={handleTimeRangeChange}
          className="my-6"
        />
        <div className="flex items-center justify-between text-sm">
          <span>{timeRange[0]}:00</span>
          <span>{timeRange[1]}:00</span>
        </div>
      </div>

      {/* Clear Filters Button */}
      <Button 
        variant="outline" 
        className="w-full" 
        onClick={onClearFilters}
      >
        Limpar Filtros
      </Button>
    </CardContent>
  );
};

export default AdminSalesFilters;
