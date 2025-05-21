
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { PageHeader } from "@/components/page/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Loader2, MessageCircle, Plus, RefreshCw, SendHorizontal } from "lucide-react";
import { 
  getSupportTickets, 
  getSupportTicketById,
  createSupportTicket, 
  addTicketMessage,
  getTicketMessages
} from "@/services/support.service";
import { SupportTicket, SupportMessage } from "@/types/support.types";
import { TicketType, TicketPriority, TicketStatus } from "@/types/enums";

const UserSupport = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  
  // States for tickets
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [ticketMessages, setTicketMessages] = useState<SupportMessage[]>([]);
  
  // States for dialogs
  const [showTicketDialog, setShowTicketDialog] = useState(false);
  const [showNewTicketDialog, setShowNewTicketDialog] = useState(false);
  
  // States for new ticket form
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [selectedType, setSelectedType] = useState<TicketType>(TicketType.TECHNICAL);
  const [selectedPriority, setSelectedPriority] = useState<TicketPriority>(TicketPriority.MEDIUM);
  const [selectedMachine, setSelectedMachine] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // States for reply
  const [reply, setReply] = useState("");
  const [isSending, setIsSending] = useState(false);
  
  // User client info
  const [clientId, setClientId] = useState<string>("");
  const [machines, setMachines] = useState<any[]>([]);
  
  // Fetch client ID for the current user
  useEffect(() => {
    if (user) {
      const fetchClientId = async () => {
        try {
          const { data, error } = await supabase
            .from("user_client_access")
            .select("client_id")
            .eq("user_id", user.id)
            .single();
            
          if (data) {
            setClientId(data.client_id);
            fetchMachines(data.client_id);
          } else if (error) {
            console.error("Error fetching client ID:", error);
          }
        } catch (error) {
          console.error("Unexpected error:", error);
        }
      };
      
      fetchClientId();
    }
  }, [user]);
  
  // Fetch client machines
  const fetchMachines = async (clientId: string) => {
    try {
      const { data, error } = await supabase
        .from("machines")
        .select("id, serial_number, model")
        .eq("client_id", clientId);
        
      if (data) {
        setMachines(data);
      } else if (error) {
        console.error("Error fetching machines:", error);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  };
  
  // Fetch tickets
  const fetchTickets = async () => {
    setIsLoading(true);
    try {
      if (!clientId) return;
      
      const { data, error } = await getSupportTickets({
        client_id: clientId
      });
      
      if (error) {
        toast({
          title: "Erro ao carregar chamados",
          description: error.message,
          variant: "destructive",
        });
      } else if (data) {
        setTickets(data);
      }
    } catch (error: any) {
      toast({
        title: "Erro inesperado",
        description: error.message || "Ocorreu um erro ao carregar os chamados",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fetch ticket details
  const fetchTicketDetails = async (ticketId: string) => {
    try {
      const { data, error } = await getSupportTicketById(ticketId);
      
      if (error) {
        toast({
          title: "Erro ao carregar detalhes do chamado",
          description: error.message,
          variant: "destructive",
        });
      } else if (data) {
        setSelectedTicket(data);
        
        // Also fetch messages for this ticket
        const messagesResult = await getTicketMessages(ticketId);
        if (messagesResult.data) {
          setTicketMessages(messagesResult.data);
        }
      }
    } catch (error: any) {
      toast({
        title: "Erro inesperado",
        description: error.message || "Ocorreu um erro ao carregar os detalhes do chamado",
        variant: "destructive",
      });
    }
  };
  
  // Load tickets when client ID is available
  useEffect(() => {
    if (clientId) {
      fetchTickets();
    }
  }, [clientId]);
  
  // Create new ticket
  const handleCreateTicket = async () => {
    if (!subject || !description || !selectedType || !clientId) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { data, error } = await createSupportTicket({
        title: subject,
        description,
        client_id: clientId,
        machine_id: selectedMachine || undefined,
        type: selectedType,
        priority: selectedPriority,
        user_id: user?.id
      });
      
      if (error) {
        throw error;
      }
      
      setShowNewTicketDialog(false);
      resetNewTicketForm();
      fetchTickets();
      
      toast({
        title: "Chamado enviado",
        description: "Seu chamado foi enviado com sucesso!",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao criar chamado",
        description: error.message || "Ocorreu um erro ao enviar seu chamado. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Send reply to ticket
  const handleSendReply = async () => {
    if (!reply.trim() || !selectedTicket || !user) {
      return;
    }
    
    setIsSending(true);
    
    try {
      const { error } = await addTicketMessage(selectedTicket.id, user.id, reply);
      
      if (error) {
        throw error;
      }
      
      setReply("");
      
      // Refresh messages
      const messagesResult = await getTicketMessages(selectedTicket.id);
      if (messagesResult.data) {
        setTicketMessages(messagesResult.data);
      }
      
      toast({
        title: "Mensagem enviada",
        description: "Sua mensagem foi enviada com sucesso!",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao enviar mensagem",
        description: error.message || "Ocorreu um erro ao enviar sua mensagem. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };
  
  // Reset new ticket form
  const resetNewTicketForm = () => {
    setSubject("");
    setDescription("");
    setSelectedType(TicketType.TECHNICAL);
    setSelectedPriority(TicketPriority.MEDIUM);
    setSelectedMachine("");
  };
  
  // View ticket details
  const handleViewTicket = async (ticketId: string) => {
    await fetchTicketDetails(ticketId);
    setShowTicketDialog(true);
  };
  
  // Filter tickets
  const openTickets = tickets.filter(ticket => 
    ticket.status !== TicketStatus.CLOSED && 
    ticket.status !== TicketStatus.COMPLETED &&
    ticket.status !== TicketStatus.CANCELED
  );
  
  const closedTickets = tickets.filter(ticket => 
    ticket.status === TicketStatus.CLOSED || 
    ticket.status === TicketStatus.COMPLETED ||
    ticket.status === TicketStatus.CANCELED
  );
  
  // Format ticket status display
  const getStatusBadge = (status: TicketStatus) => {
    let bgColor = "";
    let textColor = "";
    let label = "";
    
    switch (status) {
      case TicketStatus.OPEN:
      case TicketStatus.PENDING:
        bgColor = "bg-yellow-100";
        textColor = "text-yellow-800";
        label = "Pendente";
        break;
      case TicketStatus.IN_PROGRESS:
        bgColor = "bg-blue-100";
        textColor = "text-blue-800";
        label = "Em análise";
        break;
      case TicketStatus.RESOLVED:
      case TicketStatus.COMPLETED:
        bgColor = "bg-green-100";
        textColor = "text-green-800";
        label = "Concluído";
        break;
      case TicketStatus.CLOSED:
        bgColor = "bg-gray-100";
        textColor = "text-gray-800";
        label = "Fechado";
        break;
      case TicketStatus.CANCELED:
        bgColor = "bg-gray-100";
        textColor = "text-gray-800";
        label = "Cancelado";
        break;
      default:
        bgColor = "bg-gray-100";
        textColor = "text-gray-800";
        label = status || "Desconhecido";
    }
    
    return (
      <Badge variant="outline" className={`${bgColor} ${textColor}`}>
        {label}
      </Badge>
    );
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm');
    } catch {
      return "Data inválida";
    }
  };
  
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Central de Suporte" 
        description="Abra e acompanhe chamados de suporte e assistência"
      />
      
      <div className="flex justify-end">
        <Button onClick={() => setShowNewTicketDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Chamado
        </Button>
      </div>
      
      <Tabs defaultValue="active">
        <TabsList className="mb-6">
          <TabsTrigger value="active">Chamados Ativos</TabsTrigger>
          <TabsTrigger value="closed">Chamados Encerrados</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Chamados em Andamento</CardTitle>
              <Button variant="outline" size="sm" onClick={fetchTickets}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Atualizar
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nº</TableHead>
                    <TableHead>Assunto</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-10">
                        <Loader2 className="animate-spin h-6 w-6 mx-auto" />
                        <p className="mt-2">Carregando chamados...</p>
                      </TableCell>
                    </TableRow>
                  ) : openTickets.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-10">
                        <p className="text-muted-foreground">
                          Nenhum chamado ativo encontrado.
                        </p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    openTickets.map((ticket) => (
                      <TableRow key={ticket.id}>
                        <TableCell>#{ticket.id.substring(0, 8)}</TableCell>
                        <TableCell>{ticket.title}</TableCell>
                        <TableCell>{formatDate(ticket.created_at)}</TableCell>
                        <TableCell>{ticket.type}</TableCell>
                        <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                        <TableCell>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleViewTicket(ticket.id)}
                          >
                            Detalhes
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="closed">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Chamados Encerrados</CardTitle>
              <Button variant="outline" size="sm" onClick={fetchTickets}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Atualizar
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nº</TableHead>
                    <TableHead>Assunto</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-10">
                        <Loader2 className="animate-spin h-6 w-6 mx-auto" />
                        <p className="mt-2">Carregando chamados...</p>
                      </TableCell>
                    </TableRow>
                  ) : closedTickets.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-10">
                        <p className="text-muted-foreground">
                          Nenhum chamado encerrado encontrado.
                        </p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    closedTickets.map((ticket) => (
                      <TableRow key={ticket.id}>
                        <TableCell>#{ticket.id.substring(0, 8)}</TableCell>
                        <TableCell>{ticket.title}</TableCell>
                        <TableCell>{formatDate(ticket.created_at)}</TableCell>
                        <TableCell>{ticket.type}</TableCell>
                        <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                        <TableCell>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleViewTicket(ticket.id)}
                          >
                            Detalhes
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* New Ticket Dialog */}
      <Dialog open={showNewTicketDialog} onOpenChange={setShowNewTicketDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Criar Novo Chamado</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="subject">
                Assunto
              </label>
              <Input 
                id="subject" 
                placeholder="Título do chamado" 
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="type">
                Tipo de Chamado
              </label>
              <Select 
                value={selectedType} 
                onValueChange={(value: TicketType) => setSelectedType(value)}
              >
                <SelectTrigger id="type">
                  <SelectValue placeholder="Selecione um tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={TicketType.TECHNICAL}>Técnico</SelectItem>
                  <SelectItem value={TicketType.MACHINE}>Máquina</SelectItem>
                  <SelectItem value={TicketType.MAINTENANCE}>Manutenção</SelectItem>
                  <SelectItem value={TicketType.INSTALLATION}>Instalação</SelectItem>
                  <SelectItem value={TicketType.REPLACEMENT}>Substituição</SelectItem>
                  <SelectItem value={TicketType.SUPPLIES}>Suprimentos</SelectItem>
                  <SelectItem value={TicketType.BILLING}>Cobrança</SelectItem>
                  <SelectItem value={TicketType.INQUIRY}>Consulta</SelectItem>
                  <SelectItem value={TicketType.OTHER}>Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="priority">
                Prioridade
              </label>
              <Select 
                value={selectedPriority} 
                onValueChange={(value: TicketPriority) => setSelectedPriority(value)}
              >
                <SelectTrigger id="priority">
                  <SelectValue placeholder="Selecione a prioridade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={TicketPriority.LOW}>Baixa</SelectItem>
                  <SelectItem value={TicketPriority.MEDIUM}>Média</SelectItem>
                  <SelectItem value={TicketPriority.HIGH}>Alta</SelectItem>
                  <SelectItem value={TicketPriority.CRITICAL}>Crítica</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {machines.length > 0 && (
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="machine">
                  Máquina (se aplicável)
                </label>
                <Select value={selectedMachine} onValueChange={setSelectedMachine}>
                  <SelectTrigger id="machine">
                    <SelectValue placeholder="Selecione uma máquina" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todas as máquinas</SelectItem>
                    {machines.map((machine) => (
                      <SelectItem value={machine.id} key={machine.id}>
                        {machine.serial_number} ({machine.model})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="description">
                Descrição
              </label>
              <Textarea 
                id="description" 
                placeholder="Descreva seu problema ou solicitação em detalhes..." 
                className="min-h-[150px]"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowNewTicketDialog(false)} 
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleCreateTicket} 
              disabled={isSubmitting || !subject || !description}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Criando...
                </>
              ) : (
                "Criar Chamado"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Ticket Details Dialog */}
      <Dialog open={showTicketDialog} onOpenChange={setShowTicketDialog}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedTicket && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold mb-2">
                  #{selectedTicket.id.substring(0, 8)} - {selectedTicket.title}
                </DialogTitle>
                <div className="flex flex-wrap gap-2 text-sm text-muted-foreground mt-2">
                  <div>{formatDate(selectedTicket.created_at)}</div>
                  <div>•</div>
                  <div>Tipo: {selectedTicket.type}</div>
                  <div>•</div>
                  <div>Status: {getStatusBadge(selectedTicket.status)}</div>
                </div>
              </DialogHeader>
              
              <div className="space-y-6 pt-4">
                {/* Ticket Description */}
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold">Descrição</h4>
                  <div className="rounded-md border bg-muted/40 p-4">
                    <p className="whitespace-pre-wrap">{selectedTicket.description}</p>
                  </div>
                </div>
                
                {/* Machine Info (if any) */}
                {selectedTicket.machine && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold">Máquina</h4>
                    <div className="rounded-md border bg-muted/40 p-4">
                      <p>
                        {selectedTicket.machine.serial_number} - {selectedTicket.machine.model}
                      </p>
                    </div>
                  </div>
                )}
                
                {/* Ticket Resolution (if any) */}
                {selectedTicket.resolution && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold">Resolução</h4>
                    <div className="rounded-md border bg-muted/40 p-4">
                      <p className="whitespace-pre-wrap">{selectedTicket.resolution}</p>
                    </div>
                  </div>
                )}
                
                {/* Messages Section */}
                <div className="mt-8">
                  <h4 className="text-sm font-semibold mb-4">Histórico de Mensagens</h4>
                  
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
                          value={reply}
                          onChange={(e) => setReply(e.target.value)}
                          placeholder="Digite sua mensagem..."
                          className="flex-1"
                          rows={3}
                        />
                        <Button 
                          className="self-end"
                          onClick={handleSendReply}
                          disabled={!reply.trim() || isSending}
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
    </div>
  );
};

export default UserSupport;
