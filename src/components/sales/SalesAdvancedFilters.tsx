
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SalesFilterParams } from "@/types";
import { SearchBar, DateRangePicker, BasicFilters, AdvancedFilters } from "./filters";

interface DateRange {
  from: Date;
  to?: Date;
}

interface SalesAdvancedFiltersProps {
  onFilterChange: (key: keyof SalesFilterParams, value: any) => void;
}

const SalesAdvancedFilters = ({
  onFilterChange
}: SalesAdvancedFiltersProps) => {
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [filters, setFilters] = useState<SalesFilterParams>({});
  
  const handleFilterChange = (key: keyof SalesFilterParams, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    onFilterChange(key, value);
  };
  
  return (
    <div className="space-y-4">
      {/* Basic Filters */}
      <BasicFilters 
        filters={filters}
        onFilterChange={handleFilterChange}
      />
      
      {/* Advanced Filters (conditionally shown) */}
      {showMoreFilters && (
        <AdvancedFilters 
          filters={filters}
          onFilterChange={handleFilterChange}
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
      </div>
    </div>
  );
};

export default SalesAdvancedFilters;
