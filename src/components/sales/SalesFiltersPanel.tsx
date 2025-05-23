
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalendarIcon, X, Search, Check } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { SalesFilters } from "@/pages/admin/Sales";

interface SalesFiltersPanelProps {
  filters: SalesFilters;
  setFilters: React.Dispatch<React.SetStateAction<SalesFilters>>;
  metadata: {
    paymentTypes: string[];
    statuses: string[];
    terminals: string[];
    brands: string[];
  };
  onClearFilters: () => void;
}

export default function SalesFiltersPanel({
  filters,
  setFilters,
  metadata,
  onClearFilters
}: SalesFiltersPanelProps) {
  const [terminalSearch, setTerminalSearch] = useState("");
  
  // Filter terminals based on search
  const filteredTerminals = terminalSearch
    ? metadata.terminals.filter(terminal => 
        terminal.toLowerCase().includes(terminalSearch.toLowerCase()))
    : metadata.terminals;
  
  // Handler for date range selection
  const handleDateChange = (range: { from: Date | null; to: Date | null }) => {
    setFilters(prev => ({
      ...prev,
      dateRange: range
    }));
  };
  
  // Handler for payment type selection
  const handlePaymentTypeChange = (paymentType: string) => {
    setFilters(prev => {
      if (prev.paymentType.includes(paymentType)) {
        return {
          ...prev,
          paymentType: prev.paymentType.filter(t => t !== paymentType)
        };
      } else {
        return {
          ...prev,
          paymentType: [...prev.paymentType, paymentType]
        };
      }
    });
  };
  
  // Handler for status selection
  const handleStatusChange = (status: string) => {
    setFilters(prev => {
      if (prev.status.includes(status)) {
        return {
          ...prev,
          status: prev.status.filter(s => s !== status)
        };
      } else {
        return {
          ...prev,
          status: [...prev.status, status]
        };
      }
    });
  };
  
  // Handler for terminal selection
  const handleTerminalChange = (terminal: string) => {
    setFilters(prev => {
      if (prev.terminals.includes(terminal)) {
        return {
          ...prev,
          terminals: prev.terminals.filter(t => t !== terminal)
        };
      } else {
        return {
          ...prev,
          terminals: [...prev.terminals, terminal]
        };
      }
    });
  };
  
  // Handler for brand selection
  const handleBrandChange = (brand: string) => {
    setFilters(prev => {
      if (prev.brands.includes(brand)) {
        return {
          ...prev,
          brands: prev.brands.filter(b => b !== brand)
        };
      } else {
        return {
          ...prev,
          brands: [...prev.brands, brand]
        };
      }
    });
  };
  
  // Format date display for the date range picker
  const formatDateDisplay = () => {
    const { from, to } = filters.dateRange;
    
    if (from && to) {
      return `${format(from, "dd/MM/yyyy", { locale: ptBR })} - ${format(to, "dd/MM/yyyy", { locale: ptBR })}`;
    }
    
    if (from) {
      return `A partir de ${format(from, "dd/MM/yyyy", { locale: ptBR })}`;
    }
    
    if (to) {
      return `Até ${format(to, "dd/MM/yyyy", { locale: ptBR })}`;
    }
    
    return "Selecione um período";
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Filtros</h2>
        <Button variant="ghost" size="sm" onClick={onClearFilters}>
          Limpar filtros
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Date Range Filter */}
        <div className="space-y-2">
          <Label>Período</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left",
                  (filters.dateRange.from || filters.dateRange.to) && "text-primary"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formatDateDisplay()}
                
                {(filters.dateRange.from || filters.dateRange.to) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-auto h-6 w-6 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDateChange({ from: null, to: null });
                    }}
                  >
                    <X className="h-3 w-3" />
                    <span className="sr-only">Limpar</span>
                  </Button>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="range"
                selected={filters.dateRange}
                onSelect={handleDateChange}
                disabled={(date) => date > new Date()}
                initialFocus
                locale={ptBR}
              />
            </PopoverContent>
          </Popover>
        </div>
        
        {/* Payment Type Filter */}
        <div className="space-y-2">
          <Label>Tipo de Pagamento</Label>
          <div className="flex flex-wrap gap-2">
            {metadata.paymentTypes.map(type => (
              <Badge
                key={type}
                variant={filters.paymentType.includes(type) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => handlePaymentTypeChange(type)}
              >
                {type}
                {filters.paymentType.includes(type) && (
                  <X className="ml-1 h-3 w-3" />
                )}
              </Badge>
            ))}
          </div>
        </div>
        
        {/* Status Filter */}
        <div className="space-y-2">
          <Label>Status</Label>
          <div className="flex flex-wrap gap-2">
            {metadata.statuses.map(status => (
              <Badge
                key={status}
                variant={filters.status.includes(status) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => handleStatusChange(status)}
              >
                {status}
                {filters.status.includes(status) && (
                  <X className="ml-1 h-3 w-3" />
                )}
              </Badge>
            ))}
          </div>
        </div>
        
        {/* Brand Filter */}
        <div className="space-y-2">
          <Label>Bandeira</Label>
          <div className="flex flex-wrap gap-2">
            {metadata.brands.map(brand => (
              <Badge
                key={brand}
                variant={filters.brands.includes(brand) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => handleBrandChange(brand)}
              >
                {brand}
                {filters.brands.includes(brand) && (
                  <X className="ml-1 h-3 w-3" />
                )}
              </Badge>
            ))}
          </div>
        </div>
        
        {/* Terminal Filter */}
        <div className="space-y-2 col-span-1 md:col-span-2 lg:col-span-3">
          <Label>Terminal</Label>
          <div className="space-y-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar terminal..."
                className="pl-8"
                value={terminalSearch}
                onChange={(e) => setTerminalSearch(e.target.value)}
              />
            </div>
            
            {filters.terminals.length > 0 && (
              <div className="flex flex-wrap gap-2 p-2">
                {filters.terminals.map(terminal => (
                  <Badge
                    key={terminal}
                    variant="default"
                    className="cursor-pointer"
                    onClick={() => handleTerminalChange(terminal)}
                  >
                    {terminal}
                    <X className="ml-1 h-3 w-3" />
                  </Badge>
                ))}
              </div>
            )}
            
            <ScrollArea className="h-[180px] rounded-md border">
              <div className="p-2">
                {filteredTerminals.length > 0 ? (
                  filteredTerminals.map(terminal => (
                    <div
                      key={terminal}
                      className="flex items-center space-x-2 p-2 hover:bg-muted/50 rounded cursor-pointer"
                      onClick={() => handleTerminalChange(terminal)}
                    >
                      <Checkbox 
                        checked={filters.terminals.includes(terminal)} 
                        onCheckedChange={() => handleTerminalChange(terminal)}
                        id={`terminal-${terminal}`}
                      />
                      <label
                        htmlFor={`terminal-${terminal}`}
                        className="flex-1 cursor-pointer text-sm"
                      >
                        {terminal}
                      </label>
                      {filters.terminals.includes(terminal) && (
                        <Check className="h-4 w-4 text-primary" />
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    {terminalSearch
                      ? "Nenhum terminal encontrado"
                      : "Nenhum terminal disponível"}
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );
}
