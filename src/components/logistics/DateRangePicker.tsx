
import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DateRangePickerProps {
  dateRange: {
    from: Date;
    to?: Date;
  };
  onDateRangeChange: (dateRange: { from: Date; to?: Date }) => void;
}

const DateRangePicker = ({ dateRange, onDateRangeChange }: DateRangePickerProps) => {
  const handlePresetChange = (preset: string) => {
    const today = new Date();
    let from = new Date();
    
    switch (preset) {
      case "today":
        from = today;
        break;
      case "week":
        from = new Date(today.setDate(today.getDate() - 7));
        break;
      case "month":
        from = new Date(today.setDate(today.getDate() - 30));
        break;
      default:
        from = new Date(today.setDate(today.getDate() - 30));
        break;
    }
    
    onDateRangeChange({ from, to: new Date() });
  };

  return (
    <div className="flex flex-col md:flex-row gap-2">
      <Select onValueChange={handlePresetChange} defaultValue="month">
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Selecionar período" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="today">Hoje</SelectItem>
          <SelectItem value="week">Últimos 7 dias</SelectItem>
          <SelectItem value="month">Últimos 30 dias</SelectItem>
        </SelectContent>
      </Select>
      
      <div className="flex gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-[180px] justify-start text-left font-normal",
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateRange.from ? (
                dateRange.to ? (
                  <>
                    {format(dateRange.from, "dd/MM/yyyy")} -{" "}
                    {format(dateRange.to, "dd/MM/yyyy")}
                  </>
                ) : (
                  format(dateRange.from, "dd/MM/yyyy")
                )
              ) : (
                <span>Selecionar data</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="range"
              selected={{
                from: dateRange.from,
                to: dateRange.to || dateRange.from,
              }}
              onSelect={(selected) => {
                if (selected) {
                  onDateRangeChange({
                    from: selected.from || new Date(),
                    to: selected.to,
                  });
                }
              }}
              initialFocus
              className="p-3 pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default DateRangePicker;
