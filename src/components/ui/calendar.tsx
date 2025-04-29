
import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { 
  DayPicker, 
  DateRange, 
  DayPickerRangeProps,
  DayPickerSingleProps,
  DayPickerDefaultProps
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
    (range: DateRange | undefined, selectedDay: Date | undefined) => {
      // Skip if not in range mode or no reversedRange option
      if (props.mode !== "range" || !reversedRange) {
        // Just forward the selection to the original handler
        if (props.mode === "range" && 'onSelect' in props && typeof props.onSelect === 'function') {
          props.onSelect(range, selectedDay);
        }
        return;
      }

      // If selection is cleared (range is undefined)
      if (!range && !selectedDay) {
        setRangeSelectionState({ phase: "end" });
        if ('onSelect' in props && typeof props.onSelect === 'function') {
          props.onSelect(undefined, undefined);
        }
        return;
      }

      // User clicked a date
      if (selectedDay) {
        // First click - selecting end date
        if (rangeSelectionState.phase === "end") {
          setRangeSelectionState({
            phase: "start",
            selectedEnd: selectedDay,
          });
          return; // Don't call onSelect yet
        }

        // Second click - selecting start date
        if (rangeSelectionState.phase === "start" && rangeSelectionState.selectedEnd) {
          const endDate = rangeSelectionState.selectedEnd;
          const startDate = selectedDay;
          
          // Create proper range (chronological order)
          const finalRange: DateRange = {
            from: startDate <= endDate ? startDate : endDate,
            to: startDate <= endDate ? endDate : startDate,
          };
          
          // Reset state for next selection
          setRangeSelectionState({ phase: "end" });
          
          // Pass final range to original handler
          if ('onSelect' in props && typeof props.onSelect === 'function') {
            props.onSelect(finalRange, selectedDay);
          }
          return;
        }
      }

      // Default fallback
      if ('onSelect' in props && typeof props.onSelect === 'function') {
        props.onSelect(range, selectedDay);
      }
    },
    [props, rangeSelectionState, reversedRange]
  );

  // Create the day picker props based on our state
  const dayPickerProps = React.useMemo(() => {
    // Base props with styling
    const commonProps: Partial<CalendarProps> = {
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
      // Override the onSelect handler with our custom handler
      const rangeProps = {
        ...commonProps,
        onSelect: handleRangeSelect,
      } as DayPickerRangeProps;

      // For the first phase (selecting end date), don't show any selection
      if (rangeSelectionState.phase === "start" && rangeSelectionState.selectedEnd) {
        // Show only the end date selected during the first phase
        rangeProps.selected = { 
          from: undefined,
          to: rangeSelectionState.selectedEnd 
        };
      }

      return rangeProps;
    }

    return commonProps;
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
