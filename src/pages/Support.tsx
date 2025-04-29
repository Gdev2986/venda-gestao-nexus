
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { MessageSquare, PlusIcon, Send } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

// Define types
interface Client {
  id: string;
  business_name: string;
}

interface SupportConversation {
  id: string;
  client_id: string;
  client_name?: string;
  subject: string;
  status: "OPEN" | "CLOSED" | "PENDING";
  created_at: string;
  updated_at: string;
  last_message?: string;
  unread_count?: number;
}

interface SupportMessage {
  id: string;
  conversation_id: string;
  user_id: string;
  user_name?: string;
  message: string;
  is_read: boolean;
  created_at: string;
  is_admin?: boolean;
}

// Mock data
const mockClients: Client[] = [
  { id: "1", business_name: "Empresa ABC" },
  { id: "2", business_name: "Empresa XYZ" },
  { id: "3", business_name: "Empresa QWE" }
];

const mockConversations: SupportConversation[] = [
  {
    id: "1",
    client_id: "1",
    client_name: "Empresa ABC",
    subject: "Problema com pagamento",
    status: "OPEN",
    created_at: "2023-06-01T10:30:00Z",
    updated_at: "2023-06-01T15:45:00Z",
    last_message: "Estamos aguardando o processamento do pagamento.",
    unread_count: 2
  },
  {
    id: "2",
    client_id: "2",
    client_name: "Empresa XYZ",
    subject: "Máquina com defeito",
    status: "PENDING",
    created_at: "2023-05-28T08:20:00Z",
    updated_at: "2023-05-30T09:15:00Z",
    last_message: "Estamos enviando um técnico para verificar o problema.",
    unread_count: 0
  },
  {
    id: "3",
    client_id: "1",
    client_name: "Empresa ABC",
    subject: "Solicitação de nova máquina",
    status: "CLOSED",
    created_at: "2023-05-15T14:10:00Z",
    updated_at: "2023-05-20T16:30:00Z",
    last_message: "A sua solicitação foi atendida, nova máquina entregue.",
    unread_count: 0
  }
];

const mockMessages: { [key: string]: SupportMessage[] } = {
  "1": [
    {
      id: "m1",
      conversation_id: "1",
      user_id: "client1",
      user_name: "Cliente ABC",
      message: "Estou com um problema no processamento do pagamento, não consigo finalizar a transação.",
      is_read: true,
      created_at: "2023-06-01T10:30:00Z",
      is_admin: false
    },
    {
      id: "m2",
      conversation_id: "1",
      user_id: "admin1",
      user_name: "Suporte",
      message: "Vamos verificar o que está acontecendo com o processamento do seu pagamento. Poderia nos informar qual foi a forma de pagamento utilizada?",
      is_read: true,
      created_at: "2023-06-01T11:15:00Z",
      is_admin: true
    },
    {
      id: "m3",
      conversation_id: "1",
      user_id: "client1",
      user_name: "Cliente ABC",
      message: "Tentei pagar com PIX, mas o sistema não gerou o código QR.",
      is_read: true,
      created_at: "2023-06-01T11:30:00Z",
      is_admin: false
    },
    {
      id: "m4",
      conversation_id: "1",
      user_id: "admin1",
      user_name: "Suporte",
      message: "Estamos aguardando o processamento do pagamento.",
      is_read: false,
      created_at: "2023-06-01T15:45:00Z",
      is_admin: true
    }
  ],
  "2": [
    {
      id: "m5",
      conversation_id: "2",
      user_id: "client2",
      user_name: "Cliente XYZ",
      message: "Minha máquina está apresentando erro ao ligar, tela em branco.",
      is_read: true,
      created_at: "2023-05-28T08:20:00Z",
      is_admin: false
    },
    {
      id: "m6",
      conversation_id: "2",
      user_id: "admin1",
      user_name: "Suporte",
      message: "Vamos verificar este problema. Você já tentou reiniciar a máquina?",
      is_read: true,
      created_at: "2023-05-28T09:05:00Z",
      is_admin: true
    },
    {
      id: "m7",
      conversation_id: "2",
      user_id: "client2",
      user_name: "Cliente XYZ",
      message: "Sim, já tentei reiniciar várias vezes, mas continua igual.",
      is_read: true,
      created_at: "2023-05-28T09:30:00Z",
      is_admin: false
    },
    {
      id: "m8",
      conversation_id: "2",
      user_id: "admin1",
      user_name: "Suporte",
      message: "Estamos enviando um técnico para verificar o problema.",
      is_read: true,
      created_at: "2023-05-30T09:15:00Z",
      is_admin: true
    }
  ]
};

const statusColors = {
  OPEN: "bg-green-500",
  PENDING: "bg-amber-500",
  CLOSED: "bg-gray-500"
};

