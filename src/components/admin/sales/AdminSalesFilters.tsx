import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { DateRange } from "react-day-picker";

export interface AdminSalesFiltersProps {
  filters: {
    search: string;
    status: string;
    dateRange: DateRange;
  };
  onFilterChange?: (key: string, value: any) => void;
  onSearch?: (value: string) => void;
  onStatusChange?: (value: string) => void;
  onDateRangeChange?: (range: DateRange) => void;
  onClearFilters?: () => void;
}

const AdminSalesFilters: React.FC<AdminSalesFiltersProps> = ({
  filters,
  onFilterChange,
  onSearch,
  onStatusChange,
  onDateRangeChange,
  onClearFilters
}) => {
  return (
    <div className="flex flex-wrap gap-3">
      <Input 
        placeholder="Buscar vendas..." 
        value={filters.search}
        onChange={(e) => {
          if (onSearch) onSearch(e.target.value);
          if (onFilterChange) onFilterChange("search", e.target.value);
        }}
        className="w-full sm:w-64"
      />
      <Select 
        value={filters.status} 
        onValueChange={(value) => {
          if (onStatusChange) onStatusChange(value);
          if (onFilterChange) onFilterChange("status", value);
        }}
      >
        <SelectTrigger className="w-full sm:w-44">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos</SelectItem>
          <SelectItem value="paid">Pagas</SelectItem>
          <SelectItem value="pending">Pendentes</SelectItem>
          <SelectItem value="canceled">Canceladas</SelectItem>
        </SelectContent>
      </Select>
      
      {onClearFilters && (
        <Button variant="outline" onClick={onClearFilters}>
          Limpar filtros
        </Button>
      )}
    </div>
  );
};

export default AdminSalesFilters;
