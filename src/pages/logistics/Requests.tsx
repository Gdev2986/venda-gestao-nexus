
import { useState } from "react";
import { PageHeader } from "@/components/page/PageHeader";
import { PageWrapper } from "@/components/page/PageWrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { 
  CalendarIcon, 
  CheckCircle, 
  XCircle, 
  FilterIcon, 
  Plus, 
  Search,
  Settings,
  Wrench,
  Printer,
  Upload,
  MessageSquare,
  HelpCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const LogisticsRequests = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  // Dados simulados para as diferentes categorias de solicitações
  const allRequests = [
    {
      id: "1",
      client: "Empresa A",
      type: "Instalação",
      date: "2024-08-15",
      status: "Pendente",
      machine: "SN-100001",
      priority: "Alta",
    },
    {
      id: "2",
      client: "Empresa B",
      type: "Manutenção",
      date: "2024-08-16",
      status: "Agendado",
      machine: "SN-100002",
      priority: "Média",
    },
    {
      id: "3",
      client: "Empresa C",
      type: "Retirada",
      date: "2024-08-17",
      status: "Concluído",
      machine: "SN-100003",
      priority: "Baixa",
    },
    {
      id: "4",
      client: "Empresa D",
      type: "Troca de Bobina",
      date: "2024-08-18",
      status: "Pendente",
      machine: "SN-100004",
      priority: "Média",
    },
    {
      id: "5",
      client: "Empresa E",
      type: "Instalação",
      date: "2024-08-19",
      status: "Agendado",
      machine: "SN-100005",
      priority: "Alta",
    },
  ];

  // Dados simulados para os chamados de suporte
  const supportTickets = [
    { id: "#5001", client: "Cliente ABC", type: "Técnico", issue: "Máquina não liga", date: "22/04/2025", priority: "Alta" },
    { id: "#4998", client: "Cliente XYZ", type: "Material", issue: "Solicitação de bobinas", date: "21/04/2025", priority: "Média" },
    { id: "#4997", client: "Cliente DEF", type: "Manutenção", issue: "Erro na leitura de cartões", date: "21/04/2025", priority: "Alta" },
    { id: "#4996", client: "Cliente GHI", type: "Técnico", issue: "Tela travando", date: "20/04/2025", priority: "Média" },
    { id: "#4995", client: "Cliente JKL", type: "Material", issue: "Solicitação de bobinas", date: "20/04/2025", priority: "Baixa" },
  ];

  const maintenanceRequests = allRequests.filter(r => r.type === "Manutenção");
  const paperRequests = allRequests.filter(r => r.type === "Troca de Bobina");
  const installationRequests = allRequests.filter(r => r.type === "Instalação");

  const handleNewRequest = () => {
    toast({
      title: "Função não implementada",
      description: "Esta funcionalidade ainda será implementada.",
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Filtra as solicitações com base no termo de busca
  const filterRequests = (requests: typeof allRequests) => {
    return requests.filter((request) =>
      request.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.machine.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.type.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const filterTickets = (tickets: typeof supportTickets) => {
    return tickets.filter((ticket) =>
      ticket.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.issue.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.type.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Solicitações e Suporte" 
        description="Gerencie as solicitações de serviços e chamados de suporte"
        actionLabel="Nova Solicitação"
        actionOnClick={handleNewRequest}
      />
      
      <div className="flex items-center justify-between mb-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar solicitações ou chamados..."
            className="pl-8 bg-background"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
      </div>
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-6 mb-4">
          <TabsTrigger value="all" className="flex items-center gap-2">
            <FilterIcon size={16} />
            <span>Todas Solicitações</span>
          </TabsTrigger>
          <TabsTrigger value="maintenance" className="flex items-center gap-2">
            <Wrench size={16} />
            <span>Manutenção</span>
          </TabsTrigger>
          <TabsTrigger value="paper" className="flex items-center gap-2">
            <Printer size={16} />
            <span>Bobinas</span>
          </TabsTrigger>
          <TabsTrigger value="installation" className="flex items-center gap-2">
            <Upload size={16} />
            <span>Instalação</span>
          </TabsTrigger>
          <TabsTrigger value="support" className="flex items-center gap-2">
            <MessageSquare size={16} />
            <span>Chamados</span>
          </TabsTrigger>
          <TabsTrigger value="stats" className="flex items-center gap-2">
            <HelpCircle size={16} />
            <span>Estatísticas</span>
          </TabsTrigger>
        </TabsList>
        
        {/* Todas as Solicitações */}
        <TabsContent value="all">
          <PageWrapper>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Todas as Solicitações</h3>
              <div className="flex gap-2">
                <Select defaultValue="all">
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos Status</SelectItem>
                    <SelectItem value="pending">Pendente</SelectItem>
                    <SelectItem value="scheduled">Agendado</SelectItem>
                    <SelectItem value="completed">Concluído</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon">
                  <Settings className="h-4 w-4" />
                </Button>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Nova
                </Button>
              </div>
            </div>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Máquina</TableHead>
                  <TableHead>Prioridade</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filterRequests(allRequests).map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">{request.client}</TableCell>
                    <TableCell>{request.type}</TableCell>
                    <TableCell>{request.machine}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        request.priority === "Alta" ? "bg-red-50 text-red-700" : 
                        request.priority === "Média" ? "bg-orange-50 text-orange-700" : 
                        "bg-green-50 text-green-700"
                      }`}>
                        {request.priority}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {new Date(request.date).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      {request.status === "Pendente" && (
                        <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-yellow-50 text-yellow-700">
                          Pendente
                        </span>
                      )}
                      {request.status === "Agendado" && (
                        <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-blue-50 text-blue-700">
                          Agendado
                        </span>
                      )}
                      {request.status === "Concluído" && (
                        <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-green-50 text-green-700">
                          Concluído
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm">
                          Aprovar
                          <CheckCircle className="ml-2 h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          Rejeitar
                          <XCircle className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filterRequests(allRequests).length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                      Nenhuma solicitação encontrada
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </PageWrapper>
        </TabsContent>

        {/* Solicitações de Manutenção */}
        <TabsContent value="maintenance">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>Solicitações de Manutenção</CardTitle>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Nova Manutenção
              </Button>
            </CardHeader>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Máquina</TableHead>
                    <TableHead>Prioridade</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filterRequests(maintenanceRequests).map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">{request.client}</TableCell>
                      <TableCell>{request.machine}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                          request.priority === "Alta" ? "bg-red-50 text-red-700" : 
                          request.priority === "Média" ? "bg-orange-50 text-orange-700" : 
                          "bg-green-50 text-green-700"
                        }`}>
                          {request.priority}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {new Date(request.date).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                          request.status === "Pendente" ? "bg-yellow-50 text-yellow-700" : 
                          request.status === "Agendado" ? "bg-blue-50 text-blue-700" : 
                          "bg-green-50 text-green-700"
                        }`}>
                          {request.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline">
                          Ver Detalhes
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filterRequests(maintenanceRequests).length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                        Nenhuma solicitação de manutenção encontrada
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Solicitações de Bobinas */}
        <TabsContent value="paper">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>Solicitações de Bobinas</CardTitle>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Nova Solicitação de Bobina
              </Button>
            </CardHeader>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Máquina</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filterRequests(paperRequests).map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">{request.client}</TableCell>
                      <TableCell>{request.machine}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {new Date(request.date).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                          request.status === "Pendente" ? "bg-yellow-50 text-yellow-700" : 
                          request.status === "Agendado" ? "bg-blue-50 text-blue-700" : 
                          "bg-green-50 text-green-700"
                        }`}>
                          {request.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline">
                          Ver Detalhes
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filterRequests(paperRequests).length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                        Nenhuma solicitação de bobina encontrada
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Solicitações de Instalação */}
        <TabsContent value="installation">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>Solicitações de Instalação</CardTitle>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Nova Instalação
              </Button>
            </CardHeader>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Máquina</TableHead>
                    <TableHead>Prioridade</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filterRequests(installationRequests).map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">{request.client}</TableCell>
                      <TableCell>{request.machine}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                          request.priority === "Alta" ? "bg-red-50 text-red-700" : 
                          request.priority === "Média" ? "bg-orange-50 text-orange-700" : 
                          "bg-green-50 text-green-700"
                        }`}>
                          {request.priority}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {new Date(request.date).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                          request.status === "Pendente" ? "bg-yellow-50 text-yellow-700" : 
                          request.status === "Agendado" ? "bg-blue-50 text-blue-700" : 
                          "bg-green-50 text-green-700"
                        }`}>
                          {request.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline">
                          Ver Detalhes
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filterRequests(installationRequests).length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                        Nenhuma solicitação de instalação encontrada
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Chamados de Suporte Tab */}
        <TabsContent value="support">
          <PageWrapper>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Chamados de Suporte</h3>
              <div className="flex gap-2">
                <Select defaultValue="all">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Tipo de Chamado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os tipos</SelectItem>
                    <SelectItem value="technical">Técnico</SelectItem>
                    <SelectItem value="maintenance">Manutenção</SelectItem>
                    <SelectItem value="replacement">Substituição</SelectItem>
                    <SelectItem value="supplies">Materiais</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select defaultValue="pending">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos status</SelectItem>
                    <SelectItem value="pending">Pendentes</SelectItem>
                    <SelectItem value="inProgress">Em andamento</SelectItem>
                    <SelectItem value="scheduled">Agendados</SelectItem>
                    <SelectItem value="completed">Concluídos</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Novo Chamado
                </Button>
              </div>
            </div>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nº</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Problema</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Prioridade</TableHead>
                  <TableHead className="w-[150px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filterTickets(supportTickets).map((ticket, i) => (
                  <TableRow key={i}>
                    <TableCell>{ticket.id}</TableCell>
                    <TableCell>{ticket.client}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        ticket.type === "Técnico" ? "bg-red-50 text-red-700" : 
                        ticket.type === "Material" ? "bg-green-50 text-green-700" : 
                        "bg-yellow-50 text-yellow-700"
                      }`}>
                        {ticket.type}
                      </span>
                    </TableCell>
                    <TableCell>{ticket.issue}</TableCell>
                    <TableCell>{ticket.date}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        ticket.priority === "Alta" ? "bg-red-50 text-red-700" : 
                        ticket.priority === "Média" ? "bg-yellow-50 text-yellow-700" : 
                        "bg-blue-50 text-blue-700"
                      }`}>
                        {ticket.priority}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button size="sm">Atender</Button>
                        <Button variant="outline" size="sm">Detalhes</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filterTickets(supportTickets).length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                      Nenhum chamado encontrado com os filtros selecionados
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </PageWrapper>
        </TabsContent>
        
        {/* Estatísticas Tab */}
        <TabsContent value="stats">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Estoque de Materiais</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Bobinas</p>
                      <p className="text-sm text-muted-foreground">80mm x 30m</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">15 unidades</p>
                      <p className="text-xs text-red-600">Estoque baixo</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Carregadores</p>
                      <p className="text-sm text-muted-foreground">Padrão</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">32 unidades</p>
                      <p className="text-xs text-green-600">Estoque suficiente</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Baterias</p>
                      <p className="text-sm text-muted-foreground">Terminal Pro</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">8 unidades</p>
                      <p className="text-xs text-yellow-600">Estoque médio</p>
                    </div>
                  </div>
                  
                  <Button variant="outline" className="w-full mt-2">Gerenciar Estoque</Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Equipe Técnica</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Técnico A</p>
                      <p className="text-sm text-muted-foreground">2 chamados em andamento</p>
                    </div>
                    <div className="px-2 py-1 rounded bg-yellow-50 text-yellow-700 text-xs font-medium">
                      Ocupado
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Técnico B</p>
                      <p className="text-sm text-muted-foreground">1 chamado em andamento</p>
                    </div>
                    <div className="px-2 py-1 rounded bg-yellow-50 text-yellow-700 text-xs font-medium">
                      Ocupado
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Técnico C</p>
                      <p className="text-sm text-muted-foreground">Sem chamados</p>
                    </div>
                    <div className="px-2 py-1 rounded bg-green-50 text-green-700 text-xs font-medium">
                      Disponível
                    </div>
                  </div>
                  
                  <Button variant="outline" className="w-full mt-2">Ver Escala</Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Estatísticas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Tempo médio de atendimento</p>
                    <p className="text-xl font-medium">24 horas</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Chamados concluídos (Abril)</p>
                    <p className="text-xl font-medium">42</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Satisfação do cliente</p>
                    <p className="text-xl font-medium">4.8 / 5.0</p>
                  </div>
                  
                  <Button variant="outline" className="w-full mt-2">Ver Relatório</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LogisticsRequests;
