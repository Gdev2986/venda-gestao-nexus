import { CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Search } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { SalesFilterParams } from "@/types";
import { TimeRangePicker } from "../../../components/sales/filters";
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
const PAYMENT_METHODS = [{
  value: "credit",
  label: "Crédito"
}, {
  value: "debit",
  label: "Débito"
}, {
  value: "pix",
  label: "Pix"
}];
const AdminSalesFilters = ({
  filters,
  dateRange,
  onFilterChange,
  onDateRangeChange,
  onClearFilters
}: AdminSalesFiltersProps) => {
  const [searchValue, setSearchValue] = useState(filters.search || "");
  const [timeRange, setTimeRange] = useState<[number, number]>([filters.startHour || 0, filters.endHour || 23]);
  const [amountValue, setAmountValue] = useState(filters.minAmount ? filters.minAmount.toString().replace(".", ",") : "");
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange({
      ...filters,
      search: searchValue
    });
  };
  const handleTimeRangeChange = (values: [number, number]) => {
    setTimeRange(values);
    onFilterChange({
      ...filters,
      startHour: values[0],
      endHour: values[1]
    });
  };
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmountValue(e.target.value);
  };
  const handleAmountBlur = () => {
    if (amountValue) {
      // Convert comma to dot for numeric value
      const numValue = parseFloat(amountValue.replace(/\./g, "").replace(",", "."));
      if (!isNaN(numValue)) {
        onFilterChange({
          ...filters,
          minAmount: numValue,
          maxAmount: undefined
        });
      }
    } else {
      // Clear the filter if input is empty
      onFilterChange({
        ...filters,
        minAmount: undefined,
        maxAmount: undefined
      });
    }
  };
  return <CardContent className="p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left column with search and payment method */}
        <div className="space-y-3">
          {/* Search Filter with Clear Filters Button */}
          <div className="flex gap-2">
            <form onSubmit={handleSearchSubmit} className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Buscar vendas..." className="pl-8" value={searchValue} onChange={e => setSearchValue(e.target.value)} />
              </div>
            </form>
            <Button variant="outline" onClick={onClearFilters}>
              Limpar Filtros
            </Button>
          </div>

          {/* Payment Method Filter */}
          <div>
            <label className="text-sm font-medium mb-1 block">Forma de Pagamento</label>
            <Select value={filters.paymentMethod || "all"} onValueChange={value => onFilterChange({
            ...filters,
            paymentMethod: value === "all" ? undefined : value
          })}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                {PAYMENT_METHODS.map(method => <SelectItem key={method.value} value={method.value}>
                    {method.label}
                  </SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {/* Amount Filter (specific value input) */}
          <div>
            <label className="text-sm font-medium mb-1 block">Valor (R$)</label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-muted-foreground">R$</span>
              <Input value={amountValue} onChange={handleAmountChange} onBlur={handleAmountBlur} className="pl-10" />
            </div>
          </div>
        </div>

        {/* Right column with date and time */}
        <div className="space-y-3 py-[41px]">
          {/* Date Range Filter */}
          <div className="px-0 py-0 my-[9px]">
            <label className="text-sm font-medium mb-1 block">Período</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !dateRange && "text-muted-foreground")}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange?.from ? dateRange.to ? <>
                        {format(dateRange.from, "dd/MM/yyyy")} -{" "}
                        {format(dateRange.to, "dd/MM/yyyy")}
                      </> : format(dateRange.from, "dd/MM/yyyy") : <span>Selecione o período</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar initialFocus mode="range" defaultMonth={dateRange?.from} selected={dateRange} onSelect={onDateRangeChange} numberOfMonths={2} className="pointer-events-auto" />
              </PopoverContent>
            </Popover>
          </div>

          {/* Time Range Filter */}
          <div>
            <label className="text-sm font-medium mb-1 block">Horário</label>
            <TimeRangePicker value={timeRange} onChange={handleTimeRangeChange} className="w-full" />
          </div>
        </div>
      </div>
    </CardContent>;
};
export default AdminSalesFilters;