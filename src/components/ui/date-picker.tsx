
import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { ptBR } from "date-fns/locale"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerProps {
  selected?: Date
  onSelect?: (date?: Date) => void
  placeholder?: string
  showMonthDropdown?: boolean
  showYearDropdown?: boolean
  dropdownMode?: "select" | "scroll"
  className?: string
}

export function DatePicker({
  selected,
  onSelect,
  placeholder = "Selecionar data",
  showMonthDropdown = false,
  showYearDropdown = false,
  dropdownMode = "select",
  className,
}: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !selected && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selected ? format(selected, "PPP", { locale: ptBR }) : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selected}
          onSelect={onSelect}
          initialFocus
          locale={ptBR}
          showMonthDropdown={showMonthDropdown}
          showYearDropdown={showYearDropdown}
          dropdownMode={dropdownMode}
          className={cn("p-3 pointer-events-auto")}
        />
      </PopoverContent>
    </Popover>
  )
}
