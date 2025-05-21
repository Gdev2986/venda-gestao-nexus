import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger, 
} from "@/components/ui/popover";
import { 
  CalendarIcon, 
  RefreshCw
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format, subDays, startOfMonth, endOfMonth, startOfQuarter, endOfQuarter } from "date-fns";
import { pt } from "date-fns/locale";

// Dashboard date filter presets
export const DATE_FILTER_PRESETS = {
  LAST_7_DAYS: "last_7_days",
  LAST_30_DAYS: "last_30_days",
  CURRENT_MONTH: "current_month",
  QUARTER: "quarter",
  CUSTOM: "custom"
};

interface DateRangeFiltersProps {
  dateRange: {from: Date; to?: Date};
  setDateRange: (range: {from: Date; to?: Date}) => void;
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
  isLoading: boolean;
  onRefresh: () => void;
}

export function DateRangeFilters({
  dateRange,
  setDateRange,
  activeFilter,
  setActiveFilter,
  isLoading,
  onRefresh
}: DateRangeFiltersProps) {
  // Function to handle filter changes
  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    
    const now = new Date();
    switch(filter) {
      case DATE_FILTER_PRESETS.LAST_7_DAYS:
        setDateRange({
          from: subDays(now, 7),
          to: now
        });
        break;
      case DATE_FILTER_PRESETS.LAST_30_DAYS:
        setDateRange({
          from: subDays(now, 30),
          to: now
        });
        break;
      case DATE_FILTER_PRESETS.CURRENT_MONTH:
        setDateRange({
          from: startOfMonth(now),
          to: endOfMonth(now)
        });
        break;
      case DATE_FILTER_PRESETS.QUARTER:
        setDateRange({
          from: startOfQuarter(now),
          to: endOfQuarter(now)
        });
        break;
      // Custom remains unchanged as it's set directly by the calendar
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 mt-3 sm:mt-0">
      {/* Date filter - scrollable on mobile */}
      <div className="flex flex-nowrap overflow-x-auto w-full pb-1 sm:pb-0 sm:w-auto gap-0 shadow-sm rounded-md">
        <Button 
          variant={activeFilter === DATE_FILTER_PRESETS.LAST_7_DAYS ? "default" : "outline"}
          onClick={() => handleFilterChange(DATE_FILTER_PRESETS.LAST_7_DAYS)}
          className="rounded-r-none flex-shrink-0"
          size="sm"
        >
          7 dias
        </Button>
        <Button 
          variant={activeFilter === DATE_FILTER_PRESETS.LAST_30_DAYS ? "default" : "outline"}
          onClick={() => handleFilterChange(DATE_FILTER_PRESETS.LAST_30_DAYS)}
          className="rounded-none border-l-0 border-r-0 flex-shrink-0"
          size="sm"
        >
          30 dias
        </Button>
        <Button 
          variant={activeFilter === DATE_FILTER_PRESETS.CURRENT_MONTH ? "default" : "outline"}
          onClick={() => handleFilterChange(DATE_FILTER_PRESETS.CURRENT_MONTH)}
          className="rounded-none border-r-0 flex-shrink-0"
          size="sm"
        >
          Mês
        </Button>
        <Button 
          variant={activeFilter === DATE_FILTER_PRESETS.QUARTER ? "default" : "outline"}
          onClick={() => handleFilterChange(DATE_FILTER_PRESETS.QUARTER)}
          className="rounded-l-none flex-shrink-0"
          size="sm"
        >
          Trimestre
        </Button>
      </div>
      
      <div className="flex items-center gap-2 w-full sm:w-auto mt-3 sm:mt-0">
        {/* Calendar picker */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-2 w-full sm:w-auto">
              <CalendarIcon size={16} />
              <span className="truncate text-xs sm:text-sm">
                {dateRange.from && dateRange.to ? (
                  <>
                    {format(dateRange.from, "dd/MM/yy")} - {format(dateRange.to, "dd/MM/yy")}
                  </>
                ) : (
                  "Período"
                )}
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              locale={pt}
              mode="range"
              defaultMonth={dateRange.from}
              selected={dateRange}
              onSelect={(range) => {
                if (range?.from) {
                  setDateRange(range);
                  setActiveFilter(DATE_FILTER_PRESETS.CUSTOM);
                }
              }}
              numberOfMonths={1}
              className={cn("p-3 pointer-events-auto")}
            />
          </PopoverContent>
        </Popover>

        <Button 
          variant="outline" 
          onClick={onRefresh} 
          disabled={isLoading}
          size="icon"
          className="h-8 w-8 p-0"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        </Button>
      </div>
    </div>
  );
}
