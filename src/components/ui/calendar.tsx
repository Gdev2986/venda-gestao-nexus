
import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { 
  DayPicker, 
  DateRange,
  SelectRangeEventHandler,
  DayPickerRangeProps
} from "react-day-picker";

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
  // Create internal state to handle reversed range selection
  const [rangeSelectionState, setRangeSelectionState] = React.useState<{
    phase: "start" | "end";
    selectedEnd?: Date;
  }>({
    phase: "end", // Start by selecting end date (first click)
  });

  // This wrapper handles the reversed range selection behavior when in range mode
  const handleRangeSelect = React.useCallback(
    (range: DateRange | undefined) => {
      // Skip if not in range mode or no reversedRange option
      if (!reversedRange || props.mode !== "range") {
        return range;
      }

      // If selection is cleared (range is undefined)
      if (!range) {
        setRangeSelectionState({ phase: "end" });
        return undefined;
      }

      // First click - selecting end date
      if (rangeSelectionState.phase === "end" && range.from && !range.to) {
        setRangeSelectionState({
          phase: "start",
          selectedEnd: range.from,
        });
        return { from: undefined, to: range.from };
      }

      // Second click - selecting start date
      if (rangeSelectionState.phase === "start" && rangeSelectionState.selectedEnd && range.from) {
        const endDate = rangeSelectionState.selectedEnd;
        const startDate = range.from;
        
        // Create proper range (chronological order)
        const finalRange: DateRange = {
          from: startDate <= endDate ? startDate : endDate,
          to: startDate <= endDate ? endDate : startDate,
        };
        
        // Reset state for next selection
        setRangeSelectionState({ phase: "end" });
        
        return finalRange;
      }

      // Default fallback
      return range;
    },
    [rangeSelectionState, reversedRange, props.mode]
  );

  // Create the day picker props based on our state
  const dayPickerProps = React.useMemo(() => {
    // Base props with styling
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

    // Handle range mode with reversed selection
    if (props.mode === "range" && reversedRange) {
      // Use type assertion to ensure TypeScript understands the correct props
      const rangeProps = props as unknown as DayPickerRangeProps;
      
      // For the first phase (selecting end date), modify selection display
      if (rangeSelectionState.phase === "start" && rangeSelectionState.selectedEnd) {
        return {
          ...baseProps,
          selected: { 
            from: undefined, 
            to: rangeSelectionState.selectedEnd 
          } as DateRange,
          onSelect: (range?: DateRange) => {
            const modifiedRange = handleRangeSelect(range);
            if (rangeProps.onSelect) {
              rangeProps.onSelect(modifiedRange);
            }
          }
        };
      }
      
      return {
        ...baseProps,
        onSelect: (range?: DateRange) => {
          const modifiedRange = handleRangeSelect(range);
          if (rangeProps.onSelect) {
            rangeProps.onSelect(modifiedRange);
          }
        }
      };
    }

    return baseProps;
  }, [
    className, 
    classNames, 
    handleRangeSelect, 
    props, 
    rangeSelectionState, 
    reversedRange, 
    showOutsideDays
  ]);

  return <DayPicker {...dayPickerProps} />;
}

Calendar.displayName = "Calendar";

export { Calendar };
