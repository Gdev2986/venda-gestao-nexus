
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Clock, X } from "lucide-react";

interface TimeRangeFilterProps {
  startHour?: number;
  endHour?: number;
  onTimeRangeChange: (startHour?: number, endHour?: number) => void;
}

const TimeRangeFilter = ({ startHour, endHour, onTimeRangeChange }: TimeRangeFilterProps) => {
  const [startTime, setStartTime] = useState<string>(
    startHour !== undefined ? String(startHour).padStart(2, '0') + ':00' : ''
  );
  const [endTime, setEndTime] = useState<string>(
    endHour !== undefined ? String(endHour).padStart(2, '0') + ':00' : ''
  );

  const handleStartTimeChange = (value: string) => {
    setStartTime(value);
    if (value) {
      const hour = parseInt(value.split(':')[0]);
      onTimeRangeChange(hour, endHour);
    } else {
      onTimeRangeChange(undefined, endHour);
    }
  };

  const handleEndTimeChange = (value: string) => {
    setEndTime(value);
    if (value) {
      const hour = parseInt(value.split(':')[0]);
      onTimeRangeChange(startHour, hour);
    } else {
      onTimeRangeChange(startHour, undefined);
    }
  };

  const clearTimeFilter = () => {
    setStartTime('');
    setEndTime('');
    onTimeRangeChange(undefined, undefined);
  };

  const hasTimeFilter = startTime || endTime;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4" />
        <Label className="text-sm font-medium">Horário</Label>
        {hasTimeFilter && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearTimeFilter}
            className="h-6 w-6 p-0"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <Label htmlFor="start-time" className="text-xs text-muted-foreground">
            Início
          </Label>
          <Input
            id="start-time"
            type="time"
            value={startTime}
            onChange={(e) => handleStartTimeChange(e.target.value)}
            className="text-sm"
          />
        </div>
        
        <div className="space-y-1">
          <Label htmlFor="end-time" className="text-xs text-muted-foreground">
            Fim
          </Label>
          <Input
            id="end-time"
            type="time"
            value={endTime}
            onChange={(e) => handleEndTimeChange(e.target.value)}
            className="text-sm"
          />
        </div>
      </div>
      
      {hasTimeFilter && (
        <div className="text-xs text-muted-foreground">
          {startTime && `A partir de ${startTime}`}
          {startTime && endTime && ` até `}
          {endTime && `${endTime}`}
        </div>
      )}
    </div>
  );
};

export default TimeRangeFilter;
