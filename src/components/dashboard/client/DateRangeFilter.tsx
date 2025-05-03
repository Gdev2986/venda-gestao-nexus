
import { useState } from "react";
import { format, subDays, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isBefore, isToday } from "date-fns";
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
  const [dates, setDates] = useState<{
    from: Date;
    to?: Date;
  }>({
    from: dateRange.from,
    to: dateRange.to
  });

  // Function to disable current day and future dates
  const disabledDays = (date: Date) => {
    // Allow only dates before yesterday (today - 1)
    const yesterday = subDays(new Date(), 1);
    return !isBefore(date, yesterday);
  };

  // Handle calendar date selection
  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (!selectedDate) return;

    if (!dates.from || dates.to) {
      // Reset range and set new 'from' date
      setDates({
        from: selectedDate,
        to: undefined,
      });
    } else {
      // If 'from' is already selected and 'to' is not, set 'to' date
      // Ensure 'to' is not before 'from'
      const to = selectedDate < dates.from ? dates.from : selectedDate;
      const from = selectedDate < dates.from ? selectedDate : dates.from;
      
      const newRange = {
        from: startOfDay(from),
        to: endOfDay(to)
      };
      
      setDates({ from: newRange.from, to: newRange.to });
      onDateRangeChange(newRange);
    }
  };

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
          to: endOfDay(subDays(new Date(), 1)),
        };
        break;
      case "thisMonth":
        newRange = {
          from: startOfMonth(new Date()),
          to: endOfDay(subDays(new Date(), 1)),
        };
        break;
      case "last30Days":
      default:
        newRange = {
          from: subDays(new Date(), 30),
          to: subDays(new Date(), 1),
        };
        break;
    }
    
    setDates({ from: newRange.from, to: newRange.to });
    onDateRangeChange(newRange);
  };

  // Format date for display
  const formatDateString = () => {
    if (!dates.from) {
      return "Selecione um período";
    }
    
    if (!dates.to) {
      return `${format(dates.from, "dd/MM/yyyy", { locale: ptBR })} - Selecione fim`;
    }
    
    return `${format(dates.from, "dd/MM/yyyy", { locale: ptBR })} - ${format(dates.to, "dd/MM/yyyy", { locale: ptBR })}`;
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
            {formatDateString()}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <CalendarComponent
            initialFocus
            mode="single"
            selected={dates.to || dates.from}
            onSelect={handleDateSelect}
            numberOfMonths={1}
            locale={ptBR}
            className="p-3 pointer-events-auto"
            disabled={disabledDays}
            modifiers={{
              selected: dates.to 
                ? [dates.from, dates.to] 
                : [dates.from],
              range: dates.to 
                ? { from: dates.from, to: dates.to } 
                : undefined,
            }}
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
