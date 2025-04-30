
import { useState } from "react";
import { format, subDays, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

export type DateRange = {
  from: Date;
  to: Date;
};

interface DateRangeFilterProps {
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
}

export function DateRangeFilter({ dateRange, onDateRangeChange }: DateRangeFilterProps) {
  // Handle preset date range selection
  const handlePresetChange = (value: string) => {
    let newRange: DateRange;
    
    switch (value) {
      case "yesterday": {
        const yesterday = subDays(new Date(), 1);
        newRange = {
          from: startOfDay(yesterday),
          to: endOfDay(yesterday),
        };
        break;
      }
      case "thisWeek":
        newRange = {
          from: startOfWeek(new Date(), { locale: ptBR }),
          to: endOfWeek(new Date(), { locale: ptBR }),
        };
        break;
      case "thisMonth":
        newRange = {
          from: startOfMonth(new Date()),
          to: endOfMonth(new Date()),
        };
        break;
      case "last30Days":
      default:
        newRange = {
          from: subDays(new Date(), 30),
          to: new Date(),
        };
        break;
    }
    
    onDateRangeChange(newRange);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-2 mt-2 sm:mt-0 w-full sm:w-auto">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "justify-start text-left font-normal w-full sm:w-auto",
              !dateRange && "text-muted-foreground"
            )}
          >
            <Calendar className="mr-2 h-4 w-4" />
            {dateRange ? (
              <>
                {format(dateRange.from, "dd/MM/yyyy", { locale: ptBR })} -{" "}
                {format(dateRange.to, "dd/MM/yyyy", { locale: ptBR })}
              </>
            ) : (
              <span>Selecione um período</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <CalendarComponent
            initialFocus
            mode="range"
            selected={{
              from: dateRange.from,
              to: dateRange.to,
            }}
            onSelect={(range: any) => {
              if (range?.from && range?.to) {
                onDateRangeChange({
                  from: range.from,
                  to: range.to,
                });
              }
            }}
            numberOfMonths={1}
            locale={ptBR}
            className="p-3 pointer-events-auto"
          />
        </PopoverContent>
      </Popover>

      <Select onValueChange={handlePresetChange}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Filtrar período" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="yesterday">Ontem</SelectItem>
          <SelectItem value="thisWeek">Esta semana</SelectItem>
          <SelectItem value="thisMonth">Este mês</SelectItem>
          <SelectItem value="last30Days">Últimos 30 dias</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

export default DateRangeFilter;
