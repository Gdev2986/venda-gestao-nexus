
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const RequestsCalendarView = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  
  // Sample events - to be replaced with actual data
  const events = [
    {
      id: "1",
      date: new Date(2025, 4, 20), // May 20, 2025
      title: "Instalação de máquina",
      client: "Supermercado ABC",
      type: "INSTALLATION"
    },
    {
      id: "2",
      date: new Date(2025, 4, 22), // May 22, 2025
      title: "Manutenção preventiva",
      client: "Restaurante XYZ",
      type: "MAINTENANCE"
    },
    {
      id: "3",
      date: new Date(2025, 4, 25), // May 25, 2025
      title: "Substituição de máquina",
      client: "Farmácia Central",
      type: "REPLACEMENT"
    }
  ];
  
  // Function to get events for a specific day
  const getEventsForDay = (day: Date) => {
    return events.filter(event => 
      event.date.getDate() === day.getDate() &&
      event.date.getMonth() === day.getMonth() &&
      event.date.getFullYear() === day.getFullYear()
    );
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Calendário de Atendimentos</h2>
      
      <div className="flex flex-col lg:flex-row gap-6">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border max-w-full w-full lg:w-auto"
          components={{
            Day: ({ day, ...props }) => {
              const eventsForDay = getEventsForDay(day);
              const hasEvents = eventsForDay.length > 0;
              
              return (
                <div {...props}>
                  <div 
                    className={cn(
                      "w-full h-full p-2 flex flex-col justify-center items-center",
                      hasEvents && "relative after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:bg-blue-500 after:rounded-full"
                    )}
                  >
                    {day.day}
                  </div>
                </div>
              );
            }
          }}
        />
        
        <Card className="flex-1">
          <CardContent className="p-4">
            {date && (
              <div>
                <h3 className="font-medium mb-4">
                  Atendimentos para {date.toLocaleDateString('pt-BR')}
                </h3>
                
                {getEventsForDay(date).length > 0 ? (
                  <div className="space-y-3">
                    {getEventsForDay(date).map(event => (
                      <div key={event.id} className="bg-muted p-3 rounded-md">
                        <h4 className="font-medium">{event.title}</h4>
                        <p className="text-sm text-muted-foreground">Cliente: {event.client}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {event.type === "INSTALLATION" && "Instalação"}
                          {event.type === "MAINTENANCE" && "Manutenção"}
                          {event.type === "REPLACEMENT" && "Substituição"}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">Nenhum atendimento agendado para esta data</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RequestsCalendarView;
