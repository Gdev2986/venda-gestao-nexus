
import { useState } from "react";
import { PageHeader } from "@/components/page/PageHeader";
import { PageWrapper } from "@/components/page/PageWrapper";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, MapPin, Truck, Calendar, User, Package } from "lucide-react";

// Mock data for calendar events
const mockEvents = [
  {
    id: "event-1",
    title: "Instalação - Café Central",
    date: new Date(2025, 3, 23), // April 23, 2025
    time: "09:30 - 10:30",
    type: "Instalação",
    client: "Café Central",
    address: "Av. Principal, 123 - Centro",
    contact: "Maria Silva (99) 98765-4321",
    notes: "Levar terminal POS Pro com chip 4G"
  },
  {
    id: "event-2",
    title: "Manutenção - Farmácia Saúde",
    date: new Date(2025, 3, 23), // April 23, 2025
    time: "13:00 - 14:00",
    type: "Manutenção",
    client: "Farmácia Saúde",
    address: "Rua das Flores, 456 - Jardim",
    contact: "João Costa (99) 91234-5678",
    notes: "Terminal com problemas de conexão"
  },
  {
    id: "event-3",
    title: "Entrega - Supermercado Bom Preço",
    date: new Date(2025, 3, 24), // April 24, 2025
    time: "10:00 - 11:00",
    type: "Entrega",
    client: "Supermercado Bom Preço",
    address: "Av. das Nações, 789 - Norte",
    contact: "Ana Pereira (99) 95555-1234",
    notes: "Entregar 10 bobinas térmicas"
  },
  {
    id: "event-4",
    title: "Troca - Restaurante Sabor",
    date: new Date(2025, 3, 25), // April 25, 2025
    time: "15:30 - 16:30",
    type: "Troca",
    client: "Restaurante Sabor",
    address: "Rua Gastronômica, 321 - Centro",
    contact: "Pedro Gomes (99) 94444-9876",
    notes: "Trocar terminal antigo por modelo novo"
  },
  {
    id: "event-5",
    title: "Instalação - Loja Fashion",
    date: new Date(2025, 3, 26), // April 26, 2025
    time: "11:00 - 12:00",
    type: "Instalação",
    client: "Loja Fashion",
    address: "Shopping Plaza, Loja 42 - Piso 2",
    contact: "Carla Dias (99) 93333-7777",
    notes: "Primeira instalação, cliente novo"
  }
];

