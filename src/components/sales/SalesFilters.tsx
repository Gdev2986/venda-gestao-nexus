
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { SalesFilterParams } from "@/types";
import { Calendar } from "@/components/ui/calendar";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { CalendarIcon, Download, Search, Upload } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface DateRange {
  from: Date;
  to?: Date;
}

interface SalesFiltersProps {
  filters: SalesFilterParams;
  date?: DateRange;
  onFilterChange: (key: keyof SalesFilterParams, value: any) => void;
  onDateChange: (date: DateRange | undefined) => void;
  onClearFilters: () => void;
  onExport: () => void;
  onShowImportDialog: () => void;
}

const PAYMENT_METHODS = [
  { value: "credit", label: "Crédito" },
  { value: "debit", label: "Débito" },
  { value: "pix", label: "Pix" }
];

const TERMINALS = [
  "T100", "T101", "T102", "T103", "T104", "T105"
];

const SalesFilters = ({
  filters,
  date,
  onFilterChange,
  onDateChange,
  onClearFilters,
  onExport,
  onShowImportDialog
}: SalesFiltersProps) => {
  const [searchTerm, setSearchTerm] = useState(filters.search || "");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange("search", searchTerm);
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-2">
        {/* Search Bar */}
        <form 
          className="flex-1" 
          onSubmit={handleSearchSubmit}
        >
          <div className="relative">
            <Search className="absolute left-2 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por código ou terminal..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-7 h-8 text-sm"
            />
          </div>
        </form>
        
        {/* Date Range Picker */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              size="sm"
              className={cn(
                "sm:w-[200px] justify-start text-left font-normal h-8",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-1 h-3 w-3" />
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "dd/MM/yyyy")} -{" "}
                    {format(date.to, "dd/MM/yyyy")}
                  </>
                ) : (
                  format(date.from, "dd/MM/yyyy")
                )
              ) : (
                <span className="text-xs">Filtrar por data</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={onDateChange}
              numberOfMonths={1}
              className="pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
        
        {/* Actions */}
        <div className="flex gap-1">
          <Button 
            variant="outline"
            size="sm"
            className="h-8 px-2"
            onClick={onShowImportDialog}
          >
            <Upload className="h-3 w-3 mr-1" />
            <span className="text-xs">Importar</span>
          </Button>
          <Button 
            variant="outline"
            size="sm"
            className="h-8 px-2"
            onClick={onExport}
          >
            <Download className="h-3 w-3 mr-1" />
            <span className="text-xs">Exportar</span>
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-2">
        {/* Payment Method Filter */}
        <div className="flex-1">
          <Select
            value={filters.paymentMethod || "all"}
            onValueChange={(value) => onFilterChange("paymentMethod", value === "all" ? undefined : value)}
          >
            <SelectTrigger className="h-8 text-sm">
              <SelectValue placeholder="Forma de Pagamento" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as formas</SelectItem>
              {PAYMENT_METHODS.map((method) => (
                <SelectItem key={method.value} value={method.value}>
                  {method.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Terminal Filter */}
        <div className="flex-1">
          <Select
            value={filters.terminal || "all"}
            onValueChange={(value) => onFilterChange("terminal", value === "all" ? undefined : value)}
          >
            <SelectTrigger className="h-8 text-sm">
              <SelectValue placeholder="Terminal" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os terminais</SelectItem>
              {TERMINALS.map((terminal) => (
                <SelectItem key={terminal} value={terminal}>
                  {terminal}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Clear Filters Button */}
        <Button 
          variant="ghost" 
          size="sm"
          onClick={onClearFilters} 
          className="sm:self-center h-8 text-xs"
        >
          Limpar filtros
        </Button>
      </div>
    </div>
  );
};

export default SalesFilters;
