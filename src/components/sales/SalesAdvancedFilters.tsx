
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SalesFilterParams } from "@/types";
import { 
  SearchBar, 
  DateRangePicker, 
  BasicFilters, 
  AdvancedFilters 
} from "./filters";

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

const SalesAdvancedFilters = ({
  filters,
  dateRange,
  onFilterChange,
  onDateRangeChange,
  onClearFilters
}: SalesAdvancedFiltersProps) => {
  const [searchTerm, setSearchTerm] = useState(filters.search || "");
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange({ ...filters, search: searchTerm });
  };
  
  const handleFilterChange = (key: keyof SalesFilterParams, value: any) => {
    onFilterChange({ ...filters, [key]: value });
  };
  
  const handleAdvancedFilterChange = (updatedFilters: SalesFilterParams) => {
    onFilterChange({ ...filters, ...updatedFilters });
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
        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onSearchSubmit={handleSearchSubmit}
        />
        
        {/* Date Range Picker */}
        <DateRangePicker
          dateRange={dateRange}
          onDateRangeChange={onDateRangeChange}
          onDatePreset={handleDatePreset}
        />
      </div>
      
      {/* Basic Filters */}
      <BasicFilters 
        filters={filters}
        onFilterChange={handleFilterChange}
      />
      
      {/* Advanced Filters (conditionally shown) */}
      {showMoreFilters && (
        <AdvancedFilters 
          filterValues={filters}
          onFilterChange={handleAdvancedFilterChange}
          onResetFilters={onClearFilters}
        />
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
