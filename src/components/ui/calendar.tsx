import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  reversedRange?: boolean;
};

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  reversedRange = true, // Default to reversed range selection
  ...props
}: CalendarProps) {
  // Create a properly typed version of props for the render
  const dayPickerProps = React.useMemo(() => {
    // Base props to pass to DayPicker
    const baseProps = {
      showOutsideDays,
      className: cn("p-3 pointer-events-auto", className),
      classNames: {
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside:
          "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      },
      components: {
        IconLeft: () => <ChevronLeft className="h-4 w-4" />,
        IconRight: () => <ChevronRight className="h-4 w-4" />,
      },
      ...props,
    };
    
    // If we're using range selection mode with reversed selection,
    // we need to customize the onSelect handler
    if (props.mode === 'range' && reversedRange) {
      // Keep track of our internal selection state
      const [selectionState, setSelectionState] = React.useState<{
        phase: 'start' | 'end';
        endDate?: Date;
      }>({
        phase: 'end' // Start by selecting end date
      });
      
      // Custom onSelect handler for reversed range selection
      const originalOnSelect = props.onSelect as any;
      
      baseProps.onSelect = (
        range: { from?: Date; to?: Date } | undefined,
        selectedDay: Date | undefined,
        activeModifiers: any,
        e: any
      ) => {
        // If range is undefined (clear selection)
        if (!range) {
          setSelectionState({ phase: 'end' });
          originalOnSelect?.(undefined, selectedDay, activeModifiers, e);
          return;
        }
        
        // User clicked a date
        if (selectedDay) {
          // If we're selecting the end date (first click)
          if (selectionState.phase === 'end') {
            setSelectionState({
              phase: 'start',
              endDate: selectedDay
            });
            // Don't call original onSelect yet - we're waiting for start date
            return;
          } 
          
          // We're selecting the start date (second click)
          if (selectionState.phase === 'start' && selectionState.endDate) {
            // Create the final range with correct chronological order
            const startDate = selectedDay;
            const endDate = selectionState.endDate;
            
            let finalRange;
            // Ensure proper chronological order regardless of selection order
            if (startDate <= endDate) {
              finalRange = { from: startDate, to: endDate };
            } else {
              finalRange = { from: endDate, to: startDate };
            }
            
            // Reset for next selection
            setSelectionState({ phase: 'end' });
            
            // Call the original onSelect with our properly ordered range
            originalOnSelect?.(finalRange, selectedDay, activeModifiers, e);
            return;
          }
        }
        
        // Default fallback if the conditions above weren't met
        originalOnSelect?.(range, selectedDay, activeModifiers, e);
      };
      
      // Custom selected value based on our internal state
      if (selectionState.phase === 'start' && selectionState.endDate) {
        baseProps.selected = { to: selectionState.endDate };
      }
    }
    
    return baseProps;
  }, [className, classNames, props, reversedRange, showOutsideDays]);

  return <DayPicker {...dayPickerProps} />;
}

Calendar.displayName = "Calendar";

export { Calendar };
