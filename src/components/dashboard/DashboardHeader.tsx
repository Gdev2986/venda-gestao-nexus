
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CalendarIcon, ChevronDownIcon } from "lucide-react";
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
import { format, subDays, startOfDay, endOfDay } from "date-fns";
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
  const [date, setDate] = useState<DateRange>({
    from: subDays(new Date(), 7),
    to: new Date(),
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
        to: new Date(),
      },
    },
    {
      label: "Últimos 30 dias",
      value: "30days",
      range: {
        from: subDays(new Date(), 30),
        to: new Date(),
      },
    },
    {
      label: "Este mês",
      value: "thisMonth",
      range: {
        from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        to: new Date(),
      },
    },
  ];

  const handlePresetChange = (value: string) => {
    const preset = presetRanges.find((range) => range.value === value);
    if (preset) {
      setDate(preset.range);
      onDateRangeChange(preset.range);
    }
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
                "w-full sm:w-auto justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "dd/MM/yyyy", { locale: ptBR })} -{" "}
                    {format(date.to, "dd/MM/yyyy", { locale: ptBR })}
                  </>
                ) : (
                  format(date.from, "dd/MM/yyyy", { locale: ptBR })
                )
              ) : (
                <span>Selecione uma data</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 pointer-events-auto" align="end">
            <Calendar
              mode="range"
              selected={date}
              onSelect={(range) => {
                if (range?.from && range?.to) {
                  const newRange = {
                    from: startOfDay(range.from),
                    to: endOfDay(range.to)
                  };
                  setDate(newRange);
                  onDateRangeChange(newRange);
                }
              }}
              numberOfMonths={2}
              className="p-3"
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
