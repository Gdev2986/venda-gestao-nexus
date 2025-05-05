
import { useState } from "react";
import { PageHeader } from "@/components/page/PageHeader";
import { PageWrapper } from "@/components/page/PageWrapper";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Check, Search, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock data
const mockRequests = [
  {
    id: "REQ-001",
    client: "Restaurante Sabores",
    contact: "contato@restaurantesabores.com",
    type: "Troca de máquina",
    created_at: "20/04/2025",
    scheduled_for: "23/04/2025 10:00",
    status: "Pendente",
    priority: "Alta",
    address: "Rua das Flores, 123 - Centro"
  },
  {
    id: "REQ-002",
    client: "Mercado Central",
    contact: "suporte@mercadocentral.com",
    type: "Bobinas",
    created_at: "19/04/2025",
    scheduled_for: "21/04/2025 14:30",
    status: "Em andamento",
    priority: "Média",
    address: "Av. Principal, 500 - Zona Norte"
  },
  {
    id: "REQ-003",
    client: "Farmácia Popular",
    contact: "atendimento@farmáciapopular.com",
    type: "Instalação",
    created_at: "18/04/2025",
    scheduled_for: "24/04/2025 09:15",
    status: "Confirmado",
    priority: "Normal",
    address: "Rua Saúde, 780 - Jardim das Flores"
  },
  {
    id: "REQ-004",
    client: "Café Expresso",
    contact: "gerente@cafeexpresso.com",
    type: "Manutenção",
    created_at: "17/04/2025",
    scheduled_for: "22/04/2025 15:45",
    status: "Pendente",
    priority: "Urgente",
    address: "Av. das Palmeiras, 321 - Centro"
  },
  {
    id: "REQ-005",
    client: "Loja de Roupas Fashion",
    contact: "atendimento@fashion.com",
    type: "Troca de máquina",
    created_at: "16/04/2025",
    scheduled_for: "25/04/2025 13:20",
    status: "Confirmado",
    priority: "Média",
    address: "Shopping Central, Loja 45 - Piso L3"
  },
];

