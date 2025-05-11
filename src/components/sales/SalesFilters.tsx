
import { useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Search, CalendarRange, Filter, X, Download } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SearchBar, DateRangePicker } from "@/components/sales/filters";
import { SalesAdvancedFilters } from "./SalesAdvancedFilters";
import SalesDataTable from "./SalesDataTable";

interface DateRange {
  from: Date;
  to?: Date;
}

interface SalesFiltersProps {
  onFilterChange: (key: keyof any, value: any) => void;
  onDateChange: (date: DateRange | undefined) => void;
  onClearFilters: () => void;
  onExport?: () => void;
  onShowImportDialog?: () => void;
  date?: DateRange;
  filters?: Record<string, any>;
}

const SalesFilters = ({
  onFilterChange,
  date,
  onDateChange,
  onClearFilters,
  onExport,
  onShowImportDialog,
}: SalesFiltersProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    onFilterChange("search", searchTerm);
  };

  const handleDatePreset = (preset: "today" | "week" | "month") => {
    const today = new Date();
    let from = new Date();
    let to = undefined;

    if (preset === "today") {
      from = new Date();
    } else if (preset === "week") {
      const day = today.getDay();
      from = new Date(today);
      from.setDate(today.getDate() - day);
    } else if (preset === "month") {
      from = new Date(today.getFullYear(), today.getMonth(), 1);
    }

    onDateChange({ from, to });
  };

  return (
    <div className="space-y-4 w-full">
      <div className="flex flex-col sm:flex-row gap-3 w-full">
        {/* Search Box */}
        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          onSearchSubmit={handleSearchSubmit}
        />

        {/* Action Buttons */}
        <div className="flex gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            type="button"
            size="icon"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="h-10 w-10"
          >
            <Filter className="h-4 w-4" />
          </Button>

          <DateRangePicker
            dateRange={date}
            onDateRangeChange={onDateChange}
            onDatePreset={handleDatePreset}
          />

          {onExport && (
            <Button
              variant="outline"
              type="button"
              onClick={onExport}
              className="hidden sm:flex items-center gap-1"
            >
              <Download className="h-4 w-4" />
              <span>Exportar</span>
            </Button>
          )}

          <Button
            variant="ghost"
            type="button"
            onClick={onClearFilters}
            className="h-10 px-2 sm:px-4"
          >
            <X className="h-4 w-4 mr-0 sm:mr-2" />
            <span className="hidden sm:inline">Limpar</span>
          </Button>
        </div>
      </div>

      {/* Advanced Filters */}
      {showAdvancedFilters && (
        <SalesAdvancedFilters onFilterChange={onFilterChange} />
      )}
    </div>
  );
};

export default SalesFilters;
