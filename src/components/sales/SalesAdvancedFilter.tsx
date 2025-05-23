
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon, ChevronsUpDown, Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { NormalizedSale, getSalesMetadata } from "@/utils/sales-processor";
import TerminalFilter from "./TerminalFilter";

interface SalesAdvancedFilterProps {
  sales: NormalizedSale[];
  onFilter: (filtered: NormalizedSale[]) => void;
}

const SalesAdvancedFilter = ({
  sales,
  onFilter
}: SalesAdvancedFilterProps) => {
  // Extract metadata from sales for filter options
  const metadata = getSalesMetadata(sales);
  
  // Filter state
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined);
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined);
  const [paymentType, setPaymentType] = useState<string>("");
  const [brand, setBrand] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [selectedTerminals, setSelectedTerminals] = useState<string[]>([...metadata.terminals]);
  const [showFilters, setShowFilters] = useState(false);
  
  // Apply filters
  const applyFilters = () => {
    let result = [...sales];
    
    // Filter by date range
    if (dateFrom || dateTo) {
      result = result.filter(sale => {
        const saleDate = typeof sale.transaction_date === 'string'
          ? new Date(sale.transaction_date.split(' ')[0].split('/').reverse().join('-'))
          : sale.transaction_date;
        
        if (!(saleDate instanceof Date)) {
          return true;
        }
        
        if (dateFrom && dateTo) {
          const from = new Date(dateFrom);
          from.setHours(0, 0, 0, 0);
          
          const to = new Date(dateTo);
          to.setHours(23, 59, 59, 999);
          
          return saleDate >= from && saleDate <= to;
        } else if (dateFrom) {
          const from = new Date(dateFrom);
          from.setHours(0, 0, 0, 0);
          return saleDate >= from;
        } else if (dateTo) {
          const to = new Date(dateTo);
          to.setHours(23, 59, 59, 999);
          return saleDate <= to;
        }
        
        return true;
      });
    }
    
    // Filter by payment type
    if (paymentType) {
      result = result.filter(sale => sale.payment_type === paymentType);
    }
    
    // Filter by brand
    if (brand) {
      result = result.filter(sale => sale.brand === brand);
    }
    
    // Filter by status
    if (status) {
      result = result.filter(sale => sale.status === status);
    }
    
    // Filter by terminals
    if (selectedTerminals.length > 0 && selectedTerminals.length < metadata.terminals.length) {
      result = result.filter(sale => selectedTerminals.includes(sale.terminal));
    }
    
    // Update filtered sales
    onFilter(result);
  };
  
  // Reset filters
  const resetFilters = () => {
    setDateFrom(undefined);
    setDateTo(undefined);
    setPaymentType("");
    setBrand("");
    setStatus("");
    setSelectedTerminals([...metadata.terminals]);
    
    // Reset to original data
    onFilter([...sales]);
  };

  return (
    <div className="space-y-4">
      <Button
        variant="outline"
        onClick={() => setShowFilters(!showFilters)}
        className="mb-2 w-full md:w-auto"
      >
        <Filter className="mr-2 h-4 w-4" />
        {showFilters ? 'Ocultar Filtros' : 'Mostrar Filtros'}
        <ChevronsUpDown className="ml-2 h-4 w-4" />
      </Button>
      
      {showFilters && (
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              {/* Date Range */}
              <div className="space-y-2">
                <div className="text-sm font-medium">Período</div>
                <div className="flex flex-col sm:flex-row gap-2">
                  {/* Date From */}
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateFrom ? (
                          format(dateFrom, "dd/MM/yyyy", { locale: ptBR })
                        ) : (
                          <span>Selecione a data inicial</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={dateFrom}
                        onSelect={setDateFrom}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  
                  {/* Date To */}
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateTo ? (
                          format(dateTo, "dd/MM/yyyy", { locale: ptBR })
                        ) : (
                          <span>Selecione a data final</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={dateTo}
                        onSelect={setDateTo}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              
              {/* Payment Type */}
              <div className="space-y-2">
                <div className="text-sm font-medium">Tipo de Pagamento</div>
                <Select value={paymentType} onValueChange={setPaymentType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos os tipos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos os tipos</SelectItem>
                    {metadata.paymentTypes.map(type => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Brand */}
              <div className="space-y-2">
                <div className="text-sm font-medium">Bandeira</div>
                <Select value={brand} onValueChange={setBrand}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todas as bandeiras" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todas as bandeiras</SelectItem>
                    {metadata.brands.map(b => (
                      <SelectItem key={b} value={b}>
                        {b}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Status */}
              <div className="space-y-2">
                <div className="text-sm font-medium">Status</div>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos os status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos os status</SelectItem>
                    {metadata.statuses.map(s => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Terminal Filter (Full Width) */}
              <div className="lg:col-span-3">
                <TerminalFilter
                  terminals={metadata.terminals}
                  selectedTerminals={selectedTerminals}
                  onTerminalsChange={setSelectedTerminals}
                />
              </div>
            </div>
            
            {/* Filter Actions */}
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={resetFilters}>
                Limpar Filtros
              </Button>
              <Button onClick={applyFilters}>
                Aplicar Filtros
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SalesAdvancedFilter;