const LogisticsRequests = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  
  // Filter requests
  const filteredRequests = mockRequests.filter(request => {
    const matchesSearch = 
      request.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.address.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      statusFilter === "all" ||
      request.status.toLowerCase() === statusFilter.toLowerCase();
    
    const matchesType = 
      typeFilter === "all" ||
      request.type.toLowerCase().includes(typeFilter.toLowerCase());
    
    return matchesSearch && matchesStatus && matchesType;
  });
  
  const handleViewDetails = (request: any) => {
    setSelectedRequest(request);
    setIsDetailsDialogOpen(true);
  };
  
  const handleUpdateStatus = (status: string) => {
    toast({
      title: "Status atualizado",
      description: `Solicitação ${selectedRequest.id} atualizada para ${status}`,
    });
    setIsDetailsDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Solicitações de Clientes"
        description="Gerencie as solicitações de instalação, manutenção e troca de máquinas"
      />
      
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por cliente, ID ou endereço..."
            className="pl-8 bg-background"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos Status</SelectItem>
              <SelectItem value="pendente">Pendente</SelectItem>
              <SelectItem value="confirmado">Confirmado</SelectItem>
              <SelectItem value="em andamento">Em andamento</SelectItem>
              <SelectItem value="concluído">Concluído</SelectItem>
              <SelectItem value="cancelado">Cancelado</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Tipo de Solicitação" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos Tipos</SelectItem>
              <SelectItem value="troca">Troca de Máquina</SelectItem>
              <SelectItem value="instalação">Instalação</SelectItem>
              <SelectItem value="manutenção">Manutenção</SelectItem>
              <SelectItem value="bobinas">Bobinas</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline">Filtrar</Button>
        </div>
      </div>
      
      <PageWrapper>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Data Criação</TableHead>
              <TableHead>Agendado para</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Prioridade</TableHead>
              <TableHead className="w-[150px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRequests.map((request, i) => (
              <TableRow key={i}>
                <TableCell>{request.id}</TableCell>
                <TableCell className="font-medium">{request.client}</TableCell>
                <TableCell>
                  <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                    request.type === "Instalação" ? "bg-green-50 text-green-700" : 
                    request.type === "Manutenção" ? "bg-orange-50 text-orange-700" : 
                    request.type === "Troca de máquina" ? "bg-purple-50 text-purple-700" :
                    request.type === "Bobinas" ? "bg-blue-50 text-blue-700" :
                    "bg-gray-50 text-gray-700"
                  }`}>
                    {request.type}
                  </span>
                </TableCell>
                <TableCell>{request.created_at}</TableCell>
                <TableCell>{request.scheduled_for}</TableCell>
                <TableCell>
                  <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                    request.status === "Pendente" ? "bg-yellow-50 text-yellow-700" : 
                    request.status === "Confirmado" ? "bg-indigo-50 text-indigo-700" : 
                    request.status === "Em andamento" ? "bg-green-50 text-green-700" :
                    request.status === "Concluído" ? "bg-blue-50 text-blue-700" :
                    "bg-red-50 text-red-700"
                  }`}>
                    {request.status}
                  </span>
                </TableCell>
                <TableCell>
                  <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                    request.priority === "Urgente" ? "bg-red-50 text-red-700" : 
                    request.priority === "Alta" ? "bg-orange-50 text-orange-700" : 
                    request.priority === "Média" ? "bg-yellow-50 text-yellow-700" :
                    "bg-green-50 text-green-700"
                  }`}>
                    {request.priority}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewDetails(request)}
                    >
                      Detalhes
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-green-600"
                      onClick={() => {
                        toast({
                          title: "Status atualizado",
                          description: `Solicitação ${request.id} foi marcada como concluída`,
                        });
                      }}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </PageWrapper>
      
      {/* Request Details Dialog */}
      {selectedRequest && (
        <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Detalhes da Solicitação</DialogTitle>
              <DialogDescription>
                {selectedRequest.id} - {selectedRequest.client}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Cliente</h3>
                  <p className="text-base">{selectedRequest.client}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Contato</h3>
                  <p className="text-base">{selectedRequest.contact}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Tipo de Solicitação</h3>
                  <p className="text-base">
                    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                      selectedRequest.type === "Instalação" ? "bg-green-50 text-green-700" : 
                      selectedRequest.type === "Manutenção" ? "bg-orange-50 text-orange-700" : 
                      selectedRequest.type === "Troca de máquina" ? "bg-purple-50 text-purple-700" :
                      "bg-blue-50 text-blue-700"
                    }`}>
                      {selectedRequest.type}
                    </span>
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                  <p className="text-base">
                    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                      selectedRequest.status === "Pendente" ? "bg-yellow-50 text-yellow-700" : 
                      selectedRequest.status === "Confirmado" ? "bg-indigo-50 text-indigo-700" : 
                      selectedRequest.status === "Em andamento" ? "bg-green-50 text-green-700" :
                      "bg-gray-50 text-gray-700"
                    }`}>
                      {selectedRequest.status}
                    </span>
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Data da Solicitação</h3>
                  <p className="text-base">{selectedRequest.created_at}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Data Agendada</h3>
                  <p className="text-base">{selectedRequest.scheduled_for}</p>
                </div>
                <div className="md:col-span-2">
                  <h3 className="text-sm font-medium text-muted-foreground">Endereço</h3>
                  <p className="text-base">{selectedRequest.address}</p>
                </div>
              </div>
              
              {selectedRequest.type === "Troca de máquina" && (
                <div className="space-y-2 border p-4 rounded-md">
                  <h3 className="text-sm font-medium">Informações da Máquina Atual</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Serial</p>
                      <p className="text-sm">SN-98765</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Modelo</p>
                      <p className="text-sm">Terminal Standard</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Motivo da Troca</p>
                      <p className="text-sm">Falha intermitente na leitura de cartão</p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Detalhes da Solicitação</h3>
                <Textarea 
                  readOnly 
                  value="O cliente relatou falhas intermitentes na leitura de cartões. Técnico deve levar terminal substituto e avaliar se o problema está no leitor ou na placa principal."
                />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Atualizar Status</h3>
                <Select defaultValue={selectedRequest.status.toLowerCase()}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pendente">Pendente</SelectItem>
                    <SelectItem value="confirmado">Confirmado</SelectItem>
                    <SelectItem value="em andamento">Em andamento</SelectItem>
                    <SelectItem value="concluído">Concluído</SelectItem>
                    <SelectItem value="cancelado">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Reagendar</h3>
                <div className="flex gap-4">
                  <Input type="date" className="flex-1" />
                  <Input type="time" className="w-32" />
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Adicionar Comentário</h3>
                <Textarea placeholder="Adicione informações ou instruções para esta solicitação" />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDetailsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button variant="destructive" onClick={() => handleUpdateStatus("cancelado")}>
                <X className="h-4 w-4 mr-2" />
                Cancelar Solicitação
              </Button>
              <Button onClick={() => handleUpdateStatus("confirmado")}>
                <Calendar className="h-4 w-4 mr-2" />
                Agendar
              </Button>
              <Button onClick={() => handleUpdateStatus("concluído")}>
                <Check className="h-4 w-4 mr-2" />
                Concluir
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default LogisticsRequests;
