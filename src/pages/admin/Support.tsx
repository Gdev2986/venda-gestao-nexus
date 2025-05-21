
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { PageHeader } from "@/components/page/PageHeader";
import { PageWrapper } from "@/components/page/PageWrapper";
import { Button } from "@/components/ui/button";
import { 
  Card,
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription, 
  CardFooter
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  CalendarIcon,
  ChevronDown, 
  Clock, 
  Filter, 
  Loader2, 
  MoreHorizontal, 
  RefreshCw, 
  Search, 
  SendHorizontal, 
  User, 
  UserPlus 
} from "lucide-react";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { 
  getSupportTickets, 
  getSupportTicketById,
  updateSupportTicket,
  addTicketMessage, 
  getTicketMessages
} from "@/services/support.service";
import { SupportTicket, SupportMessage, UpdateTicketParams } from "@/types/support.types";
import { TicketStatus, TicketPriority, TicketType } from "@/types/enums";

const AdminSupport = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("pending");
  
  // Ticket states
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<SupportTicket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [ticketMessages, setTicketMessages] = useState<SupportMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("");
  const [priorityFilter, setPriorityFilter] = useState<string>("");
  
  // Dialog states
  const [showTicketDialog, setShowTicketDialog] = useState(false);
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [showResolveDialog, setShowResolveDialog] = useState(false);
  
  // Message reply state
  const [messageContent, setMessageContent] = useState("");
  const [isSending, setIsSending] = useState(false);
  
  // Resolution state
  const [resolution, setResolution] = useState("");
  const [isResolutionSubmitting, setIsResolutionSubmitting] = useState(false);
  
  // Staff list for assignments
  const [staffList, setStaffList] = useState<{id: string, name: string}[]>([]);
  const [selectedStaffId, setSelectedStaffId] = useState<string>("");
  const [isAssigning, setIsAssigning] = useState(false);
  
  // Load staff list
  useEffect(() => {
    const fetchStaffList = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, name')
          .in('role', ['ADMIN', 'SUPPORT']);
        
        if (error) {
          throw error;
        }
        
        if (data) {
          setStaffList(data);
        }
      } catch (error: any) {
        console.error("Error loading staff list:", error.message);
      }
    };
    
    fetchStaffList();
  }, []);
  
  // Initial load of tickets
  useEffect(() => {
    fetchTickets();
  }, []);
  
  // Filtering effect
  useEffect(() => {
    applyFilters();
  }, [tickets, searchQuery, typeFilter, priorityFilter, activeTab]);
  
  // Fetch tickets
  const fetchTickets = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await getSupportTickets();
      
      if (error) {
        throw error;
      }
      
      if (data) {
        setTickets(data);
      }
    } catch (error: any) {
      toast({
        title: "Erro ao carregar chamados",
        description: error.message || "Ocorreu um erro ao carregar os chamados",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Apply filters
  const applyFilters = () => {
    let result = [...tickets];
    
    // Filter by tab status
    if (activeTab === "pending") {
      result = result.filter(ticket => 
        ticket.status === TicketStatus.OPEN || 
        ticket.status === TicketStatus.PENDING
      );
    } else if (activeTab === "inProgress") {
      result = result.filter(ticket => 
        ticket.status === TicketStatus.IN_PROGRESS
      );
    } else if (activeTab === "resolved") {
      result = result.filter(ticket => 
        ticket.status === TicketStatus.RESOLVED ||
        ticket.status === TicketStatus.COMPLETED
      );
    } else if (activeTab === "closed") {
      result = result.filter(ticket => 
        ticket.status === TicketStatus.CLOSED || 
        ticket.status === TicketStatus.CANCELED
      );
    }
    
    // Apply type filter
    if (typeFilter) {
      result = result.filter(ticket => ticket.type === typeFilter);
    }
    
    // Apply priority filter
    if (priorityFilter) {
      result = result.filter(ticket => ticket.priority === priorityFilter);
    }
    
    // Apply search query
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      result = result.filter(ticket => 
        ticket.title.toLowerCase().includes(query) || 
        ticket.description.toLowerCase().includes(query) ||
        (ticket.client?.business_name && ticket.client.business_name.toLowerCase().includes(query))
      );
    }
    
    setFilteredTickets(result);
  };
  
  // View ticket details
  const handleViewTicket = async (ticketId: string) => {
    try {
      const { data, error } = await getSupportTicketById(ticketId);
      
      if (error) {
        throw error;
      }
      
      if (data) {
        setSelectedTicket(data);
        
        // Fetch messages for this ticket
        const messagesRes = await getTicketMessages(ticketId);
        if (messagesRes.data) {
          setTicketMessages(messagesRes.data);
        }
        
        setShowTicketDialog(true);
      }
    } catch (error: any) {
      toast({
        title: "Erro ao carregar detalhes do chamado",
        description: error.message || "Ocorreu um erro ao carregar os detalhes do chamado",
        variant: "destructive",
      });
    }
  };
  
  // Send a reply
  const handleSendReply = async () => {
    if (!messageContent.trim() || !selectedTicket || !user) {
      return;
    }
    
    setIsSending(true);
    
    try {
      const { error } = await addTicketMessage(
        selectedTicket.id, 
        user.id,
        messageContent
      );
      
      if (error) {
        throw error;
      }
      
      // Update ticket to IN_PROGRESS if it's still OPEN or PENDING
      if (selectedTicket.status === TicketStatus.OPEN || 
          selectedTicket.status === TicketStatus.PENDING) {
        await updateTicketStatus(selectedTicket.id, TicketStatus.IN_PROGRESS);
      }
      
      setMessageContent("");
      
      // Refresh messages
      const { data } = await getTicketMessages(selectedTicket.id);
      if (data) {
        setTicketMessages(data);
      }
      
      toast({
        title: "Mensagem enviada",
        description: "Sua resposta foi enviada com sucesso",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao enviar mensagem",
        description: error.message || "Ocorreu um erro ao enviar sua mensagem",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };
  
  // Update ticket status
  const updateTicketStatus = async (ticketId: string, status: TicketStatus) => {
    try {
      const { error } = await updateSupportTicket(ticketId, { status });
      
      if (error) {
        throw error;
      }
      
      // Update local state
      setTickets(tickets.map(ticket => 
        ticket.id === ticketId ? { ...ticket, status } : ticket
      ));
      
      if (selectedTicket && selectedTicket.id === ticketId) {
        setSelectedTicket({ ...selectedTicket, status });
      }
      
      toast({
        title: "Status atualizado",
        description: `Status do chamado atualizado para ${status}`,
      });
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar status",
        description: error.message || "Ocorreu um erro ao atualizar o status do chamado",
        variant: "destructive",
      });
    }
  };
  
  // Handle ticket assignment
  const handleAssignTicket = async () => {
    if (!selectedTicket || !selectedStaffId) {
      return;
    }
    
    setIsAssigning(true);
    
    try {
      const updates: UpdateTicketParams = {
        assigned_to: selectedStaffId
      };
      
      // Update to IN_PROGRESS if not already
      if (selectedTicket.status === TicketStatus.OPEN || 
          selectedTicket.status === TicketStatus.PENDING) {
        updates.status = TicketStatus.IN_PROGRESS;
      }
      
      const { error } = await updateSupportTicket(selectedTicket.id, updates);
      
      if (error) {
        throw error;
      }
      
      // Update local state
      const updatedTicket = {
        ...selectedTicket,
        assigned_to: selectedStaffId,
        status: updates.status || selectedTicket.status
      };
      
      setSelectedTicket(updatedTicket);
      
      setTickets(tickets.map(ticket => 
        ticket.id === selectedTicket.id ? updatedTicket : ticket
      ));
      
      setShowAssignDialog(false);
      
      toast({
        title: "Chamado atribuído",
        description: "O chamado foi atribuído com sucesso",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao atribuir chamado",
        description: error.message || "Ocorreu um erro ao atribuir o chamado",
        variant: "destructive",
      });
    } finally {
      setIsAssigning(false);
    }
  };
  
  // Handle resolving ticket
  const handleResolveTicket = async () => {
    if (!selectedTicket) {
      return;
    }
    
    setIsResolutionSubmitting(true);
    
    try {
      const { error } = await updateSupportTicket(selectedTicket.id, {
        status: TicketStatus.RESOLVED,
        resolution: resolution
      });
      
      if (error) {
        throw error;
      }
      
      // Update local state
      const updatedTicket = {
        ...selectedTicket,
        status: TicketStatus.RESOLVED,
        resolution: resolution
      };
      
      setSelectedTicket(updatedTicket);
      
      setTickets(tickets.map(ticket => 
        ticket.id === selectedTicket.id ? updatedTicket : ticket
      ));
      
      setShowResolveDialog(false);
      setResolution("");
      
      toast({
        title: "Chamado resolvido",
        description: "O chamado foi marcado como resolvido com sucesso",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao resolver chamado",
        description: error.message || "Ocorreu um erro ao resolver o chamado",
        variant: "destructive",
      });
    } finally {
      setIsResolutionSubmitting(false);
    }
  };
  
  // Format status badge
  const getStatusBadge = (status: TicketStatus) => {
    let className = "";
    let label = "";
    
    switch (status) {
      case TicketStatus.OPEN:
      case TicketStatus.PENDING:
        className = "bg-yellow-100 text-yellow-800";
        label = "Pendente";
        break;
      case TicketStatus.IN_PROGRESS:
        className = "bg-blue-100 text-blue-800";
        label = "Em Andamento";
        break;
      case TicketStatus.RESOLVED:
        className = "bg-green-100 text-green-800";
        label = "Resolvido";
        break;
      case TicketStatus.COMPLETED:
        className = "bg-green-100 text-green-800";
        label = "Concluído";
        break;
      case TicketStatus.CLOSED:
        className = "bg-gray-100 text-gray-800";
        label = "Fechado";
        break;
      case TicketStatus.CANCELED:
        className = "bg-gray-100 text-gray-800";
        label = "Cancelado";
        break;
      default:
        className = "bg-gray-100 text-gray-800";
        label = status;
    }
    
    return (
      <Badge variant="outline" className={className}>
        {label}
      </Badge>
    );
  };
  
  // Format priority badge
  const getPriorityBadge = (priority: TicketPriority) => {
    let className = "";
    
    switch (priority) {
      case TicketPriority.LOW:
        className = "bg-blue-100 text-blue-800";
        break;
      case TicketPriority.MEDIUM:
        className = "bg-yellow-100 text-yellow-800";
        break;
      case TicketPriority.HIGH:
        className = "bg-orange-100 text-orange-800";
        break;
      case TicketPriority.CRITICAL:
      case TicketPriority.URGENT:
        className = "bg-red-100 text-red-800";
        break;
      default:
        className = "bg-gray-100 text-gray-800";
    }
    
    return (
      <Badge variant="outline" className={className}>
        {priority}
      </Badge>
    );
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: pt });
    } catch {
      return "Data inválida";
    }
  };
  
  // Get counts for tickets by status
  const getPendingCount = () => {
    return tickets.filter(t => 
      t.status === TicketStatus.OPEN || t.status === TicketStatus.PENDING
    ).length;
  };
  
  const getInProgressCount = () => {
    return tickets.filter(t => t.status === TicketStatus.IN_PROGRESS).length;
  };
  
  const getResolvedCount = () => {
    return tickets.filter(t => 
      t.status === TicketStatus.RESOLVED || t.status === TicketStatus.COMPLETED
    ).length;
  };
  
  const getClosedCount = () => {
    return tickets.filter(t => 
      t.status === TicketStatus.CLOSED || t.status === TicketStatus.CANCELED
    ).length;
  };
  
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Central de Suporte" 
        description="Gerencie os chamados de suporte dos clientes"
      />
      
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Buscar chamados..." 
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[150px]">
              <span className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                {typeFilter || "Tipo"}
              </span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos os tipos</SelectItem>
              <SelectItem value={TicketType.TECHNICAL}>Técnico</SelectItem>
              <SelectItem value={TicketType.BILLING}>Cobrança</SelectItem>
              <SelectItem value={TicketType.MACHINE}>Máquina</SelectItem>
              <SelectItem value={TicketType.MAINTENANCE}>Manutenção</SelectItem>
              <SelectItem value={TicketType.INSTALLATION}>Instalação</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-[150px]">
              <span className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {priorityFilter || "Prioridade"}
              </span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todas</SelectItem>
              <SelectItem value={TicketPriority.LOW}>Baixa</SelectItem>
              <SelectItem value={TicketPriority.MEDIUM}>Média</SelectItem>
              <SelectItem value={TicketPriority.HIGH}>Alta</SelectItem>
              <SelectItem value={TicketPriority.CRITICAL}>Crítica</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" onClick={() => {
            setSearchQuery("");
            setTypeFilter("");
            setPriorityFilter("");
          }}>
            Limpar filtros
          </Button>
          
          <Button onClick={fetchTickets}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="pending">
            Pendentes ({getPendingCount()})
          </TabsTrigger>
          <TabsTrigger value="inProgress">
            Em Andamento ({getInProgressCount()})
          </TabsTrigger>
          <TabsTrigger value="resolved">
            Resolvidos ({getResolvedCount()})
          </TabsTrigger>
          <TabsTrigger value="closed">
            Fechados ({getClosedCount()})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab}>
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">ID</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Assunto</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Prioridade</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-10">
                        <Loader2 className="animate-spin h-6 w-6 mx-auto" />
                        <p className="mt-2">Carregando chamados...</p>
                      </TableCell>
                    </TableRow>
                  ) : filteredTickets.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-10">
                        <p className="text-muted-foreground">
                          Nenhum chamado encontrado com os filtros aplicados.
                        </p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredTickets.map((ticket) => (
                      <TableRow key={ticket.id}>
                        <TableCell>#{ticket.id.substring(0, 8)}</TableCell>
                        <TableCell>
                          {ticket.client?.business_name || "Cliente não encontrado"}
                        </TableCell>
                        <TableCell>{ticket.title}</TableCell>
                        <TableCell>{ticket.type}</TableCell>
                        <TableCell>{getPriorityBadge(ticket.priority)}</TableCell>
                        <TableCell>{formatDate(ticket.created_at)}</TableCell>
                        <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => handleViewTicket(ticket.id)}
                              >
                                Detalhes
                              </DropdownMenuItem>
                              {(ticket.status === TicketStatus.OPEN || 
                                ticket.status === TicketStatus.PENDING || 
                                ticket.status === TicketStatus.IN_PROGRESS) && (
                                <>
                                  <DropdownMenuItem
                                    onClick={() => {
                                      setSelectedTicket(ticket);
                                      setShowAssignDialog(true);
                                    }}
                                  >
                                    Atribuir
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => {
                                      setSelectedTicket(ticket);
                                      setShowResolveDialog(true);
                                    }}
                                  >
                                    Resolver
                                  </DropdownMenuItem>
                                </>
                              )}
                              {ticket.status === TicketStatus.RESOLVED && (
                                <DropdownMenuItem
                                  onClick={() => updateTicketStatus(ticket.id, TicketStatus.CLOSED)}
                                >
                                  Fechar chamado
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex justify-between border-t p-4">
              <div className="text-sm text-muted-foreground">
                Total: {filteredTickets.length} chamados
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Ticket Details Dialog */}
      <Dialog open={showTicketDialog} onOpenChange={setShowTicketDialog}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedTicket && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <DialogTitle className="text-xl">
                    #{selectedTicket.id.substring(0, 8)} - {selectedTicket.title}
                  </DialogTitle>
                  {getStatusBadge(selectedTicket.status)}
                </div>
              </DialogHeader>
              
              <div className="space-y-6 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Informações do Cliente</h4>
                    <Card>
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <div>
                            <span className="text-muted-foreground text-sm">Empresa:</span>
                            <p className="font-medium">{selectedTicket.client?.business_name}</p>
                          </div>
                          {selectedTicket.client?.contact_name && (
                            <div>
                              <span className="text-muted-foreground text-sm">Contato:</span>
                              <p>{selectedTicket.client.contact_name}</p>
                            </div>
                          )}
                          {selectedTicket.client?.phone && (
                            <div>
                              <span className="text-muted-foreground text-sm">Telefone:</span>
                              <p>{selectedTicket.client.phone}</p>
                            </div>
                          )}
                          {selectedTicket.client?.address && (
                            <div>
                              <span className="text-muted-foreground text-sm">Endereço:</span>
                              <p>
                                {selectedTicket.client.address}, {selectedTicket.client.city} - {selectedTicket.client.state}
                              </p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Detalhes do Chamado</h4>
                    <Card>
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <div>
                            <span className="text-muted-foreground text-sm">Data de Criação:</span>
                            <p>{formatDate(selectedTicket.created_at)}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground text-sm">Tipo:</span>
                            <p>{selectedTicket.type}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground text-sm">Prioridade:</span>
                            <p>{selectedTicket.priority}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground text-sm">Status:</span>
                            <p>{selectedTicket.status}</p>
                          </div>
                          {selectedTicket.scheduled_date && (
                            <div>
                              <span className="text-muted-foreground text-sm">Data Agendada:</span>
                              <p>{formatDate(selectedTicket.scheduled_date)}</p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Descrição</h4>
                  <div className="rounded-md border bg-muted/40 p-4">
                    <p className="whitespace-pre-wrap">{selectedTicket.description}</p>
                  </div>
                </div>
                
                {selectedTicket.machine && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Máquina</h4>
                    <div className="rounded-md border bg-muted/40 p-4">
                      <p>
                        {selectedTicket.machine.serial_number} - {selectedTicket.machine.model}
                      </p>
                    </div>
                  </div>
                )}
                
                {selectedTicket.resolution && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Resolução</h4>
                    <div className="rounded-md border bg-muted/40 p-4">
                      <p className="whitespace-pre-wrap">{selectedTicket.resolution}</p>
                    </div>
                  </div>
                )}
                
                {/* Messages Section */}
                <div className="mt-8">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-medium">Conversas</h4>
                    <div className="flex items-center gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          setSelectedStaffId("");
                          setShowAssignDialog(true);
                        }}
                      >
                        <UserPlus className="h-4 w-4 mr-2" />
                        Atribuir
                      </Button>
                      
                      {(selectedTicket.status === TicketStatus.OPEN || 
                        selectedTicket.status === TicketStatus.PENDING || 
                        selectedTicket.status === TicketStatus.IN_PROGRESS) && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            setResolution("");
                            setShowResolveDialog(true);
                          }}
                        >
                          Resolver
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-4 max-h-[400px] overflow-y-auto p-2">
                    {ticketMessages.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">
                        Nenhuma mensagem encontrada para este chamado.
                      </p>
                    ) : (
                      ticketMessages.map((msg) => (
                        <div 
                          key={msg.id} 
                          className={`flex ${msg.user?.id === user?.id ? 'justify-end' : 'justify-start'}`}
                        >
                          <div 
                            className={`rounded-lg p-4 max-w-[80%] ${
                              msg.user?.id === user?.id 
                                ? 'bg-primary text-primary-foreground' 
                                : 'bg-muted'
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-xs">
                                {msg.user?.name || "Usuário"}
                                {msg.user?.role && ` (${msg.user.role})`}
                              </span>
                              <span className="text-xs opacity-70">
                                {formatDate(msg.created_at)}
                              </span>
                            </div>
                            <p className="whitespace-pre-wrap">{msg.message}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  
                  {/* Reply input */}
                  {selectedTicket.status !== TicketStatus.CLOSED && 
                   selectedTicket.status !== TicketStatus.COMPLETED && 
                   selectedTicket.status !== TicketStatus.CANCELED && (
                    <div className="mt-6">
                      <div className="flex gap-2">
                        <Textarea
                          value={messageContent}
                          onChange={(e) => setMessageContent(e.target.value)}
                          placeholder="Digite sua mensagem..."
                          className="flex-1"
                          rows={3}
                        />
                        <Button 
                          className="self-end"
                          onClick={handleSendReply}
                          disabled={!messageContent.trim() || isSending}
                        >
                          {isSending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <SendHorizontal className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Assign Ticket Dialog */}
      <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Atribuir Chamado</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <p className="text-sm">
              Selecione um responsável para o chamado #{selectedTicket?.id.substring(0, 8)}
            </p>
            
            <Select 
              value={selectedStaffId} 
              onValueChange={setSelectedStaffId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um responsável" />
              </SelectTrigger>
              <SelectContent>
                {staffList.map(staff => (
                  <SelectItem key={staff.id} value={staff.id}>
                    {staff.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowAssignDialog(false)}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleAssignTicket}
              disabled={!selectedStaffId || isAssigning}
            >
              {isAssigning ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Atribuindo...
                </>
              ) : (
                "Atribuir"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Resolve Ticket Dialog */}
      <Dialog open={showResolveDialog} onOpenChange={setShowResolveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Resolver Chamado</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <p className="text-sm">
              Digite a resolução para o chamado #{selectedTicket?.id.substring(0, 8)}
            </p>
            
            <Textarea
              value={resolution}
              onChange={(e) => setResolution(e.target.value)}
              placeholder="Descreva como o problema foi resolvido..."
              rows={5}
            />
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowResolveDialog(false)}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleResolveTicket}
              disabled={!resolution.trim() || isResolutionSubmitting}
            >
              {isResolutionSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Resolvendo...
                </>
              ) : (
                "Marcar como Resolvido"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminSupport;
