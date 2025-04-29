
import { useState } from "react"
import { CalendarIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface DashboardHeaderProps {
  className?: string
  numberOfMonths?: number
  onDateRangeChange?: (range: { from: Date, to: Date }) => void
}

export function DashboardHeader({
  className,
  numberOfMonths = 1,
  onDateRangeChange,
}: DashboardHeaderProps) {
  const [date, setDate] = useState<Date | undefined>(new Date())

  const onSelect = (date: Date | undefined) => {
    setDate(date)
    
    if (date && onDateRangeChange) {
      // Create a range from the selected date to end of day
      const from = new Date(date)
      from.setHours(0, 0, 0, 0)
      
      const to = new Date(date)
      to.setHours(23, 59, 59, 999)
      
      onDateRangeChange({ from, to })
    }
  }

  return (
    <div className="md:flex items-center justify-between space-y-2 md:space-y-0">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Visão geral do seu negócio e principais indicadores
        </p>
      </div>
      <div className="space-x-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-[300px] justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? (
                date.toLocaleDateString()
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              mode="single"
              selected={date}
              onSelect={onSelect}
              numberOfMonths={numberOfMonths}
              className={className}
            />
          </PopoverContent>
        </Popover>
        <Button>Download Report</Button>
      </div>
    </div>
  )
}

// Add the default export
export default DashboardHeader
