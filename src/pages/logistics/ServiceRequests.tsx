
import { useState } from "react";
import { PageHeader } from "@/components/page/PageHeader";
import { PageWrapper } from "@/components/page/PageWrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  RefreshCw, 
  Filter, 
  ArrowUpDown,
  Clock, 
  CheckCircle,
  XCircle
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const ServiceRequests = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Mock service request data
  const serviceRequestsData = [
    {
      id: "SR001",
      type: "maintenance",
      status: "pending",
      requestDate: "2025-05-01T10:30:00",
      client: {
        id: "C001",
        name: "Restaurante Sabores",
        address: "Rua das Flores, 123",
        city: "São Paulo",
        state: "SP",
        contactName: "Maria Silva",
        phone: "(11) 98765-4321"
      },
      machine: {
        id: "M001",
        model: "POS-X1",
        serial: "SER123456"
      },
      description: "Terminal apresentando lentidão no processamento de pagamentos",
      priority: "medium"
    },
    {
      id: "SR002",
      type: "paper_roll",
      status: "approved",
      requestDate: "2025-05-02T14:15:00",
      client: {
        id: "C002",
        name: "Café Central",
        address: "Av. Paulista, 1000",
        city: "São Paulo",
        state: "SP",
        contactName: "João Santos",
        phone: "(11) 91234-5678"
      },
      machine: {
        id: "M002",
        model: "POS-X2",
        serial: "SER234567"
      },
      description: "Solicitação de 10 unidades de bobinas para terminal",
      priority: "low"
    },
    {
      id: "SR003",
      type: "relocation",
      status: "completed",
      requestDate: "2025-04-28T09:15:00",
      client: {
        id: "C003",
        name: "Sorveteria Gelatto",
        address: "Rua Augusta, 500",
        city: "São Paulo",
        state: "SP",
        contactName: "Ana Oliveira",
        phone: "(11) 99876-5432"
      },
      machine: {
        id: "M003",
        model: "POS-X1",
        serial: "SER345678"
      },
      description: "Transferência de terminal para nova filial",
      priority: "high"
    },
    {
      id: "SR004",
      type: "new_machine",
      status: "pending",
      requestDate: "2025-05-03T11:30:00",
      client: {
        id: "C004",
        name: "Farmácia Saúde",
        address: "Av. Brasil, 200",
        city: "Rio de Janeiro",
        state: "RJ",
        contactName: "Carlos Lima",
        phone: "(21) 98765-4321"
      },
      machine: null,
      description: "Solicitação de nova máquina para caixa rápido",
      priority: "high"
    },
    {
      id: "SR005",
      type: "maintenance",
      status: "rejected",
      requestDate: "2025-04-30T16:45:00",
      client: {
        id: "C005",
        name: "Mercado Geral",
        address: "Rua dos Pinheiros, 300",
        city: "São Paulo",
        state: "SP",
        contactName: "Paulo Mendes",
        phone: "(11) 97654-3210"
      },
      machine: {
        id: "M005",
        model: "POS-X2",
        serial: "SER567890"
      },
      description: "Reparo de tela de terminal com defeito",
      priority: "medium"
    },
    {
      id: "SR006",
      type: "paper_roll",
      status: "pending",
      requestDate: "2025-05-03T13:20:00",
      client: {
        id: "C001",
        name: "Restaurante Sabores",
        address: "Rua das Flores, 123",
        city: "São Paulo",
        state: "SP",
        contactName: "Maria Silva",
        phone: "(11) 98765-4321"
      },
      machine: {
        id: "M006",
        model: "POS-X3",
        serial: "SER678901"
      },
      description: "Solicitação de 5 bobinas para terminal",
      priority: "low"
    }
  ];

  // Filter data based on search term and filters
  const filteredRequests = serviceRequestsData.filter(request => {
    const matchesSearch = 
      request.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
      request.client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (request.machine && request.machine.serial.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = typeFilter === "all" || request.type === typeFilter;
    const matchesStatus = statusFilter === "all" || request.status === statusFilter;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  // Helper for request type badges
  const getRequestTypeBadge = (type: string) => {
    switch (type) {
      case "maintenance":
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Manutenção</Badge>;
      case "paper_roll":
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">Bobina</Badge>;
      case "relocation":
        return <Badge variant="outline" className="bg-purple-100 text-purple-800 hover:bg-purple-100">Relocação</Badge>;
      case "new_machine":
        return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">Nova Máquina</Badge>;
      default:
        return <Badge variant="outline">Outro</Badge>;
    }
  };

  // Helper for status badges
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-orange-100 text-orange-800 hover:bg-orange-100">Pendente</Badge>;
      case "approved":
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">Aprovado</Badge>;
      case "completed":
        return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">Concluído</Badge>;
      case "rejected":
        return <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">Rejeitado</Badge>;
      default:
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };

  // Helper for priority badges
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">Alta</Badge>;
      case "medium":
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Média</Badge>;
      case "low":
        return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">Baixa</Badge>;
      default:
        return <Badge variant="outline">Normal</Badge>;
    }
  };

  // Handle refresh data
  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Dados atualizados",
        description: "Os dados das solicitações foram atualizados com sucesso.",
      });
    }, 1000);
  };

  const columns = [
    {
      id: "id",
      header: "ID",
      accessorKey: "id",
    },
    {
      id: "type",
      header: "Tipo",
      cell: ({ row }: { row: { original: any } }) => getRequestTypeBadge(row.original.type),
    },
    {
      id: "client",
      header: "Cliente",
      cell: ({ row }: { row: { original: any } }) => (
        <div className="flex flex-col">
          <span className="font-medium">{row.original.client.name}</span>
          <span className="text-xs text-muted-foreground">{row.original.client.city}, {row.original.client.state}</span>
        </div>
      ),
    },
    {
      id: "machine",
      header: "Máquina",
      cell: ({ row }: { row: { original: any } }) => (
        row.original.machine ? (
          <span>{row.original.machine.model} ({row.original.machine.serial})</span>
        ) : (
          <span className="text-muted-foreground">N/A</span>
        )
      ),
    },
    {
      id: "requestDate",
      header: "Data",
      cell: ({ row }: { row: { original: any } }) => new Date(row.original.requestDate).toLocaleDateString('pt-BR'),
    },
    {
      id: "priority",
      header: "Prioridade",
      cell: ({ row }: { row: { original: any } }) => getPriorityBadge(row.original.priority),
    },
    {
      id: "status",
      header: "Status",
      cell: ({ row }: { row: { original: any } }) => getStatusBadge(row.original.status),
    },
    {
      id: "actions",
      header: "Ações",
      cell: ({ row }: { row: { original: any } }) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => toast({
            title: "Detalhes",
            description: "Funcionalidade em desenvolvimento",
          })}>
            Detalhes
          </Button>
          {row.original.status === "pending" && (
            <>
              <Button variant="outline" size="sm" className="text-green-600" onClick={() => toast({
                title: "Aprovar Solicitação",
                description: "Solicitação aprovada com sucesso!",
              })}>
                <CheckCircle className="h-3.5 w-3.5 mr-1" />
                Aprovar
              </Button>
              <Button variant="outline" size="sm" className="text-red-600" onClick={() => toast({
                title: "Rejeitar Solicitação",
                description: "Solicitação rejeitada com sucesso!",
              })}>
                <XCircle className="h-3.5 w-3.5 mr-1" />
                Rejeitar
              </Button>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      <PageHeader 
        title="Solicitações de Serviço" 
        description="Gerencie solicitações de manutenção, bobinas e novas máquinas"
        actionLabel="Nova Solicitação"
        onActionClick={() => toast({
          title: "Funcionalidade em desenvolvimento",
          description: "Esta funcionalidade estará disponível em breve."
        })}
      />
      
      <PageWrapper>
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle>Filtros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por ID, cliente ou serial"
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="w-full sm:w-48">
                <Select defaultValue={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Tipos</SelectItem>
                    <SelectItem value="maintenance">Manutenção</SelectItem>
                    <SelectItem value="paper_roll">Bobina</SelectItem>
                    <SelectItem value="relocation">Relocação</SelectItem>
                    <SelectItem value="new_machine">Nova Máquina</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="w-full sm:w-48">
                <Select defaultValue={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos Status</SelectItem>
                    <SelectItem value="pending">Pendente</SelectItem>
                    <SelectItem value="approved">Aprovado</SelectItem>
                    <SelectItem value="completed">Concluído</SelectItem>
                    <SelectItem value="rejected">Rejeitado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button 
                variant="outline" 
                onClick={handleRefresh}
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Atualizar
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Solicitações</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable 
              columns={columns} 
              data={filteredRequests}
              isLoading={isLoading}
            />
          </CardContent>
        </Card>
      </PageWrapper>
    </>
  );
};

export default ServiceRequests;