const statusLabels = {
  OPEN: "Aberto",
  PENDING: "Pendente",
  CLOSED: "Fechado"
};

// Create Conversation Dialog
interface CreateConversationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { client_id: string; subject: string; message: string }) => void;
  clients: Client[];
}

const CreateConversationDialog = ({ isOpen, onClose, onSubmit, clients }: CreateConversationDialogProps) => {
  const [clientId, setClientId] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  
  useEffect(() => {
    if (isOpen) {
      setClientId("");
      setSubject("");
      setMessage("");
    }
  }, [isOpen]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      client_id: clientId,
      subject,
      message
    });
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nova Conversa de Suporte</DialogTitle>
          <DialogDescription>
            Crie uma nova conversa de suporte para um cliente
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="client">Cliente</Label>
              <Select 
                value={clientId} 
                onValueChange={setClientId} 
                required
              >
                <SelectTrigger id="client">
                  <SelectValue placeholder="Selecione um cliente" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.business_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="subject">Assunto</Label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="message">Mensagem Inicial</Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                required
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={!clientId || !subject || !message}
            >
              Criar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// ChatDialog Component
interface ChatDialogProps {
  conversation: SupportConversation | null;
  isOpen: boolean;
  onClose: () => void;
  onSendMessage: (conversationId: string, message: string) => void;
  onStatusChange: (conversationId: string, status: "OPEN" | "PENDING" | "CLOSED") => void;
  messages: SupportMessage[];
}

