
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, Search, Filter, Clock, CheckCircle, AlertTriangle, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type TicketStatus = "open" | "inProgress" | "resolved" | "closed";

interface Ticket {
  id: string;
  subject: string;
  clientName: string;
  clientAvatar?: string;
  department: "financial" | "logistics" | "technical" | "sales";
  status: TicketStatus;
  priority: "low" | "medium" | "high" | "urgent";
  createdAt: string;
  lastUpdated: string;
  messages: number;
}

const tickets: Ticket[] = [
  {
    id: "T-1245",
    subject: "Problema com pagamento não reconhecido",
    clientName: "Mercado Central Ltda.",
    clientAvatar: undefined,
    department: "financial",
    status: "open",
    priority: "high",
    createdAt: "2025-05-01T10:23:00Z",
    lastUpdated: "2025-05-01T10:23:00Z",
    messages: 1,
  },
  {
    id: "T-1244",
    subject: "Máquina com erro de leitura de cartão",
    clientName: "Drogaria Silva",
    clientAvatar: undefined,
    department: "technical",
    status: "inProgress",
    priority: "medium",
    createdAt: "2025-04-30T16:42:00Z",
    lastUpdated: "2025-05-01T09:15:00Z",
    messages: 4,
  },
  {
    id: "T-1243",
    subject: "Solicitação de troca de máquina",
    clientName: "Padaria Nova Era",
    clientAvatar: undefined,
    department: "logistics",
    status: "inProgress",
    priority: "medium",
    createdAt: "2025-04-30T14:18:00Z",
    lastUpdated: "2025-05-01T08:22:00Z",
    messages: 3,
  },
  {
    id: "T-1242",
    subject: "Dúvida sobre comissão de vendas",
    clientName: "João Silva (Parceiro)",
    clientAvatar: undefined,
    department: "financial",
    status: "resolved",
    priority: "low",
    createdAt: "2025-04-29T11:05:00Z",
    lastUpdated: "2025-04-30T14:37:00Z",
    messages: 5,
  },
  {
    id: "T-1241",
    subject: "Divergência nos valores de faturamento",
    clientName: "Auto Peças Santos",
    clientAvatar: undefined,
    department: "sales",
    status: "closed",
    priority: "high",
    createdAt: "2025-04-28T09:47:00Z",
    lastUpdated: "2025-04-30T16:22:00Z",
    messages: 8,
  },
];

const getStatusColor = (status: TicketStatus) => {
  switch (status) {
    case "open": return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
    case "inProgress": return "bg-blue-100 text-blue-800 hover:bg-blue-200";
    case "resolved": return "bg-green-100 text-green-800 hover:bg-green-200";
    case "closed": return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    default: return "";
  }
};

const getStatusIcon = (status: TicketStatus) => {
  switch (status) {
    case "open": return <AlertTriangle className="h-3 w-3 mr-1" />;
    case "inProgress": return <Clock className="h-3 w-3 mr-1" />;
    case "resolved": return <CheckCircle className="h-3 w-3 mr-1" />;
    case "closed": return <X className="h-3 w-3 mr-1" />;
    default: return null;
  }
};

const getPriorityBadge = (priority: string) => {
  switch (priority) {
    case "low": return <Badge variant="outline" className="bg-gray-100">Baixa</Badge>;
    case "medium": return <Badge variant="outline" className="bg-blue-100">Média</Badge>;
    case "high": return <Badge variant="outline" className="bg-orange-100">Alta</Badge>;
    case "urgent": return <Badge variant="outline" className="bg-red-100 text-red-800">Urgente</Badge>;
    default: return null;
  }
};

