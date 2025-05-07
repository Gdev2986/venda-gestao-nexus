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

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Solicitações" 
        description="Gerencie as solicitações de serviços"
        actionLabel="Nova Solicitação"
        actionOnClick={handleNewRequest}
      />
      
      <div className="flex items-center justify-between mb-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar solicitações..."
            className="pl-8 bg-background"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
      </div>
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-4">
          <TabsTrigger value="all" className="flex items-center gap-2">
            <FilterIcon size={16} />
            <span>Todas</span>
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
      </Tabs>
    </div>
  );
};

export default LogisticsRequests;
