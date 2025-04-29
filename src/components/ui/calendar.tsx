
import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker, DayPickerRangeProps } from "react-day-picker";

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
  // Custom range selection behavior
  const [internalRange, setInternalRange] = React.useState<{
    from?: Date;
    to?: Date;
    selecting?: 'start' | 'end';
  }>({
    selecting: reversedRange ? 'end' : 'start'
  });

  // Override the onSelect handler if we're using range mode with reversed selection
  const rangeSelectHandler = React.useCallback((range: { from?: Date, to?: Date } | undefined) => {
    // If there's no range provided, reset the internal state
    if (!range) {
      setInternalRange({ selecting: 'end' });
      if (props.mode === 'range') {
        const rangeProps = props as DayPickerRangeProps;
        if (rangeProps.onSelect) {
          rangeProps.onSelect(undefined);
        }
      }
      return;
    }

    // If we're selecting the end date (first click)
    if (internalRange.selecting === 'end' && range?.from) {
      setInternalRange({
        from: undefined,
        to: range.from,
        selecting: 'start'
      });
      
      // Don't update the actual selection yet, we're waiting for the start date
      return;
    }
    
    // If we're selecting the start date (second click)
    if (internalRange.selecting === 'start' && range?.from) {
      const newRange = {
        from: range.from,
        to: internalRange.to
      };
      
      // If user selected a date after the end date, swap them to maintain proper order
      if (newRange.from && newRange.to && newRange.from > newRange.to) {
        newRange.from = internalRange.to;
        newRange.to = range.from;
      }
      
      // Reset for next selection
      setInternalRange({ selecting: 'end' });
      
      // Now call the original onSelect with our correctly ordered range
      if (props.mode === 'range') {
        const rangeProps = props as DayPickerRangeProps;
        if (rangeProps.onSelect) {
          rangeProps.onSelect(newRange);
        }
      }
      return;
    }
  }, [internalRange, props]);
  
  // We pass the internal range only if we're in reversed selection mode and currently selecting
  const selected = props.mode === 'range' && reversedRange && internalRange.selecting === 'start' && internalRange.to
    ? { from: undefined, to: internalRange.to }
    : props.selected;

  // Extract the proper props based on mode
  const finalProps = {...props};
  if (props.mode === 'range' && reversedRange) {
    (finalProps as DayPickerRangeProps).onSelect = rangeSelectHandler;
  }

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3 pointer-events-auto", className)}
      classNames={{
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
      }}
      components={{
        IconLeft: () => <ChevronLeft className="h-4 w-4" />,
        IconRight: () => <ChevronRight className="h-4 w-4" />,
      }}
      selected={selected}
      {...finalProps}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
