import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { PageHeader } from "@/components/page/PageHeader";
import { PageWrapper } from "@/components/page/PageWrapper";
import { useToast } from "@/hooks/use-toast";

const LogisticsCalendar = () => {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(Date.now() + 86400000 * 7), // One week from now
  });
  const { toast } = useToast();

  const handleAddEvent = () => {
    toast({
      title: "Função não implementada",
      description: "Esta funcionalidade ainda será implementada."
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Calendário" 
        description="Planeje a agenda de instalações e visitas"
        actionLabel="Nova Agenda"
        actionOnClick={handleAddEvent}
      />
      
      <PageWrapper>
        <div className="container mx-auto py-6">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[300px] justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <Calendar className="mr-2 h-4 w-4" />
                {date?.from ? (
                  date.to ? (
                    `${format(date.from, "dd/MM/yyyy")} - ${format(date.to, "dd/MM/yyyy")}`
                  ) : (
                    format(date.from, "dd/MM/yyyy")
                  )
                ) : (
                  <span>Escolha um período</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="center">
              <Calendar
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={setDate}
                numberOfMonths={2}
                pagedNavigation
              />
            </PopoverContent>
          </Popover>
        </div>
      </PageWrapper>
    </div>
  );
};

export default LogisticsCalendar;