const SupportAdmin = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  const filteredTickets = tickets.filter(ticket => {
    // Filter by search query
    const matchesSearch = ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          ticket.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          ticket.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by department
    const matchesDepartment = selectedDepartment === "all" || ticket.department === selectedDepartment;
    
    // Filter by status
    const matchesStatus = selectedStatus === "all" || ticket.status === selectedStatus;
    
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Central de Suporte</h1>
        <p className="text-muted-foreground">
          Gerencie todos os tickets de suporte em um só lugar
        </p>
      </div>

      <Separator />

      <div className="flex flex-col md:flex-row gap-4">
        <div className="md:w-2/3">
          <Card>
            <CardHeader>
              <CardTitle>Tickets de Suporte</CardTitle>
              <CardDescription>
                Acompanhe e responda às solicitações dos usuários
              </CardDescription>
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar tickets..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Setor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="financial">Financeiro</SelectItem>
                      <SelectItem value="logistics">Logística</SelectItem>
                      <SelectItem value="technical">Técnico</SelectItem>
                      <SelectItem value="sales">Vendas</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="open">Abertos</SelectItem>
                      <SelectItem value="inProgress">Em andamento</SelectItem>
                      <SelectItem value="resolved">Resolvidos</SelectItem>
                      <SelectItem value="closed">Fechados</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid grid-cols-4 mb-4">
                  <TabsTrigger value="all">Todos</TabsTrigger>
                  <TabsTrigger value="open">Abertos</TabsTrigger>
                  <TabsTrigger value="inProgress">Em Andamento</TabsTrigger>
                  <TabsTrigger value="resolved">Resolvidos</TabsTrigger>
                </TabsList>
                <TabsContent value="all" className="space-y-4">
                  {filteredTickets.length > 0 ? (
                    filteredTickets.map((ticket) => (
                      <div key={ticket.id} className="flex flex-col border rounded-lg p-4 hover:bg-muted/50 cursor-pointer transition-colors">
                        <div className="flex justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={ticket.clientAvatar} alt={ticket.clientName} />
                              <AvatarFallback>{ticket.clientName.substring(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{ticket.subject}</div>
                              <div className="text-sm text-muted-foreground">{ticket.clientName}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {getPriorityBadge(ticket.priority)}
                            <div className={`flex items-center px-2 py-1 rounded text-xs font-medium ${getStatusColor(ticket.status)}`}>
                              {getStatusIcon(ticket.status)}
                              <span>{
                                ticket.status === "open" ? "Aberto" :
                                ticket.status === "inProgress" ? "Em andamento" :
                                ticket.status === "resolved" ? "Resolvido" : "Fechado"
                              }</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-between items-center mt-3 text-xs text-muted-foreground">
                          <div className="flex items-center gap-4">
                            <span>ID: {ticket.id}</span>
                            <span>Setor: {
                              ticket.department === "financial" ? "Financeiro" :
                              ticket.department === "logistics" ? "Logística" :
                              ticket.department === "technical" ? "Técnico" : "Vendas"
                            }</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <span>Criado em: {formatDate(ticket.createdAt)}</span>
                            <div className="flex items-center">
                              <MessageSquare className="h-3 w-3 mr-1" />
                              <span>{ticket.messages}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <div className="rounded-full bg-muted p-3">
                        <Search className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <h3 className="mt-4 text-lg font-semibold">Nenhum ticket encontrado</h3>
                      <p className="mb-4 mt-2 text-sm text-muted-foreground max-w-xs">
                        Não encontramos tickets que correspondam aos seus filtros. Tente ajustar os critérios de busca.
                      </p>
                      <Button variant="outline" onClick={() => {
                        setSearchQuery("");
                        setSelectedDepartment("all");
                        setSelectedStatus("all");
                      }}>
                        Limpar filtros
                      </Button>
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="open">
                  {/* Similar content to "all" tab but filtered for open tickets */}
                  <div className="text-center py-8">
                    Mostrando apenas tickets abertos
                  </div>
                </TabsContent>
                <TabsContent value="inProgress">
                  {/* Content for in progress tickets */}
                  <div className="text-center py-8">
                    Mostrando apenas tickets em andamento
                  </div>
                </TabsContent>
                <TabsContent value="resolved">
                  {/* Content for resolved tickets */}
                  <div className="text-center py-8">
                    Mostrando apenas tickets resolvidos
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:w-1/3">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Estatísticas</CardTitle>
                <CardDescription>Visão geral do suporte</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Tickets Abertos</span>
                    <span className="text-sm font-medium">8</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Tempo Médio de Resposta</span>
                    <span className="text-sm font-medium">2h 15m</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Tempo Médio de Resolução</span>
                    <span className="text-sm font-medium">8h 42m</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Taxa de Resolução</span>
                    <span className="text-sm font-medium">92%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Tickets por Departamento</CardTitle>
                <CardDescription>Distribuição por área</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Financeiro</span>
                      <span className="text-sm font-medium">12 tickets</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted">
                      <div className="h-full rounded-full bg-blue-500" style={{ width: "40%" }} />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Técnico</span>
                      <span className="text-sm font-medium">9 tickets</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted">
                      <div className="h-full rounded-full bg-green-500" style={{ width: "30%" }} />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Logística</span>
                      <span className="text-sm font-medium">6 tickets</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted">
                      <div className="h-full rounded-full bg-yellow-500" style={{ width: "20%" }} />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Vendas</span>
                      <span className="text-sm font-medium">3 tickets</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted">
                      <div className="h-full rounded-full bg-purple-500" style={{ width: "10%" }} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Ações Rápidas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button className="w-full justify-start">
                    <Filter className="mr-2 h-4 w-4" />
                    Filtrar por Atendente
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Criar Novo Ticket
                  </Button>
                  <Button variant="secondary" className="w-full justify-start">
                    <Check className="mr-2 h-4 w-4" />
                    Marcar Todos como Lidos
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportAdmin;