const LogisticsCalendar = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);

  const getEventsForDate = (date: Date) => {
    if (!date) return [];
    
    const dateString = date.toDateString();
    return mockEvents.filter(event => {
      const eventDate = event.date.toDateString();
      const matchesType = typeFilter === 'all' || event.type.toLowerCase() === typeFilter.toLowerCase();
      return eventDate === dateString && matchesType;
    });
  };

  const eventsForSelectedDate = date ? getEventsForDate(date) : [];

  const handleEventClick = (event: any) => {
    setSelectedEvent(event);
    setIsEventDialogOpen(true);
  };

  // Function to get day with events for calendar
  const getDaysWithEvents = (date: Date) => {
    return mockEvents.some(event => 
      event.date.getDate() === date.getDate() &&
      event.date.getMonth() === date.getMonth() &&
      event.date.getFullYear() === date.getFullYear()
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Calendário de Operações"
        description="Visualize e gerencie agendamentos de instalações, manutenções e entregas"
      />
      
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-96">
          <Card>
            <CardHeader>
              <CardTitle>Calendário</CardTitle>
              <CardDescription>
                Selecione uma data para ver os agendamentos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CalendarComponent
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
                modifiers={{
                  hasEvent: (date) => getDaysWithEvents(date),
                }}
                modifiersStyles={{
                  hasEvent: { fontWeight: "bold", backgroundColor: "#f0f7ff", color: "#3b82f6" }
                }}
              />
              
              <div className="mt-4 space-y-2">
                <p className="text-sm font-medium">Filtrar por tipo</p>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os tipos</SelectItem>
                    <SelectItem value="instalação">Instalação</SelectItem>
                    <SelectItem value="manutenção">Manutenção</SelectItem>
                    <SelectItem value="entrega">Entrega</SelectItem>
                    <SelectItem value="troca">Troca</SelectItem>
                  </SelectContent>
                </Select>
                
                <div className="pt-2">
                  <Button className="w-full">
                    <Calendar className="h-4 w-4 mr-2" />
                    Novo Agendamento
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="flex-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>
                {date ? date.toLocaleDateString('pt-BR', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                }) : 'Selecione uma data'}
              </CardTitle>
              <CardDescription>
                {eventsForSelectedDate.length} agendamentos para esta data
              </CardDescription>
            </CardHeader>
            <CardContent>
              {eventsForSelectedDate.length > 0 ? (
                <div className="space-y-4">
                  {eventsForSelectedDate.map((event) => (
                    <div 
                      key={event.id}
                      className="border rounded-md p-4 hover:bg-accent/10 transition-colors cursor-pointer"
                      onClick={() => handleEventClick(event)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center">
                          <div className={`p-2 rounded-full mr-3 ${
                            event.type === "Instalação" ? "bg-green-100 text-green-700" : 
                            event.type === "Manutenção" ? "bg-orange-100 text-orange-700" : 
                            event.type === "Entrega" ? "bg-blue-100 text-blue-700" :
                            "bg-purple-100 text-purple-700"
                          }`}>
                            {event.type === "Instalação" && <Package className="h-4 w-4" />}
                            {event.type === "Manutenção" && <Truck className="h-4 w-4" />}
                            {event.type === "Entrega" && <Package className="h-4 w-4" />}
                            {event.type === "Troca" && <Truck className="h-4 w-4" />}
                          </div>
                          <div>
                            <h3 className="font-medium">{event.title}</h3>
                            <p className="text-sm text-muted-foreground">{event.client}</p>
                          </div>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="h-3 w-3 mr-1" />
                          {event.time}
                        </div>
                      </div>
                      <div className="ml-10 mt-2">
                        <p className="text-sm flex items-center text-muted-foreground">
                          <MapPin className="h-3 w-3 mr-1 inline" />
                          {event.address}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-48">
                  <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Nenhum agendamento para esta data</p>
                  <Button variant="outline" className="mt-4">
                    Criar Agendamento
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Event Details Dialog */}
      {selectedEvent && (
        <Dialog open={isEventDialogOpen} onOpenChange={setIsEventDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Detalhes do Agendamento</DialogTitle>
              <DialogDescription>
                {selectedEvent.date.toLocaleDateString('pt-BR')} • {selectedEvent.time}
              </DialogDescription>
            </DialogHeader>
            
            <Tabs defaultValue="details">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">Detalhes</TabsTrigger>
                <TabsTrigger value="client">Cliente</TabsTrigger>
                <TabsTrigger value="history">Histórico</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="space-y-4 py-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Tipo</h3>
                  <p className="text-base">
                    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                      selectedEvent.type === "Instalação" ? "bg-green-50 text-green-700" : 
                      selectedEvent.type === "Manutenção" ? "bg-orange-50 text-orange-700" : 
                      selectedEvent.type === "Entrega" ? "bg-blue-50 text-blue-700" :
                      "bg-purple-50 text-purple-700"
                    }`}>
                      {selectedEvent.type}
                    </span>
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Data e Hora</h3>
                  <p className="text-base flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    {selectedEvent.date.toLocaleDateString('pt-BR')}
                    <Clock className="h-4 w-4 ml-4 mr-2 text-muted-foreground" />
                    {selectedEvent.time}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Local</h3>
                  <p className="text-base flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                    {selectedEvent.address}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Observações</h3>
                  <p className="text-base border p-2 rounded-md mt-1">
                    {selectedEvent.notes}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                  <p className="text-base">
                    <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-yellow-50 text-yellow-700">
                      Agendado
                    </span>
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="client" className="space-y-4 py-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Cliente</h3>
                  <p className="text-base flex items-center">
                    <User className="h-4 w-4 mr-2 text-muted-foreground" />
                    {selectedEvent.client}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Contato</h3>
                  <p className="text-base">{selectedEvent.contact}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Endereço</h3>
                  <p className="text-base">{selectedEvent.address}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Histórico de Solicitações</h3>
                  <div className="border rounded-md p-2 mt-1 space-y-2">
                    <p className="text-sm">• 15/04/2025 - Manutenção realizada</p>
                    <p className="text-sm">• 10/03/2025 - Troca de bobinas</p>
                    <p className="text-sm">• 22/01/2025 - Instalação inicial</p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="history" className="space-y-4 py-4">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="min-w-8 mt-0.5">
                      <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center">
                        <Calendar className="h-4 w-4 text-blue-600" />
                      </div>
                    </div>
                    <div className="ml-4 flex-1">
                      <p className="text-sm font-medium">Agendamento criado</p>
                      <p className="text-xs text-muted-foreground">20/04/2025 14:30</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Por: Carlos Santos (Suporte)
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="min-w-8 mt-0.5">
                      <div className="h-8 w-8 rounded-full bg-yellow-50 flex items-center justify-center">
                        <Clock className="h-4 w-4 text-yellow-600" />
                      </div>
                    </div>
                    <div className="ml-4 flex-1">
                      <p className="text-sm font-medium">Horário modificado</p>
                      <p className="text-xs text-muted-foreground">21/04/2025 09:15</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        De: 08:30 - 09:30 Para: 09:30 - 10:30
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="min-w-8 mt-0.5">
                      <div className="h-8 w-8 rounded-full bg-green-50 flex items-center justify-center">
                        <Truck className="h-4 w-4 text-green-600" />
                      </div>
                    </div>
                    <div className="ml-4 flex-1">
                      <p className="text-sm font-medium">Técnico atribuído</p>
                      <p className="text-xs text-muted-foreground">22/04/2025 08:00</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Marcos Oliveira (Técnico de Campo)
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            
            <DialogFooter className="flex flex-col sm:flex-row gap-2">
              <Button variant="outline" className="flex-1">
                Reagendar
              </Button>
              <Button variant="destructive" className="flex-1">
                Cancelar
              </Button>
              <Button className="flex-1">
                Confirmar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default LogisticsCalendar;
