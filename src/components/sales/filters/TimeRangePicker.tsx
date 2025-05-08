
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

interface TimeRangePickerProps {
  value: [number, number];
  onChange: (value: [number, number]) => void;
  className?: string;
}

const TimeRangePicker = ({
  value,
  onChange,
  className,
}: TimeRangePickerProps) => {
  const [localValue, setLocalValue] = useState<[number, number]>(value);
  
  const formatHour = (hour: number) => {
    return `${hour.toString().padStart(2, '0')}:00`;
  };
  
  const handleStartHourChange = (hourStr: string) => {
    const hour = parseInt(hourStr);
    // Ensure end time is always greater than or equal to start time
    if (hour > localValue[1]) {
      setLocalValue([hour, hour]);
    } else {
      setLocalValue([hour, localValue[1]]);
    }
  };
  
  const handleEndHourChange = (hourStr: string) => {
    const hour = parseInt(hourStr);
    // Ensure start time is always less than or equal to end time
    if (hour < localValue[0]) {
      setLocalValue([hour, hour]);
    } else {
      setLocalValue([localValue[0], hour]);
    }
  };
  
  const handleApply = () => {
    onChange(localValue);
  };

  // Generate hours for select dropdowns
  const hours = Array.from({ length: 24 }, (_, i) => i);
  
  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="time"
            variant="outline"
            className={cn(
              "w-[240px] justify-start text-left font-normal",
              "text-muted-foreground"
            )}
          >
            <Clock className="mr-2 h-4 w-4" />
            <span>
              {formatHour(value[0])} - {formatHour(value[1])}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-4" align="start">
          <div className="space-y-6">
            <div className="space-y-2">
              <h4 className="font-medium text-sm mb-4">Faixa de horário</h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">De</label>
                  <Select
                    value={localValue[0].toString()}
                    onValueChange={handleStartHourChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Início" />
                    </SelectTrigger>
                    <SelectContent>
                      {hours.map((hour) => (
                        <SelectItem key={`start-${hour}`} value={hour.toString()}>
                          {formatHour(hour)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">Até</label>
                  <Select
                    value={localValue[1].toString()}
                    onValueChange={handleEndHourChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Fim" />
                    </SelectTrigger>
                    <SelectContent>
                      {hours.map((hour) => (
                        <SelectItem key={`end-${hour}`} value={hour.toString()}>
                          {formatHour(hour)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            <Button 
              size="sm" 
              className="w-full mt-4"
              onClick={handleApply}
            >
              Aplicar
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default TimeRangePicker;