const ChatDialog = ({ 
  conversation, 
  isOpen, 
  onClose, 
  onSendMessage,
  onStatusChange,
  messages 
}: ChatDialogProps) => {
  const [message, setMessage] = useState("");
  
  if (!conversation) return null;
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(conversation.id, message);
      setMessage("");
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader className="flex flex-row items-center justify-between">
          <div>
            <DialogTitle>{conversation.subject}</DialogTitle>
            <DialogDescription>
              {conversation.client_name}
            </DialogDescription>
          </div>
          <div className="flex items-center gap-2">
            <Select 
              defaultValue={conversation.status} 
              onValueChange={(value: "OPEN" | "PENDING" | "CLOSED") => onStatusChange(conversation.id, value)}
            >
              <SelectTrigger className="w-[130px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="OPEN">Aberto</SelectItem>
                <SelectItem value="PENDING">Pendente</SelectItem>
                <SelectItem value="CLOSED">Fechado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto py-4 px-2 space-y-4 min-h-[400px] max-h-[500px]">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex ${msg.is_admin ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[70%] p-3 rounded-lg ${msg.is_admin 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-xs">{msg.user_name}</span>
                  <span className="text-xs opacity-70">
                    {formatDistanceToNow(new Date(msg.created_at), {
                      addSuffix: true,
                      locale: ptBR
                    })}
                  </span>
                </div>
                <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
              </div>
            </div>
          ))}
          
          {messages.length === 0 && (
            <div className="flex justify-center items-center h-full">
              <p className="text-muted-foreground">Nenhuma mensagem nesta conversa</p>
            </div>
          )}
        </div>
        
        <form onSubmit={handleSendMessage} className="flex items-center gap-2 pt-2">
          <Textarea 
            value={message} 
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Digite sua mensagem..." 
            className="flex-1 min-h-[60px]"
          />
          <Button type="submit" size="icon" disabled={!message.trim()}>
            <Send className="h-4 w-4" />
            <span className="sr-only">Enviar</span>
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const Support = () => {
  const [conversations, setConversations] = useState<SupportConversation[]>(mockConversations);
  const [selectedConversation, setSelectedConversation] = useState<SupportConversation | null>(null);
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showChatDialog, setShowChatDialog] = useState(false);
  const { toast } = useToast();
  
  // Filter conversations based on status and search query
  const filteredConversations = conversations.filter(conv => {
    const matchesStatus = statusFilter === "all" || conv.status === statusFilter;
    const matchesSearch = searchQuery === "" || 
      conv.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (conv.client_name && conv.client_name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesSearch;
  });
  
  // Load messages when a conversation is selected
  useEffect(() => {
    if (selectedConversation) {
      // In a real app, this would fetch messages from the database
      const conversationMessages = mockMessages[selectedConversation.id] || [];
      setMessages(conversationMessages);
    }
  }, [selectedConversation]);
  
  const handleConversationClick = (conversation: SupportConversation) => {
    setSelectedConversation(conversation);
    setShowChatDialog(true);
  };
  
  const handleCreateConversation = (data: { client_id: string; subject: string; message: string }) => {
    // In a real app, this would create a conversation in the database
    const clientInfo = mockClients.find(c => c.id === data.client_id);
    
    const newConversation: SupportConversation = {
      id: `new-${Date.now()}`,
      client_id: data.client_id,
      client_name: clientInfo?.business_name,
      subject: data.subject,
      status: "OPEN",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      unread_count: 0
    };
    
    const newMessage: SupportMessage = {
      id: `msg-${Date.now()}`,
      conversation_id: newConversation.id,
      user_id: "admin1",
      user_name: "Suporte",
      message: data.message,
      is_read: true,
      created_at: new Date().toISOString(),
      is_admin: true
    };
    
    // Update state with new conversation and message
    setConversations([newConversation, ...conversations]);
    mockMessages[newConversation.id] = [newMessage];
    
    // Close the dialog and show success message
    setShowCreateDialog(false);
    toast({
      title: "Conversa criada",
      description: "A conversa de suporte foi criada com sucesso."
    });
  };
  
  const handleSendMessage = (conversationId: string, messageText: string) => {
    // In a real app, this would send a message to the database
    const newMessage: SupportMessage = {
      id: `msg-${Date.now()}`,
      conversation_id: conversationId,
      user_id: "admin1",
      user_name: "Suporte",
      message: messageText,
      is_read: true,
      created_at: new Date().toISOString(),
      is_admin: true
    };
    
    // Update conversation last message
    const updatedConversations = conversations.map(conv => 
      conv.id === conversationId 
        ? { ...conv, last_message: messageText, updated_at: new Date().toISOString() }
        : conv
    );
    
    // Add message to the conversation
    if (!mockMessages[conversationId]) {
      mockMessages[conversationId] = [];
    }
    mockMessages[conversationId] = [...mockMessages[conversationId], newMessage];
    
    // Update state
    setConversations(updatedConversations);
    setMessages([...messages, newMessage]);
    
    toast({
      title: "Mensagem enviada",
      description: "Sua mensagem foi enviada com sucesso."
    });
  };
  
  const handleStatusChange = (conversationId: string, newStatus: "OPEN" | "PENDING" | "CLOSED") => {
    // In a real app, this would update the conversation status in the database
    const updatedConversations = conversations.map(conv => 
      conv.id === conversationId 
        ? { ...conv, status: newStatus, updated_at: new Date().toISOString() }
        : conv
    );
    
    setConversations(updatedConversations);
    
    if (selectedConversation && selectedConversation.id === conversationId) {
      setSelectedConversation({ ...selectedConversation, status: newStatus });
    }
    
    toast({
      title: "Status atualizado",
      description: `O status da conversa foi alterado para ${statusLabels[newStatus]}.`
    });
  };
  
  return (
    <MainLayout>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold tracking-tight">Suporte</h2>
          <Button onClick={() => setShowCreateDialog(true)}>
            <PlusIcon className="mr-2 h-4 w-4" />
            Nova Conversa
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle>Filtros</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Selecione um status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="OPEN">Aberto</SelectItem>
                    <SelectItem value="PENDING">Pendente</SelectItem>
                    <SelectItem value="CLOSED">Fechado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="search">Pesquisar</Label>
                <Input
                  id="search"
                  placeholder="Pesquisar por assunto ou cliente"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
          
          <Card className="md:col-span-9">
            <CardHeader>
              <CardTitle>Conversas de Suporte</CardTitle>
              <CardDescription>
                Gerencie todas as conversas de suporte
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Assunto</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Última Atualização</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-6">
                        Carregando...
                      </TableCell>
                    </TableRow>
                  ) : filteredConversations.length > 0 ? (
                    filteredConversations.map((conversation) => (
                      <TableRow key={conversation.id}>
                        <TableCell>{conversation.client_name}</TableCell>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            {conversation.subject}
                            {(conversation.unread_count || 0) > 0 && (
                              <Badge variant="destructive" className="rounded-full h-5 min-w-5 flex items-center justify-center">
                                {conversation.unread_count}
                              </Badge>
                            )}
                          </div>
                          {conversation.last_message && (
                            <div className="text-xs text-muted-foreground truncate max-w-xs mt-1">
                              {conversation.last_message}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge className={statusColors[conversation.status]}>
                            {statusLabels[conversation.status]}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {formatDistanceToNow(new Date(conversation.updated_at), {
                            addSuffix: true,
                            locale: ptBR
                          })}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleConversationClick(conversation)}
                          >
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Ver
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                        Nenhuma conversa encontrada
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
        
        {/* Create conversation dialog */}
        <CreateConversationDialog 
          isOpen={showCreateDialog}
          onClose={() => setShowCreateDialog(false)}
          onSubmit={handleCreateConversation}
          clients={mockClients}
        />
        
        {/* Chat dialog */}
        <ChatDialog 
          conversation={selectedConversation}
          isOpen={showChatDialog}
          onClose={() => setShowChatDialog(false)}
          onSendMessage={handleSendMessage}
          onStatusChange={handleStatusChange}
          messages={messages}
        />
      </div>
    </MainLayout>
  );
};

export default Support;
