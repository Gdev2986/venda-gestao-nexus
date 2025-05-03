
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
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
import { Calendar } from "@/components/ui/calendar";
import { format, subDays, startOfDay, endOfDay, isBefore } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface DateRange {
  from: Date;
  to: Date;
}

interface DashboardHeaderProps {
  onDateRangeChange: (range: DateRange) => void;
}

const DashboardHeader = ({ onDateRangeChange }: DashboardHeaderProps) => {
  const [dates, setDates] = useState<{
    from: Date;
    to?: Date;
  }>({
    from: subDays(new Date(), 7),
    to: subDays(new Date(), 1),
  });

  const presetRanges = [
    {
      label: "Ontem",
      value: "yesterday",
      range: {
        from: startOfDay(subDays(new Date(), 1)),
        to: endOfDay(subDays(new Date(), 1)),
      },
    },
    {
      label: "Últimos 7 dias",
      value: "7days",
      range: {
        from: subDays(new Date(), 7),
        to: subDays(new Date(), 1),
      },
    },
    {
      label: "Últimos 30 dias",
      value: "30days",
      range: {
        from: subDays(new Date(), 30),
        to: subDays(new Date(), 1),
      },
    },
    {
      label: "Este mês",
      value: "thisMonth",
      range: {
        from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        to: subDays(new Date(), 1),
      },
    },
  ];

  // Function to disable current day and future dates
  const disabledDays = (date: Date) => {
    // Allow only dates before yesterday (today - 1)
    const yesterday = subDays(new Date(), 1);
    return !isBefore(date, yesterday);
  };

  // Handle calendar date selection with two clicks
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

  const handlePresetChange = (value: string) => {
    const preset = presetRanges.find((range) => range.value === value);
    if (preset) {
      setDates({ 
        from: preset.range.from, 
        to: preset.range.to 
      });
      onDateRangeChange(preset.range);
    }
  };

  // Format date for display
  const formatDateString = () => {
    if (!dates.from) {
      return "Selecione uma data";
    }
    
    if (!dates.to) {
      return `${format(dates.from, "dd/MM/yyyy", { locale: ptBR })} - Selecione fim`;
    }
    
    return `${format(dates.from, "dd/MM/yyyy", { locale: ptBR })} - ${format(dates.to, "dd/MM/yyyy", { locale: ptBR })}`;
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Acompanhe suas vendas e métricas principais.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full sm:w-auto justify-start text-left font-normal"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {formatDateString()}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              mode="single"
              selected={dates.to || dates.from}
              onSelect={handleDateSelect}
              numberOfMonths={1}
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
            <SelectValue placeholder="Período" />
          </SelectTrigger>
          <SelectContent>
            {presetRanges.map((range) => (
              <SelectItem key={range.value} value={range.value}>
                {range.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default DashboardHeader;
