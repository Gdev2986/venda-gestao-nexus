
import { useEffect, useState } from "react";
import { format, subDays, startOfMonth, endOfMonth, startOfQuarter, endOfQuarter } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, RefreshCcwIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export const DATE_FILTER_PRESETS = {
  LAST_7_DAYS: "last_7_days",
  LAST_30_DAYS: "last_30_days",
  CURRENT_MONTH: "current_month", 
  CURRENT_QUARTER: "current_quarter",
  CUSTOM: "custom",
};

interface DateRangeFiltersProps {
  dateRange: { from: Date; to?: Date };
  setDateRange: (range: { from: Date; to?: Date }) => void;
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
  isLoading?: boolean;
  onRefresh?: () => void;
}

export const DateRangeFilters = ({
  dateRange,
  setDateRange,
  activeFilter,
  setActiveFilter,
  isLoading = false,
  onRefresh,
}: DateRangeFiltersProps) => {
  // Apply preset date filters
  const applyDatePreset = (preset: string) => {
    const now = new Date();
    let from: Date;
    let to: Date = now;
    
    switch (preset) {
      case DATE_FILTER_PRESETS.LAST_7_DAYS:
        from = subDays(now, 7);
        break;
      case DATE_FILTER_PRESETS.LAST_30_DAYS:
        from = subDays(now, 30);
        break;
      case DATE_FILTER_PRESETS.CURRENT_MONTH:
        from = startOfMonth(now);
        to = endOfMonth(now);
        break;
      case DATE_FILTER_PRESETS.CURRENT_QUARTER:
        from = startOfQuarter(now);
        to = endOfQuarter(now);
        break;
      default:
        return; // Don't change dates for custom
    }
    
    setDateRange({ from, to });
    setActiveFilter(preset);
  };

  // Format date range as text
  const formatDateRange = () => {
    if (!dateRange?.from) {
      return "Selecionar período";
    }
    
    return dateRange.to
      ? `${format(dateRange.from, "dd/MM/yyyy", { locale: ptBR })} - ${format(
          dateRange.to,
          "dd/MM/yyyy",
          { locale: ptBR }
        )}`
      : format(dateRange.from, "dd/MM/yyyy", { locale: ptBR });
  };

  // Detect if custom date range is applied
  useEffect(() => {
    if (dateRange?.from && activeFilter === DATE_FILTER_PRESETS.CUSTOM) {
      // Leave as custom
    } else if (!dateRange?.from) {
      applyDatePreset(DATE_FILTER_PRESETS.LAST_30_DAYS);
    }
  }, [dateRange]);

  return (
    <div className="flex flex-wrap gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full sm:w-auto justify-start text-left font-normal",
              !dateRange && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {formatDateRange()}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <div className="p-2 border-b flex justify-between items-center">
            <span className="text-sm font-medium">Selecionar período</span>
          </div>
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={dateRange?.from}
            selected={dateRange}
            onSelect={(range) => {
              if (range) {
                setDateRange(range);
                setActiveFilter(DATE_FILTER_PRESETS.CUSTOM);
              }
            }}
            numberOfMonths={1}
            locale={ptBR}
            className="pointer-events-auto"
          />
        </PopoverContent>
      </Popover>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-full sm:w-auto">
            Filtros rápidos
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem 
            onClick={() => applyDatePreset(DATE_FILTER_PRESETS.LAST_7_DAYS)}
            className={cn(activeFilter === DATE_FILTER_PRESETS.LAST_7_DAYS && "bg-accent")}
          >
            Últimos 7 dias
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => applyDatePreset(DATE_FILTER_PRESETS.LAST_30_DAYS)}
            className={cn(activeFilter === DATE_FILTER_PRESETS.LAST_30_DAYS && "bg-accent")}
          >
            Últimos 30 dias
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => applyDatePreset(DATE_FILTER_PRESETS.CURRENT_MONTH)}
            className={cn(activeFilter === DATE_FILTER_PRESETS.CURRENT_MONTH && "bg-accent")}
          >
            Mês atual
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => applyDatePreset(DATE_FILTER_PRESETS.CURRENT_QUARTER)}
            className={cn(activeFilter === DATE_FILTER_PRESETS.CURRENT_QUARTER && "bg-accent")}
          >
            Trimestre
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      {onRefresh && (
        <Button
          variant="outline"
          size="icon"
          onClick={onRefresh}
          disabled={isLoading}
          title="Atualizar dados"
          aria-label="Atualizar dados"
        >
          <RefreshCcwIcon className={cn("h-4 w-4", isLoading && "animate-spin")} />
        </Button>
      )}
    </div>
  );
};
