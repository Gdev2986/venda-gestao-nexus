
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/page/PageHeader";
import { PageWrapper } from "@/components/page/PageWrapper";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { CalendarX2, Filter, List, CalendarDays } from "lucide-react";

const Calendar = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [view, setView] = useState<"calendar" | "list">("calendar");
  const [filterType, setFilterType] = useState("all");
  const [filterClient, setFilterClient] = useState("all");

  // Mock calendar events
  const events = [
    {
      id: "evt1",
      title: "Entrega de terminal",
      date: new Date(2025, 4, 8),
      type: "delivery",
      client: "Empresa ABC Ltda",
      address: "Av. Paulista, 1000 - São Paulo, SP"
    },
    {
      id: "evt2",
      title: "Manutenção preventiva",
      date: new Date(2025, 4, 10),
      type: "maintenance",
      client: "Comércio XYZ",
      address: "Rua Augusta, 500 - São Paulo, SP"
    },
    {
      id: "evt3",
      title: "Transferência de máquina",
      date: new Date(2025, 4, 12),
      type: "transfer",
      client: "Restaurante Sabor",
      address: "Alameda Santos, 800 - São Paulo, SP"
    },
    {
      id: "evt4",
      title: "Entrega de bobinas",
      date: new Date(2025, 4, 15),
      type: "supplies",
      client: "Farmácia Saúde",
      address: "Rua Oscar Freire, 200 - São Paulo, SP"
    }
  ];

  // Get events for selected date (in calendar view)
  const selectedDateEvents = date 
    ? events.filter(evt => 
        evt.date.getDate() === date.getDate() && 
        evt.date.getMonth() === date.getMonth() && 
        evt.date.getFullYear() === date.getFullYear()
      )
    : [];

  // Get all events filtered by type and client (in list view)
  const filteredEvents = events.filter(evt => {
    const matchesType = filterType === "all" || evt.type === filterType;
    const matchesClient = filterClient === "all" || evt.client === filterClient;
    return matchesType && matchesClient;
  });

  // Helper to get event type badge
  const getEventTypeBadge = (type: string) => {
    switch (type) {
      case "delivery":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Entrega</Badge>;
      case "maintenance":
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Manutenção</Badge>;
      case "transfer":
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">Transferência</Badge>;
      case "supplies":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Suprimentos</Badge>;
      default:
        return <Badge variant="outline">Outro</Badge>;
    }
  };

  // Array of dates that have events (for calendar highlighting)
  const eventDates = events.map(evt => evt.date);

  return (
    <>
      <PageHeader 
        title="Calendário" 
        description="Visualize e gerencie os agendamentos logísticos"
        actionLabel="Novo Agendamento"
        onActionClick={() => alert("Funcionalidade em desenvolvimento")}
      />
      
      <PageWrapper>
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-1/3">
            <Card className="mb-6">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle>Visualização</CardTitle>
                  <div className="flex space-x-2">
                    <Button 
                      variant={view === "calendar" ? "default" : "outline"} 
                      size="icon" 
                      onClick={() => setView("calendar")}
                    >
                      <CalendarDays className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant={view === "list" ? "default" : "outline"} 
                      size="icon" 
                      onClick={() => setView("list")}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {view === "calendar" ? (
                  <CalendarComponent
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md border"
                    modifiers={{
                      hasEvent: (date) => 
                        eventDates.some(eventDate => 
                          eventDate.getDate() === date.getDate() &&
                          eventDate.getMonth() === date.getMonth() &&
                          eventDate.getFullYear() === date.getFullYear()
                        )
                    }}
                    modifiersStyles={{
                      hasEvent: { 
                        fontWeight: 'bold',
                        textDecoration: 'underline',
                        color: 'var(--primary)' 
                      }
                    }}
                  />
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Select defaultValue={filterType} onValueChange={setFilterType}>
                          <SelectTrigger>
                            <SelectValue placeholder="Tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Todos os tipos</SelectItem>
                            <SelectItem value="delivery">Entregas</SelectItem>
                            <SelectItem value="maintenance">Manutenções</SelectItem>
                            <SelectItem value="transfer">Transferências</SelectItem>
                            <SelectItem value="supplies">Suprimentos</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Select defaultValue={filterClient} onValueChange={setFilterClient}>
                          <SelectTrigger>
                            <SelectValue placeholder="Cliente" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Todos os clientes</SelectItem>
                            <SelectItem value="Empresa ABC Ltda">Empresa ABC</SelectItem>
                            <SelectItem value="Comércio XYZ">Comércio XYZ</SelectItem>
                            <SelectItem value="Restaurante Sabor">Restaurante Sabor</SelectItem>
                            <SelectItem value="Farmácia Saúde">Farmácia Saúde</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div className="w-full lg:w-2/3">
            <Card>
              <CardHeader>
                <CardTitle>
                  {view === "calendar" 
                    ? `Agendamentos: ${date?.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })}`
                    : "Lista de Agendamentos"
                  }
                </CardTitle>
              </CardHeader>
              <CardContent>
                {view === "calendar" ? (
                  selectedDateEvents.length > 0 ? (
                    <div className="space-y-4">
                      {selectedDateEvents.map(event => (
                        <div key={event.id} className="border rounded-md p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-medium">{event.title}</h3>
                            {getEventTypeBadge(event.type)}
                          </div>
                          <p className="text-sm mb-1">Cliente: {event.client}</p>
                          <p className="text-sm text-muted-foreground">{event.address}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <CalendarX2 className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
                      <h3 className="text-lg font-medium mb-1">Nenhum agendamento</h3>
                      <p className="text-sm text-muted-foreground">Não há agendamentos para esta data</p>
                    </div>
                  )
                ) : (
                  filteredEvents.length > 0 ? (
                    <div className="space-y-4">
                      {filteredEvents.map(event => (
                        <div key={event.id} className="border rounded-md p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-medium">{event.title}</h3>
                            {getEventTypeBadge(event.type)}
                          </div>
                          <p className="text-sm mb-1">
                            Data: {event.date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                          </p>
                          <p className="text-sm mb-1">Cliente: {event.client}</p>
                          <p className="text-sm text-muted-foreground">{event.address}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Filter className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
                      <h3 className="text-lg font-medium mb-1">Nenhum resultado</h3>
                      <p className="text-sm text-muted-foreground">Tente ajustar os filtros</p>
                    </div>
                  )
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </PageWrapper>
    </>
  );
};

export default Calendar;
