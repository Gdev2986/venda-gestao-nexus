
import React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

// Export the Appointment interface so it can be imported elsewhere
export interface Appointment {
  id: number;
  client: string;
  type: string;
  date: string;
  status: string;
}

interface AppointmentsCardProps {
  appointments: Appointment[];
}

const AppointmentsCard: React.FC<AppointmentsCardProps> = ({ appointments }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Próximos Atendimentos</CardTitle>
        <CardDescription>Agenda da semana</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                <span>{format(new Date(), "MMMM yyyy")}</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="center">
              <Calendar
                mode="single"
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <div key={appointment.id} className="bg-muted p-3 rounded-md">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium text-sm">{appointment.client}</h4>
                  <p className="text-xs text-muted-foreground">{appointment.type}</p>
                </div>
                <span className={cn(
                  "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium",
                  appointment.status === "Agendado" ? "bg-blue-50 text-blue-700" :
                  appointment.status === "Confirmado" ? "bg-green-50 text-green-700" :
                  "bg-yellow-50 text-yellow-700"
                )}>
                  {appointment.status}
                </span>
              </div>
              <div className="mt-1 text-xs flex items-center gap-1">
                <CalendarIcon className="h-3 w-3 text-muted-foreground" />
                <span>{format(new Date(appointment.date), "dd/MM/yyyy")}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AppointmentsCard;

