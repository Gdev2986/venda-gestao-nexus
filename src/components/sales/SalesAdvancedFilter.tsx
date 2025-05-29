
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, Filter, X } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { NormalizedSale, getSalesMetadata } from "@/utils/sales-processor";
import TerminalFilter from "./TerminalFilter";

interface SalesAdvancedFilterProps {
  sales: NormalizedSale[];
  onFilter: (filteredSales: NormalizedSale[]) => void;
}

interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

const SalesAdvancedFilter = ({ sales, onFilter }: SalesAdvancedFilterProps) => {
  const [dateRange, setDateRange] = useState<DateRange>({ from: undefined, to: undefined });
  const [paymentType, setPaymentType] = useState<string>("all");
  const [status, setStatus] = useState<string>("all");
  const [brand, setBrand] = useState<string>("all");
  const [selectedTerminals, setSelectedTerminals] = useState<string[]>([]);
  const [source, setSource] = useState<string>("all");
  
  // Get metadata for filter options
  const metadata = getSalesMetadata(sales);
  
  // Get unique dates from sales data and sort them
  const salesDates = sales.map(sale => {
    // Parse the formatted date string back to a Date object
    if (typeof sale.transaction_date === 'string') {
      // Assuming format is "DD/MM/YYYY HH:MM"
      const [datePart] = sale.transaction_date.split(' ');
      const [day, month, year] = datePart.split('/');
      return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    }
    return sale.transaction_date;
  }).filter(date => !isNaN(date.getTime())).sort((a, b) => a.getTime() - b.getTime());
  
  // Get unique dates only (without time)
  const uniqueDates = salesDates.reduce((acc, date) => {
    const dateString = format(date, 'yyyy-MM-dd');
    if (!acc.some(d => format(d, 'yyyy-MM-dd') === dateString)) {
      acc.push(date);
    }
    return acc;
  }, [] as Date[]);
  
  const minDate = uniqueDates.length > 0 ? uniqueDates[0] : undefined;
  const maxDate = uniqueDates.length > 0 ? uniqueDates[uniqueDates.length - 1] : undefined;
  
  // Auto-select all terminals when terminals list changes (but only if none selected)
  useEffect(() => {
    if (metadata.terminals.length > 0 && selectedTerminals.length === 0) {
      setSelectedTerminals(metadata.terminals);
    }
  }, [metadata.terminals]);
  
  // Apply filters whenever any filter changes
  useEffect(() => {
    let filtered = [...sales];
    
    // Date range filter
    if (dateRange.from) {
      filtered = filtered.filter(sale => {
        let saleDate: Date;
        
        if (typeof sale.transaction_date === 'string') {
          // Parse the formatted date string back to a Date object
          const [datePart] = sale.transaction_date.split(' ');
          const [day, month, year] = datePart.split('/');
          saleDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        } else {
          saleDate = sale.transaction_date;
        }
          
        const fromDate = new Date(dateRange.from!);
        fromDate.setHours(0, 0, 0, 0);
        
        const toDate = dateRange.to ? new Date(dateRange.to) : new Date(dateRange.from!);
        toDate.setHours(23, 59, 59, 999);
        
        return saleDate >= fromDate && saleDate <= toDate;
      });
    }
    
    // Payment type filter
    if (paymentType && paymentType !== "all") {
      filtered = filtered.filter(sale => sale.payment_type === paymentType);
    }
    
    // Status filter
    if (status && status !== "all") {
      filtered = filtered.filter(sale => sale.status === status);
    }
    
    // Brand filter
    if (brand && brand !== "all") {
      filtered = filtered.filter(sale => sale.brand === brand);
    }
    
    // Terminal filter - only filter if there are selected terminals
    if (selectedTerminals.length > 0) {
      filtered = filtered.filter(sale => selectedTerminals.includes(sale.terminal));
    }
    
    // Source filter
    if (source && source !== "all") {
      filtered = filtered.filter(sale => sale.source === source);
    }
    
    onFilter(filtered);
  }, [sales, dateRange, paymentType, status, brand, selectedTerminals, source, onFilter]);
  
  const clearFilters = () => {
    setDateRange({ from: undefined, to: undefined });
    setPaymentType("all");
    setStatus("all");
    setBrand("all");
    setSelectedTerminals(metadata.terminals);
    setSource("all");
  };
  
  const hasActiveFilters = dateRange.from || paymentType !== "all" || status !== "all" || brand !== "all" || source !== "all" || 
    selectedTerminals.length !== metadata.terminals.length;

  // Function to check if a date has sales
  const isDateWithSales = (date: Date) => {
    return uniqueDates.some(saleDate => 
      format(saleDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Filtros de Vendas
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Date Range Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Período</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !dateRange.from && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "dd/MM/yyyy", { locale: ptBR })} -{" "}
                        {format(dateRange.to, "dd/MM/yyyy", { locale: ptBR })}
                      </>
                    ) : (
                      format(dateRange.from, "dd/MM/yyyy", { locale: ptBR })
                    )
                  ) : (
                    "Selecione o período"
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="range"
                  selected={dateRange}
                  onSelect={(range) => setDateRange(range ? { from: range.from, to: range.to } : { from: undefined, to: undefined })}
                  numberOfMonths={2}
                  locale={ptBR}
                  fromDate={minDate}
                  toDate={maxDate}
                  disabled={(date) => {
                    // Disable dates outside the range AND dates without sales
                    if (minDate && date < minDate) return true;
                    if (maxDate && date > maxDate) return true;
                    return !isDateWithSales(date);
                  }}
                  className="pointer-events-auto"
                />
                {minDate && maxDate && (
                  <div className="p-3 border-t text-sm text-muted-foreground">
                    Período disponível: {format(minDate, "dd/MM/yyyy", { locale: ptBR })} - {format(maxDate, "dd/MM/yyyy", { locale: ptBR })}
                  </div>
                )}
              </PopoverContent>
            </Popover>
          </div>
          
          {/* Payment Type Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Tipo de Pagamento</label>
            <Select value={paymentType} onValueChange={setPaymentType}>
              <SelectTrigger>
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {metadata.paymentTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Status Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Status</label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {metadata.statuses.map(status => (
                  <SelectItem key={status} value={status}>{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Brand Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Bandeira</label>
            <Select value={brand} onValueChange={setBrand}>
              <SelectTrigger>
                <SelectValue placeholder="Todas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                {metadata.brands.map(brand => (
                  <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Source Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Origem</label>
            <Select value={source} onValueChange={setSource}>
              <SelectTrigger>
                <SelectValue placeholder="Todas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                {[...new Set(sales.map(s => s.source))].map(source => (
                  <SelectItem key={source} value={source}>{source}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Terminal Filter */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-1">
            <TerminalFilter
              terminals={metadata.terminals}
              selectedTerminals={selectedTerminals}
              onTerminalsChange={setSelectedTerminals}
            />
          </div>
        </div>
        
        {/* Filter Actions */}
        {hasActiveFilters && (
          <div className="flex justify-end">
            <Button
              variant="outline"
              onClick={clearFilters}
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Limpar Filtros
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SalesAdvancedFilter;
