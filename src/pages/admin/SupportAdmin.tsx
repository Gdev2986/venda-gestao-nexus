
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tab, Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { 
  MessageSquare, Search, Filter, User, 
  CircleCheck, Clock, AlertTriangle, 
  ArrowUpRight, RefreshCw, Send
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';

type TicketStatus = 'open' | 'in-progress' | 'resolved' | 'closed';
type TicketPriority = 'low' | 'medium' | 'high' | 'critical';

interface Ticket {
  id: string;
  subject: string;
  status: TicketStatus;
  priority: TicketPriority;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  userName: string;
  userEmail: string;
  userRole: string;
  messages: TicketMessage[];
  assignedTo?: string;
  department: string;
}

interface TicketMessage {
  id: string;
  content: string;
  createdAt: Date;
  isFromStaff: boolean;
  authorName: string;
  authorId: string;
  attachments?: { name: string; url: string }[];
}

// Mock data for tickets
const mockTickets: Ticket[] = [
  {
    id: 'T-1001',
    subject: 'Problemas no processamento de pagamento',
    status: 'open',
    priority: 'high',
    createdAt: new Date('2025-05-01T10:30:00'),
    updatedAt: new Date('2025-05-01T10:30:00'),
    userId: 'user-123',
    userName: 'João Silva',
    userEmail: 'joao@empresa.com',
    userRole: 'CLIENT',
    department: 'Financeiro',
    messages: [
      {
        id: 'msg-1',
        content: 'Estou tentando fazer um pagamento via PIX mas está dando erro "Transação não autorizada". Podem me ajudar?',
        createdAt: new Date('2025-05-01T10:30:00'),
        isFromStaff: false,
        authorName: 'João Silva',
        authorId: 'user-123'
      }
    ]
  },
  {
    id: 'T-1002',
    subject: 'Máquina com defeito',
    status: 'in-progress',
    priority: 'medium',
    createdAt: new Date('2025-04-29T14:15:00'),
    updatedAt: new Date('2025-05-01T09:22:00'),
    userId: 'user-456',
    userName: 'Maria Souza',
    userEmail: 'maria@empresa.com',
    userRole: 'CLIENT',
    department: 'Logística',
    assignedTo: 'Técnico Carlos',
    messages: [
      {
        id: 'msg-2',
        content: 'A máquina modelo XX2021 está apresentando falhas na leitura de cartões.',
        createdAt: new Date('2025-04-29T14:15:00'),
        isFromStaff: false,
        authorName: 'Maria Souza',
        authorId: 'user-456'
      },
      {
        id: 'msg-3',
        content: 'Entendi seu problema, Maria. Já encaminhei para o setor de logística avaliar. Em breve um técnico entrará em contato.',
        createdAt: new Date('2025-04-30T09:10:00'),
        isFromStaff: true,
        authorName: 'Suporte',
        authorId: 'staff-001'
      },
      {
        id: 'msg-4',
        content: 'Olá Maria, sou o Carlos do setor técnico. Vamos agendar uma visita para amanhã às 14h, pode ser?',
        createdAt: new Date('2025-05-01T09:22:00'),
        isFromStaff: true,
        authorName: 'Técnico Carlos',
        authorId: 'staff-002'
      }
    ]
  },
  {
    id: 'T-1003',
    subject: 'Dúvida sobre comissões',
    status: 'resolved',
    priority: 'low',
    createdAt: new Date('2025-04-28T11:05:00'),
    updatedAt: new Date('2025-04-30T16:45:00'),
    userId: 'user-789',
    userName: 'Roberto Almeida',
    userEmail: 'roberto@parceiro.com',
    userRole: 'PARTNER',
    department: 'Financeiro',
    assignedTo: 'Ana Finanças',
    messages: [
      {
        id: 'msg-5',
        content: 'Gostaria de entender melhor como é calculada a comissão para parceiros com mais de 50 clientes.',
        createdAt: new Date('2025-04-28T11:05:00'),
        isFromStaff: false,
        authorName: 'Roberto Almeida',
        authorId: 'user-789'
      },
      {
        id: 'msg-6',
        content: 'Olá Roberto, encaminhei sua dúvida ao departamento financeiro responsável pelas comissões de parceiros.',
        createdAt: new Date('2025-04-28T14:30:00'),
        isFromStaff: true,
        authorName: 'Suporte',
        authorId: 'staff-001'
      },
      {
        id: 'msg-7',
        content: 'Roberto, bom dia! Para parceiros com mais de 50 clientes, aplicamos uma taxa especial de 2.5% sobre o valor processado, além do bônus mensal fixo de R$500. Estou encaminhando por email a tabela completa de comissões.',
        createdAt: new Date('2025-04-30T10:15:00'),
        isFromStaff: true,
        authorName: 'Ana Finanças',
        authorId: 'staff-003'
      },
      {
        id: 'msg-8',
        content: 'Muito obrigado pela explicação detalhada, Ana! Ficou claro agora.',
        createdAt: new Date('2025-04-30T16:45:00'),
        isFromStaff: false,
        authorName: 'Roberto Almeida',
        authorId: 'user-789'
      }
    ]
  },
  {
    id: 'T-1004',
    subject: 'Solicitação de novas máquinas',
    status: 'closed',
    priority: 'medium',
    createdAt: new Date('2025-04-20T09:30:00'),
    updatedAt: new Date('2025-04-26T15:10:00'),
    userId: 'user-123',
    userName: 'João Silva',
    userEmail: 'joao@empresa.com',
    userRole: 'CLIENT',
    department: 'Logística',
    assignedTo: 'Logística Central',
    messages: [
      {
        id: 'msg-9',
        content: 'Preciso solicitar mais 3 máquinas para meus novos pontos de venda.',
        createdAt: new Date('2025-04-20T09:30:00'),
        isFromStaff: false,
        authorName: 'João Silva',
        authorId: 'user-123'
      },
      {
        id: 'msg-10',
        content: 'Solicitação recebida, João. Vou verificar a disponibilidade e o prazo de entrega.',
        createdAt: new Date('2025-04-20T11:45:00'),
        isFromStaff: true,
        authorName: 'Suporte',
        authorId: 'staff-001'
      },
      {
        id: 'msg-11',
        content: 'Temos disponibilidade para envio de 3 máquinas modelo POS4000. O prazo de entrega é de 3 dias úteis. Confirma o pedido?',
        createdAt: new Date('2025-04-22T10:00:00'),
        isFromStaff: true,
        authorName: 'Logística Central',
        authorId: 'staff-004'
      },
      {
        id: 'msg-12',
        content: 'Confirmo o pedido, obrigado!',
        createdAt: new Date('2025-04-22T14:20:00'),
        isFromStaff: false,
        authorName: 'João Silva',
        authorId: 'user-123'
      },
      {
        id: 'msg-13',
        content: 'Pedido processado com sucesso. Número de rastreio: LT78901234BR',
        createdAt: new Date('2025-04-23T09:15:00'),
        isFromStaff: true,
        authorName: 'Logística Central',
        authorId: 'staff-004'
      },
      {
        id: 'msg-14',
        content: 'As máquinas foram entregues. Estou muito satisfeito com o prazo. Podem fechar este chamado.',
        createdAt: new Date('2025-04-26T15:10:00'),
        isFromStaff: false,
        authorName: 'João Silva',
        authorId: 'user-123'
      }
    ]
  },
  {
    id: 'T-1005',
    subject: 'Erro ao acessar relatórios',
    status: 'open',
    priority: 'critical',
    createdAt: new Date('2025-05-02T08:15:00'),
    updatedAt: new Date('2025-05-02T08:15:00'),
    userId: 'user-789',
    userName: 'Roberto Almeida',
    userEmail: 'roberto@parceiro.com',
    userRole: 'PARTNER',
    department: 'TI',
    messages: [
      {
        id: 'msg-15',
        content: 'URGENTE: Não consigo acessar os relatórios de comissão. Recebo erro 500 ao tentar visualizar qualquer relatório.',
        createdAt: new Date('2025-05-02T08:15:00'),
        isFromStaff: false,
        authorName: 'Roberto Almeida',
        authorId: 'user-789'
      }
    ]
  }
];

// Component that renders a status badge
const TicketStatusBadge = ({ status }: { status: TicketStatus }) => {
  if (status === 'open') {
    return (
      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">
        <Clock className="w-3 h-3 mr-1" />
        Aberto
      </Badge>
    );
  } else if (status === 'in-progress') {
    return (
      <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300">
        <RefreshCw className="w-3 h-3 mr-1" />
        Em andamento
      </Badge>
    );
  } else if (status === 'resolved') {
    return (
      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
        <CircleCheck className="w-3 h-3 mr-1" />
        Resolvido
      </Badge>
    );
  } else {
    return (
      <Badge variant="outline" className="bg-gray-100 text-gray-700 border-gray-300">
        <ArrowUpRight className="w-3 h-3 mr-1" />
        Fechado
      </Badge>
    );
  }
};

// Component that renders a priority badge
const TicketPriorityBadge = ({ priority }: { priority: TicketPriority }) => {
  switch (priority) {
    case 'low':
      return <Badge className="bg-blue-500">Baixa</Badge>;
    case 'medium':
      return <Badge className="bg-yellow-500">Média</Badge>;
    case 'high':
      return <Badge className="bg-orange-500">Alta</Badge>;
    case 'critical':
      return <Badge className="bg-red-500">Crítica</Badge>;
    default:
      return null;
  }
};

const SupportAdmin = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [replyText, setReplyText] = useState('');
  const [currentTab, setCurrentTab] = useState('all');

  // Filter tickets based on search query and tab
  const filteredTickets = mockTickets.filter(ticket => {
    const matchesSearch = 
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) || 
      ticket.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (currentTab === 'all') return matchesSearch;
    if (currentTab === 'open') return matchesSearch && ticket.status === 'open';
    if (currentTab === 'in-progress') return matchesSearch && ticket.status === 'in-progress';
    if (currentTab === 'resolved') return matchesSearch && ticket.status === 'resolved';
    if (currentTab === 'closed') return matchesSearch && ticket.status === 'closed';
    
    return matchesSearch;
  });

  // Handle ticket reply
  const handleReply = () => {
    if (!replyText.trim() || !selectedTicket) return;
    
    // Here we would typically make an API call to save the reply
    console.log(`Replying to ticket ${selectedTicket.id}: ${replyText}`);
    
    // For demo, just clear the input
    setReplyText('');
  };

  // Format date to be more readable
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Central de Suporte</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie todos os tickets de suporte do sistema
          </p>
        </div>
        
        <div className="flex space-x-2">
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filtros
          </Button>
          <Button>
            Relatório de Tickets
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left side - Tickets list */}
        <div className="col-span-1">
          <Card className="h-[calc(100vh-180px)]">
            <CardHeader className="p-4">
              <CardTitle className="text-lg">Tickets</CardTitle>
              <div className="relative mt-2">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Buscar tickets..." 
                  className="pl-8" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </CardHeader>
            
            <CardContent className="p-0">
              <Tabs 
                defaultValue="all" 
                className="w-full" 
                onValueChange={(value) => setCurrentTab(value)}
              >
                <div className="border-b px-4">
                  <TabsList className="w-full justify-start">
                    <TabsTrigger value="all" className="text-xs">
                      Todos
                      <Badge variant="outline" className="ml-1 bg-gray-100">{mockTickets.length}</Badge>
                    </TabsTrigger>
                    <TabsTrigger value="open" className="text-xs">
                      Abertos
                      <Badge variant="outline" className="ml-1 bg-blue-50">{mockTickets.filter(t => t.status === 'open').length}</Badge>
                    </TabsTrigger>
                    <TabsTrigger value="in-progress" className="text-xs">
                      Em andamento
                      <Badge variant="outline" className="ml-1 bg-yellow-50">{mockTickets.filter(t => t.status === 'in-progress').length}</Badge>
                    </TabsTrigger>
                    <TabsTrigger value="resolved" className="text-xs">
                      Resolvidos
                      <Badge variant="outline" className="ml-1 bg-green-50">{mockTickets.filter(t => t.status === 'resolved').length}</Badge>
                    </TabsTrigger>
                  </TabsList>
                </div>
                
                <ScrollArea className="h-[calc(100vh-280px)] w-full">
                  <TabsContent value="all" className="m-0">
                    {filteredTickets.map((ticket) => (
                      <div 
                        key={ticket.id}
                        className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${selectedTicket?.id === ticket.id ? 'bg-gray-50' : ''}`}
                        onClick={() => setSelectedTicket(ticket)}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-medium text-sm">{ticket.subject}</span>
                          <TicketStatusBadge status={ticket.status} />
                        </div>
                        
                        <div className="flex items-center text-sm text-muted-foreground mb-1">
                          <User className="h-3 w-3 mr-1" /> {ticket.userName} ({ticket.userRole === 'CLIENT' ? 'Cliente' : ticket.userRole === 'PARTNER' ? 'Parceiro' : 'Admin'})
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">#{ticket.id} • {formatDate(ticket.updatedAt)}</span>
                          <TicketPriorityBadge priority={ticket.priority} />
                        </div>
                      </div>
                    ))}
                    
                    {filteredTickets.length === 0 && (
                      <div className="p-8 text-center">
                        <MessageSquare className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                        <h3 className="font-medium">Nenhum ticket encontrado</h3>
                        <p className="text-sm text-muted-foreground">
                          Tente ajustar seus filtros ou busca
                        </p>
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="open" className="m-0">
                    {/* Similar structure as 'all' but filtered for open tickets */}
                  </TabsContent>
                  
                  <TabsContent value="in-progress" className="m-0">
                    {/* Similar structure as 'all' but filtered for in-progress tickets */}
                  </TabsContent>
                  
                  <TabsContent value="resolved" className="m-0">
                    {/* Similar structure as 'all' but filtered for resolved tickets */}
                  </TabsContent>
                </ScrollArea>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        {/* Right side - Ticket details or empty state */}
        <div className="col-span-2">
          {selectedTicket ? (
            <Card className="h-[calc(100vh-180px)] flex flex-col">
              <CardHeader className="p-4 pb-0">
                <div className="flex justify-between">
                  <div>
                    <CardTitle>{selectedTicket.subject}</CardTitle>
                    <CardDescription className="mt-1">
                      Ticket #{selectedTicket.id} • Aberto em {formatDate(selectedTicket.createdAt)}
                    </CardDescription>
                  </div>
                  
                  <div className="flex space-x-2">
                    <TicketStatusBadge status={selectedTicket.status} />
                    <TicketPriorityBadge priority={selectedTicket.priority} />
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mt-4 p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-xs text-muted-foreground">Cliente</p>
                    <p className="font-medium">{selectedTicket.userName}</p>
                    <p className="text-xs">{selectedTicket.userEmail}</p>
                  </div>
                  
                  <div>
                    <p className="text-xs text-muted-foreground">Departamento</p>
                    <p className="font-medium">{selectedTicket.department}</p>
                  </div>
                  
                  <div>
                    <p className="text-xs text-muted-foreground">Atribuído para</p>
                    <p className="font-medium">{selectedTicket.assignedTo || 'Não atribuído'}</p>
                  </div>
                </div>
              </CardHeader>
              
              <div className="px-4 py-2 border-t border-b bg-gray-50 mt-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Histórico de mensagens</span>
                  <Select defaultValue="open">
                    <SelectTrigger className="w-[180px] h-8 text-xs">
                      <SelectValue placeholder="Marcar como" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Status</SelectLabel>
                        <SelectItem value="open">Aberto</SelectItem>
                        <SelectItem value="in-progress">Em andamento</SelectItem>
                        <SelectItem value="resolved">Resolvido</SelectItem>
                        <SelectItem value="closed">Fechado</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <ScrollArea className="flex-grow px-4 py-4">
                {selectedTicket.messages.map((message) => (
                  <div key={message.id} className="mb-6">
                    <div className="flex items-start">
                      <Avatar className="mr-3">
                        <AvatarFallback>{message.isFromStaff ? 'SP' : message.authorName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <div className="flex justify-between items-baseline">
                          <div className="font-medium">{message.authorName}</div>
                          <div className="text-xs text-muted-foreground">{formatDate(message.createdAt)}</div>
                        </div>
                        
                        <div className={`mt-1 p-3 rounded-lg ${message.isFromStaff ? 'bg-blue-50' : 'bg-gray-50'}`}>
                          {message.content}
                        </div>
                        
                        {message.attachments && message.attachments.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {message.attachments.map((attachment, index) => (
                              <Button key={index} variant="outline" size="sm" className="text-xs">
                                <ArrowUpRight className="mr-1 h-3 w-3" />
                                {attachment.name}
                              </Button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </ScrollArea>
              
              <div className="p-4 border-t">
                <div className="flex items-start space-x-3">
                  <Avatar>
                    <AvatarFallback>SP</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <Textarea 
                      placeholder="Digite sua resposta..." 
                      className="min-h-24"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                    />
                    
                    <div className="flex justify-between mt-2">
                      <Button variant="outline">Anexar arquivo</Button>
                      <Button onClick={handleReply}>
                        <Send className="mr-2 h-4 w-4" />
                        Enviar resposta
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="h-[calc(100vh-180px)] flex items-center justify-center">
              <div className="text-center p-8">
                <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-xl font-semibold mb-2">Selecione um ticket</h2>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Escolha um ticket na lista à esquerda para visualizar seus detalhes e responder ao cliente.
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default SupportAdmin;
