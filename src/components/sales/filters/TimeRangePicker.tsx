
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { 
  Slider 
} from "@/components/ui/slider";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

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
  
  const handleSliderChange = (newValues: number[]) => {
    setLocalValue([newValues[0], newValues[1]]);
  };
  
  const handleApply = () => {
    onChange(localValue);
  };

  const formatHour = (hour: number) => {
    return `${hour.toString().padStart(2, '0')}:00`;
  };
  
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
              <h4 className="font-medium text-sm">Faixa de horário</h4>
              <Slider
                defaultValue={localValue}
                value={localValue}
                min={0}
                max={23}
                step={1}
                minStepsBetweenThumbs={1}
                onValueChange={handleSliderChange}
                className="mt-6"
              />
            </div>
            
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{formatHour(localValue[0])}</span>
              <span>{formatHour(localValue[1])}</span>
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
