
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
  Package, 
  Building2,
  Wrench,
  Calendar,
  ArrowUpDown,
  Clock,
  FilterX
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const ClientMachines = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [clientFilter, setClientFilter] = useState("all");
  const [modelFilter, setModelFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Mock client machines data
  const clientMachinesData = [
    {
      id: "CM001",
      model: "POS-X1",
      serial: "SER293847",
      status: "active",
      client: "Restaurante Sabores",
      location: "São Paulo, SP",
      installDate: "2025-01-15T10:30:00",
      lastService: "2025-03-30T14:30:00"
    },
    {
      id: "CM002",
      model: "POS-X1",
      serial: "SER293850",
      status: "active",
      client: "Café Central",
      location: "São Paulo, SP",
      installDate: "2025-02-20T11:15:00",
      lastService: "2025-04-25T09:45:00"
    },
    {
      id: "CM003",
      model: "POS-X2",
      serial: "SER345681",
      status: "maintenance",
      client: "Farmácia Saúde",
      location: "Rio de Janeiro, RJ",
      installDate: "2025-03-10T09:00:00",
      lastService: "2025-05-01T16:30:00"
    },
    {
      id: "CM004",
      model: "POS-X3",
      serial: "SER456791",
      status: "active",
      client: "Sorveteria Gelatto",
      location: "Belo Horizonte, MG",
      installDate: "2025-01-05T14:30:00",
      lastService: "2025-03-15T10:30:00"
    },
    {
      id: "CM005",
      model: "POS-X2",
      serial: "SER345682",
      status: "inactive",
      client: "Mercado Geral",
      location: "Curitiba, PR",
      installDate: "2024-12-10T13:15:00",
      lastService: "2025-02-20T15:45:00"
    },
    {
      id: "CM006",
      model: "POS-X1",
      serial: "SER293851",
      status: "active",
      client: "Restaurante Sabores",
      location: "São Paulo, SP",
      installDate: "2025-03-25T10:45:00",
      lastService: "2025-04-30T11:30:00"
    },
    {
      id: "CM007",
      model: "POS-X3",
      serial: "SER456792",
      status: "maintenance",
      client: "Padaria Trigo",
      location: "Brasília, DF",
      installDate: "2025-02-15T09:30:00",
      lastService: "2025-04-15T14:00:00"
    },
    {
      id: "CM008",
      model: "POS-X2",
      serial: "SER345683",
      status: "active",
      client: "Livraria Leitura",
      location: "Salvador, BA",
      installDate: "2025-01-20T11:00:00",
      lastService: "2025-03-25T13:30:00"
    }
  ];

  // Get unique clients, models, and statuses for filters
  const clients = [...new Set(clientMachinesData.map(item => item.client))];
  const models = [...new Set(clientMachinesData.map(item => item.model))];

  // Filter data based on search term and filters
  const filteredMachines = clientMachinesData.filter(machine => {
    const matchesSearch = 
      machine.model.toLowerCase().includes(searchTerm.toLowerCase()) || 
      machine.serial.toLowerCase().includes(searchTerm.toLowerCase()) ||
      machine.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      machine.client.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesClient = clientFilter === "all" || machine.client === clientFilter;
    const matchesModel = modelFilter === "all" || machine.model === modelFilter;
    const matchesStatus = statusFilter === "all" || machine.status === statusFilter;
    
    return matchesSearch && matchesClient && matchesModel && matchesStatus;
  });

  // Helper for status badges
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">Ativo</Badge>;
      case "inactive":
        return <Badge variant="outline" className="bg-gray-100 text-gray-800 hover:bg-gray-100">Inativo</Badge>;
      case "maintenance":
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Em Manutenção</Badge>;
      default:
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };

  // Handle refresh data
  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Dados atualizados",
        description: "Os dados de máquinas de clientes foram atualizados com sucesso.",
      });
    }, 1000);
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setClientFilter("all");
    setModelFilter("all");
    setStatusFilter("all");
  };

  const columns = [
    {
      id: "id",
      header: "ID",
      accessorKey: "id",
    },
    {
      id: "client",
      header: "Cliente",
      accessorKey: "client",
    },
    {
      id: "location",
      header: "Localização",
      accessorKey: "location",
    },
    {
      id: "model",
      header: "Modelo",
      accessorKey: "model",
    },
    {
      id: "serial",
      header: "Número Serial",
      accessorKey: "serial",
    },
    {
      id: "status",
      header: "Status",
      cell: ({ row }: { row: { original: any } }) => getStatusBadge(row.original.status),
    },
    {
      id: "installDate",
      header: "Data de Instalação",
      cell: ({ row }: { row: { original: any } }) => new Date(row.original.installDate).toLocaleDateString('pt-BR'),
    },
    {
      id: "lastService",
      header: "Último Serviço",
      cell: ({ row }: { row: { original: any } }) => new Date(row.original.lastService).toLocaleDateString('pt-BR'),
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
          <Button variant="outline" size="sm" onClick={() => toast({
            title: "Agendar Manutenção",
            description: "Funcionalidade em desenvolvimento",
          })}>
            <Wrench className="h-3.5 w-3.5 mr-1" />
            Manutenção
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <PageHeader 
        title="Máquinas de Clientes" 
        description="Gerenciamento das máquinas instaladas em clientes"
      />
      
      <PageWrapper>
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle>Filtros</CardTitle>
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <FilterX className="h-4 w-4 mr-2" />
                Limpar Filtros
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por cliente, modelo, serial ou ID"
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="w-full sm:w-48">
                <Select defaultValue={clientFilter} onValueChange={setClientFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    {clients.map(client => (
                      <SelectItem key={client} value={client}>{client}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="w-full sm:w-40">
                <Select defaultValue={modelFilter} onValueChange={setModelFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Modelo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    {models.map(model => (
                      <SelectItem key={model} value={model}>{model}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="w-full sm:w-40">
                <Select defaultValue={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="active">Ativo</SelectItem>
                    <SelectItem value="inactive">Inativo</SelectItem>
                    <SelectItem value="maintenance">Em Manutenção</SelectItem>
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
            <div className="flex justify-between items-center">
              <CardTitle>Máquinas Instaladas em Clientes</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => toast({
                  title: "Agendamentos",
                  description: "Funcionalidade em desenvolvimento",
                })}>
                  <Calendar className="h-4 w-4 mr-2" />
                  Agendamentos
                </Button>
                <Button variant="outline" size="sm" onClick={() => toast({
                  title: "Histórico de Serviços",
                  description: "Funcionalidade em desenvolvimento",
                })}>
                  <Clock className="h-4 w-4 mr-2" />
                  Histórico
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <DataTable 
              columns={columns} 
              data={filteredMachines}
              isLoading={isLoading}
            />
          </CardContent>
        </Card>
      </PageWrapper>
    </>
  );
};

export default ClientMachines;
