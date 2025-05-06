
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
  Building, 
  Package2, 
  ArrowUpDown, 
  Users,
  PlusCircle
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
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Mock client machines data
  const clientMachinesData = [
    {
      id: "CM001",
      name: "Terminal POS-X1",
      model: "POS-X1",
      serial: "SER123456",
      status: "operating",
      installDate: "2025-01-15T09:30:00",
      lastMaintenance: "2025-04-02T09:30:00",
      nextMaintenance: "2025-07-02T09:30:00",
      client: {
        id: "C001",
        name: "Restaurante Sabores",
        address: "Rua das Flores, 123",
        city: "São Paulo",
        state: "SP",
        contactName: "Maria Silva",
        phone: "(11) 98765-4321"
      }
    },
    {
      id: "CM002",
      name: "Terminal POS-X2",
      model: "POS-X2",
      serial: "SER234567",
      status: "operating",
      installDate: "2025-02-10T14:45:00",
      lastMaintenance: "2025-05-01T14:45:00",
      nextMaintenance: "2025-08-01T14:45:00",
      client: {
        id: "C002",
        name: "Café Central",
        address: "Av. Paulista, 1000",
        city: "São Paulo",
        state: "SP",
        contactName: "João Santos",
        phone: "(11) 91234-5678"
      }
    },
    {
      id: "CM003",
      name: "Terminal POS-X1",
      model: "POS-X1",
      serial: "SER345678",
      status: "in_maintenance",
      installDate: "2024-11-05T11:20:00",
      lastMaintenance: "2025-04-28T11:20:00",
      nextMaintenance: "2025-07-28T11:20:00",
      client: {
        id: "C003",
        name: "Sorveteria Gelatto",
        address: "Rua Augusta, 500",
        city: "São Paulo",
        state: "SP",
        contactName: "Ana Oliveira",
        phone: "(11) 99876-5432"
      }
    },
    {
      id: "CM004",
      name: "Terminal POS-X3",
      model: "POS-X3",
      serial: "SER456789",
      status: "operating",
      installDate: "2025-03-12T10:10:00",
      lastMaintenance: "2025-05-03T10:10:00",
      nextMaintenance: "2025-08-03T10:10:00",
      client: {
        id: "C004",
        name: "Farmácia Saúde",
        address: "Av. Brasil, 200",
        city: "Rio de Janeiro",
        state: "RJ",
        contactName: "Carlos Lima",
        phone: "(21) 98765-4321"
      }
    },
    {
      id: "CM005",
      name: "Terminal POS-X2",
      model: "POS-X2",
      serial: "SER567890",
      status: "operating",
      installDate: "2025-02-20T16:30:00",
      lastMaintenance: "2025-05-02T16:30:00",
      nextMaintenance: "2025-08-02T16:30:00",
      client: {
        id: "C005",
        name: "Mercado Geral",
        address: "Rua dos Pinheiros, 300",
        city: "São Paulo",
        state: "SP",
        contactName: "Paulo Mendes",
        phone: "(11) 97654-3210"
      }
    },
    {
      id: "CM006",
      name: "Terminal POS-X3",
      model: "POS-X3",
      serial: "SER678901",
      status: "needs_maintenance",
      installDate: "2024-12-05T14:20:00",
      lastMaintenance: "2025-03-05T14:20:00",
      nextMaintenance: "2025-06-05T14:20:00",
      client: {
        id: "C001",
        name: "Restaurante Sabores",
        address: "Rua das Flores, 123",
        city: "São Paulo",
        state: "SP",
        contactName: "Maria Silva",
        phone: "(11) 98765-4321"
      }
    },
    {
      id: "CM007",
      name: "Terminal POS-X1",
      model: "POS-X1",
      serial: "SER789012",
      status: "operating",
      installDate: "2025-01-28T09:15:00",
      lastMaintenance: "2025-04-28T09:15:00",
      nextMaintenance: "2025-07-28T09:15:00",
      client: {
        id: "C006",
        name: "Padaria Pão Quente",
        address: "Rua dos Padeiros, 45",
        city: "São Paulo",
        state: "SP",
        contactName: "Roberto Alves",
        phone: "(11) 98123-4567"
      }
    }
  ];

  // Get unique clients for filter
  const clients = [...new Set(clientMachinesData.map(item => item.client.name))];

  // Filter data based on search term and filters
  const filteredMachines = clientMachinesData.filter(machine => {
    const matchesSearch = 
      machine.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      machine.serial.toLowerCase().includes(searchTerm.toLowerCase()) ||
      machine.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      machine.client.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesClient = clientFilter === "all" || machine.client.name === clientFilter;
    const matchesStatus = statusFilter === "all" || machine.status === statusFilter;
    
    return matchesSearch && matchesClient && matchesStatus;
  });

  // Helper for status badges
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "operating":
        return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">Operando</Badge>;
      case "in_maintenance":
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Em Manutenção</Badge>;
      case "needs_maintenance":
        return <Badge variant="outline" className="bg-orange-100 text-orange-800 hover:bg-orange-100">Requer Manutenção</Badge>;
      case "inactive":
        return <Badge variant="outline" className="bg-gray-100 text-gray-800 hover:bg-gray-100">Inativo</Badge>;
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
        description: "Os dados das máquinas foram atualizados com sucesso.",
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
      id: "name",
      header: "Máquina",
      accessorKey: "name",
    },
    {
      id: "serial",
      header: "Número Serial",
      accessorKey: "serial",
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
      id: "lastMaintenance",
      header: "Última Manutenção",
      cell: ({ row }: { row: { original: any } }) => new Date(row.original.lastMaintenance).toLocaleDateString('pt-BR'),
    },
    {
      id: "actions",
      header: "Ações",
      cell: () => (
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => toast({
            title: "Detalhes",
            description: "Funcionalidade em desenvolvimento",
          })}>
            Detalhes
          </Button>
          <Button variant="outline" size="sm" onClick={() => toast({
            title: "Solicitar Manutenção",
            description: "Funcionalidade em desenvolvimento",
          })}>
            Manutenção
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <PageHeader 
        title="Máquinas em Clientes" 
        description="Gerenciamento das máquinas instaladas em estabelecimentos"
        actionLabel="Nova Instalação"
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
                  placeholder="Buscar por cliente, máquina ou serial"
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="w-full sm:w-64">
                <Select defaultValue={clientFilter} onValueChange={setClientFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Clientes</SelectItem>
                    {clients.map(client => (
                      <SelectItem key={client} value={client}>{client}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="w-full sm:w-48">
                <Select defaultValue={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="operating">Operando</SelectItem>
                    <SelectItem value="in_maintenance">Em Manutenção</SelectItem>
                    <SelectItem value="needs_maintenance">Requer Manutenção</SelectItem>
                    <SelectItem value="inactive">Inativo</SelectItem>
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
              <CardTitle>Máquinas Instaladas</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => toast({
                  title: "Funcionalidade em desenvolvimento",
                  description: "Esta funcionalidade estará disponível em breve."
                })}>
                  <Package2 className="h-4 w-4 mr-2" />
                  Transferir Máquina
                </Button>
                <Button variant="outline" size="sm" onClick={() => toast({
                  title: "Funcionalidade em desenvolvimento",
                  description: "Esta funcionalidade estará disponível em breve."
                })}>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Nova Instalação
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
