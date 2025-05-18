
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { PageHeader } from "@/components/page/PageHeader";
import { PageWrapper } from "@/components/page/PageWrapper";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { useSupportTickets } from "@/hooks/logistics/use-support-tickets";
import { TicketStatus, TicketType, TicketPriority, SupportTicket } from "@/types/support.types";

const UserSupport = () => {
  const { toast } = useToast();
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedMachine, setSelectedMachine] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { 
    tickets, 
    isLoading, 
    addTicket 
  } = useSupportTickets();
  
  const openTickets = tickets.filter(ticket => 
    ticket.status !== TicketStatus.COMPLETED && 
    ticket.status !== TicketStatus.CANCELED
  );
  
  const closedTickets = tickets.filter(ticket => 
    ticket.status === TicketStatus.COMPLETED || 
    ticket.status === TicketStatus.CANCELED
  );
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!subject || !description || !selectedType) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await addTicket({
        title: subject,
        description,
        type: selectedType as TicketType,
        machine_id: selectedMachine || null,
        client_id: "current-client" // This would be replaced with the actual client ID in a real implementation
      });
      
      setSubject("");
      setDescription("");
      setSelectedType("");
      setSelectedMachine("");
      
      toast({
        title: "Chamado enviado",
        description: "Seu chamado foi enviado com sucesso!",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao enviar seu chamado. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const getStatusBadge = (status: string) => {
    let bgColor = "";
    let textColor = "";
    let label = "";
    
    switch (status) {
      case TicketStatus.PENDING:
        bgColor = "bg-yellow-50";
        textColor = "text-yellow-700";
        label = "Pendente";
        break;
      case TicketStatus.IN_PROGRESS:
        bgColor = "bg-blue-50";
        textColor = "text-blue-700";
        label = "Em análise";
        break;
      case TicketStatus.COMPLETED:
        bgColor = "bg-green-50";
        textColor = "text-green-700";
        label = "Concluído";
        break;
      case TicketStatus.CANCELED:
        bgColor = "bg-gray-50";
        textColor = "text-gray-700";
        label = "Cancelado";
        break;
      default:
        bgColor = "bg-gray-50";
        textColor = "text-gray-700";
        label = status;
    }
    
    return (
      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${bgColor} ${textColor}`}>
        {label}
      </span>
    );
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };
  
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Central de Suporte" 
        description="Abra e acompanhe chamados de suporte e assistência"
      />
      
      <Tabs defaultValue="new">
        <TabsList className="mb-6">
          <TabsTrigger value="new">Novo Chamado</TabsTrigger>
          <TabsTrigger value="open">Chamados Abertos</TabsTrigger>
          <TabsTrigger value="closed">Chamados Fechados</TabsTrigger>
        </TabsList>
        
        <TabsContent value="new">
          <Card>
            <CardHeader>
              <CardTitle>Abrir Novo Chamado</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1" htmlFor="subject">
                    Assunto
                  </label>
                  <Input 
                    id="subject" 
                    placeholder="Resumo do seu problema ou solicitação" 
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1" htmlFor="type">
                    Tipo de Chamado
                  </label>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Selecione um tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={TicketType.INSTALLATION}>Instalação</SelectItem>
                      <SelectItem value={TicketType.MAINTENANCE}>Manutenção</SelectItem>
                      <SelectItem value={TicketType.REMOVAL}>Remoção</SelectItem>
                      <SelectItem value={TicketType.REPLACEMENT}>Substituição</SelectItem>
                      <SelectItem value={TicketType.SUPPLIES}>Suprimentos</SelectItem>
                      <SelectItem value={TicketType.PAPER}>Bobinas</SelectItem>
                      <SelectItem value={TicketType.OTHER}>Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
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
                      <SelectItem value="sn-100001">SN-100001 (Terminal Pro)</SelectItem>
                      <SelectItem value="sn-100002">SN-100002 (Terminal Standard)</SelectItem>
                      <SelectItem value="sn-100003">SN-100003 (Terminal Pro)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
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
                
                <div>
                  <label className="block text-sm font-medium mb-1" htmlFor="attachments">
                    Anexos (opcional)
                  </label>
                  <Input id="attachments" type="file" />
                </div>
                
                <div className="pt-4">
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Enviando..." : "Enviar Chamado"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="open">
          <PageWrapper>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nº</TableHead>
                  <TableHead>Assunto</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[100px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                      Carregando chamados...
                    </TableCell>
                  </TableRow>
                ) : openTickets.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                      Nenhum chamado aberto encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  openTickets.map((ticket) => (
                    <TableRow key={ticket.id}>
                      <TableCell>#{ticket.id.substr(-4)}</TableCell>
                      <TableCell>{ticket.title}</TableCell>
                      <TableCell>{formatDate(ticket.created_at)}</TableCell>
                      <TableCell>{ticket.type}</TableCell>
                      <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">Detalhes</Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </PageWrapper>
        </TabsContent>
        
        <TabsContent value="closed">
          <PageWrapper>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nº</TableHead>
                  <TableHead>Assunto</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[100px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                      Carregando chamados...
                    </TableCell>
                  </TableRow>
                ) : closedTickets.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                      Nenhum chamado fechado encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  closedTickets.map((ticket) => (
                    <TableRow key={ticket.id}>
                      <TableCell>#{ticket.id.substr(-4)}</TableCell>
                      <TableCell>{ticket.title}</TableCell>
                      <TableCell>{formatDate(ticket.created_at)}</TableCell>
                      <TableCell>{ticket.type}</TableCell>
                      <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">Detalhes</Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </PageWrapper>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserSupport;
