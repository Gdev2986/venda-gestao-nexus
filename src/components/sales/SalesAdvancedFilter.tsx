
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { NormalizedSale } from "@/utils/sales-processor";
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range";
import { DateRange } from "react-day-picker";
import { format, startOfDay, endOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";

interface SalesAdvancedFilterProps {
  sales: NormalizedSale[];
  onFilter: (filteredSales: NormalizedSale[]) => void;
}

const SalesAdvancedFilter = ({ sales, onFilter }: SalesAdvancedFilterProps) => {
  const [selectedTerminal, setSelectedTerminal] = useState<string>("");
  const [selectedPaymentType, setSelectedPaymentType] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  // Get unique values for filters
  const uniqueTerminals = Array.from(new Set(sales.map(sale => sale.terminal))).sort();
  const uniquePaymentTypes = Array.from(new Set(sales.map(sale => sale.payment_type))).sort();
  const uniqueStatuses = Array.from(new Set(sales.map(sale => sale.status))).sort();

  // Get date range from sales data
  const salesDates = sales.map(sale => {
    const date = typeof sale.transaction_date === 'string' 
      ? new Date(sale.transaction_date) 
      : sale.transaction_date;
    return date;
  }).filter(date => !isNaN(date.getTime())).sort((a, b) => a.getTime() - b.getTime());

  const minDate = salesDates.length > 0 ? salesDates[0] : new Date();
  const maxDate = salesDates.length > 0 ? salesDates[salesDates.length - 1] : new Date();

  // Apply filters whenever filter values change
  useEffect(() => {
    let filtered = [...sales];

    // Filter by terminal
    if (selectedTerminal && selectedTerminal !== "all") {
      filtered = filtered.filter(sale => sale.terminal === selectedTerminal);
    }

    // Filter by payment type
    if (selectedPaymentType && selectedPaymentType !== "all") {
      filtered = filtered.filter(sale => sale.payment_type === selectedPaymentType);
    }

    // Filter by status
    if (selectedStatus && selectedStatus !== "all") {
      filtered = filtered.filter(sale => sale.status === selectedStatus);
    }

    // Filter by date range
    if (dateRange?.from) {
      const startDate = startOfDay(dateRange.from);
      const endDate = dateRange.to ? endOfDay(dateRange.to) : endOfDay(dateRange.from);
      
      filtered = filtered.filter(sale => {
        const saleDate = typeof sale.transaction_date === 'string' 
          ? new Date(sale.transaction_date) 
          : sale.transaction_date;
        return saleDate >= startDate && saleDate <= endDate;
      });
    }

    onFilter(filtered);
  }, [selectedTerminal, selectedPaymentType, selectedStatus, dateRange, sales, onFilter]);

  const clearFilters = () => {
    setSelectedTerminal("");
    setSelectedPaymentType("");
    setSelectedStatus("");
    setDateRange(undefined);
  };

  const setDatePreset = (preset: 'today' | 'week' | 'month') => {
    const today = new Date();
    let from = new Date();
    let to = new Date();
    
    switch (preset) {
      case 'today':
        from = today;
        to = today;
        break;
      case 'week':
        const dayOfWeek = today.getDay();
        const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
        from = new Date(today.setDate(diff));
        to = new Date();
        break;
      case 'month':
        from = new Date(today.getFullYear(), today.getMonth(), 1);
        to = new Date();
        break;
    }
    
    setDateRange({ from, to });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Filtros Avançados</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Terminal Filter */}
          <div className="space-y-2">
            <Label>Terminal</Label>
            <Select value={selectedTerminal} onValueChange={setSelectedTerminal}>
              <SelectTrigger>
                <SelectValue placeholder="Selecionar terminal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos os terminais</SelectItem>
                {uniqueTerminals.map(terminal => (
                  <SelectItem key={terminal} value={terminal}>
                    {terminal}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Payment Type Filter */}
          <div className="space-y-2">
            <Label>Tipo de Pagamento</Label>
            <Select value={selectedPaymentType} onValueChange={setSelectedPaymentType}>
              <SelectTrigger>
                <SelectValue placeholder="Selecionar tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos os tipos</SelectItem>
                {uniquePaymentTypes.map(type => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status Filter */}
          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Selecionar status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos os status</SelectItem>
                {uniqueStatuses.map(status => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date Range Filter */}
          <div className="space-y-2">
            <Label>Período</Label>
            <DatePickerWithRange
              value={dateRange}
              onChange={setDateRange}
              className="w-full"
            />
          </div>
        </div>

        {/* Quick Date Presets */}
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => setDatePreset('today')}>
            Hoje
          </Button>
          <Button variant="outline" size="sm" onClick={() => setDatePreset('week')}>
            Esta semana
          </Button>
          <Button variant="outline" size="sm" onClick={() => setDatePreset('month')}>
            Este mês
          </Button>
        </div>

        {/* Period Info */}
        {salesDates.length > 0 && (
          <div className="text-sm text-muted-foreground">
            Período disponível: {format(minDate, "dd/MM/yyyy", { locale: ptBR })} até {format(maxDate, "dd/MM/yyyy", { locale: ptBR })}
          </div>
        )}

        {/* Clear Filters */}
        <div className="flex justify-end">
          <Button variant="ghost" onClick={clearFilters}>
            Limpar Filtros
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SalesAdvancedFilter;
