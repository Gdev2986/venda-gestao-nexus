
import { PageHeader } from "@/components/page/PageHeader";
import { PageWrapper } from "@/components/page/PageWrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Package2, 
  Search, 
  Filter, 
  RefreshCw, 
  CheckCircle2, 
  ArrowUpDown, 
  PlusCircle,
  Store,
  Users,
  Tag 
} from "lucide-react";
import { useState } from "react";
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
import { DataTable } from "@/components/ui/data-table";
import { useToast } from "@/hooks/use-toast";

const Inventory = () => {
  const [activeTab, setActiveTab] = useState("machines");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Mock inventory data
  const machinesData = [
    {
      id: "M001",
      name: "Terminal POS-X1",
      serial: "SER293847",
      status: "available",
      location: "Depósito Central",
      lastUpdated: "2025-04-30T14:30:00",
      client: null
    },
    {
      id: "M002",
      name: "Terminal POS-X1",
      serial: "SER293848",
      status: "reserved",
      location: "Depósito Central",
      lastUpdated: "2025-05-01T10:15:00",
      client: null
    },
    {
      id: "M003",
      name: "Terminal POS-X2",
      serial: "SER345678",
      status: "in_maintenance",
      location: "Centro de Manutenção",
      lastUpdated: "2025-04-25T09:20:00",
      client: null
    },
    {
      id: "M004",
      name: "Terminal POS-X3",
      serial: "SER456789",
      status: "available",
      location: "Depósito Sul",
      lastUpdated: "2025-05-02T16:40:00",
      client: null
    },
    {
      id: "M005",
      name: "Terminal POS-X2",
      serial: "SER345679",
      status: "reserved",
      location: "Depósito Norte",
      lastUpdated: "2025-05-01T11:30:00",
      client: null
    }
  ];

  // Mock client-linked machines
  const clientMachinesData = [
    {
      id: "CM001",
      name: "Terminal POS-X1",
      serial: "SER123456",
      status: "operating",
      location: "Estabelecimento Cliente",
      lastUpdated: "2025-05-02T09:30:00",
      client: {
        id: "C001",
        name: "Restaurante Sabores",
        address: "Rua das Flores, 123",
        city: "São Paulo",
        contactName: "Maria Silva",
        phone: "(11) 98765-4321"
      }
    },
    {
      id: "CM002",
      name: "Terminal POS-X2",
      serial: "SER234567",
      status: "operating",
      location: "Estabelecimento Cliente",
      lastUpdated: "2025-05-01T14:45:00",
      client: {
        id: "C002",
        name: "Café Central",
        address: "Av. Paulista, 1000",
        city: "São Paulo",
        contactName: "João Santos",
        phone: "(11) 91234-5678"
      }
    },
    {
      id: "CM003",
      name: "Terminal POS-X1",
      serial: "SER345678",
      status: "in_maintenance",
      location: "Centro de Manutenção",
      lastUpdated: "2025-04-28T11:20:00",
      client: {
        id: "C003",
        name: "Sorveteria Gelatto",
        address: "Rua Augusta, 500",
        city: "São Paulo",
        contactName: "Ana Oliveira",
        phone: "(11) 99876-5432"
      }
    },
    {
      id: "CM004",
      name: "Terminal POS-X3",
      serial: "SER456789",
      status: "operating",
      location: "Estabelecimento Cliente",
      lastUpdated: "2025-05-03T10:10:00",
      client: {
        id: "C004",
        name: "Farmácia Saúde",
        address: "Av. Brasil, 200",
        city: "Rio de Janeiro",
        contactName: "Carlos Lima",
        phone: "(21) 98765-4321"
      }
    },
    {
      id: "CM005",
      name: "Terminal POS-X2",
      serial: "SER567890",
      status: "operating",
      location: "Estabelecimento Cliente",
      lastUpdated: "2025-05-02T16:30:00",
      client: {
        id: "C005",
        name: "Mercado Geral",
        address: "Rua dos Pinheiros, 300",
        city: "São Paulo",
        contactName: "Paulo Mendes",
        phone: "(11) 97654-3210"
      }
    }
  ];

  const suppliesData = [
    {
      id: "S001",
      name: "Bobina Térmica 57mm",
      sku: "BOB-57-100",
      quantity: 500,
      location: "Depósito Central",
      lastUpdated: "2025-05-02T14:30:00"
    },
    {
      id: "S002",
      name: "Bobina Térmica 80mm",
      sku: "BOB-80-100",
      quantity: 350,
      location: "Depósito Central",
      lastUpdated: "2025-05-01T10:15:00"
    },
    {
      id: "S003",
      name: "Cabo de Alimentação",
      sku: "CAB-ALI-001",
      quantity: 120,
      location: "Depósito Sul",
      lastUpdated: "2025-04-28T09:20:00"
    },
    {
      id: "S004",
      name: "Fonte de Energia",
      sku: "FNT-POS-001",
      quantity: 75,
      location: "Depósito Central",
      lastUpdated: "2025-05-02T16:40:00"
    },
    {
      id: "S005",
      name: "Kit de Limpeza",
      sku: "KIT-LMP-001",
      quantity: 30,
      location: "Depósito Norte",
      lastUpdated: "2025-04-25T11:30:00"
    }
  ];

  // Filter data based on search term and filter
  const filteredMachines = machinesData.filter(machine => {
    const matchesSearch = 
      machine.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      machine.serial.toLowerCase().includes(searchTerm.toLowerCase()) ||
      machine.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || machine.status === statusFilter;
    const matchesLocation = locationFilter === "all" || machine.location === locationFilter;
    
    return matchesSearch && matchesStatus && matchesLocation;
  });

  const filteredClientMachines = clientMachinesData.filter(machine => {
    const matchesSearch = 
      machine.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      machine.serial.toLowerCase().includes(searchTerm.toLowerCase()) ||
      machine.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (machine.client && machine.client.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === "all" || machine.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const filteredSupplies = suppliesData.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLocation = locationFilter === "all" || item.location === locationFilter;
    
    return matchesSearch && matchesLocation;
  });

  // Helper for status badges
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "available":
        return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">Disponível</Badge>;
      case "reserved":
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">Reservado</Badge>;
      case "in_maintenance":
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Em Manutenção</Badge>;
      case "in_transit":
        return <Badge variant="outline" className="bg-purple-100 text-purple-800 hover:bg-purple-100">Em Trânsito</Badge>;
      case "operating":
        return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">Operando</Badge>;
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
        description: "Os dados de inventário foram atualizados com sucesso.",
      });
    }, 1000);
  };

  const machineColumns = [
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
      id: "status",
      header: "Status",
      cell: ({ row }: { row: { original: any } }) => getStatusBadge(row.original.status),
    },
    {
      id: "location",
      header: "Localização",
      accessorKey: "location",
    },
    {
      id: "lastUpdated",
      header: "Última Atualização",
      cell: ({ row }: { row: { original: any } }) => new Date(row.original.lastUpdated).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }),
    },
    {
      id: "actions",
      header: "Ações",
      cell: () => (
        <Button variant="ghost" size="sm">
          Detalhes
        </Button>
      ),
    },
  ];

  const clientMachineColumns = [
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
      cell: ({ row }: { row: { original: any } }) => row.original.client?.name || "N/A",
    },
    {
      id: "status",
      header: "Status",
      cell: ({ row }: { row: { original: any } }) => getStatusBadge(row.original.status),
    },
    {
      id: "lastUpdated",
      header: "Última Atualização",
      cell: ({ row }: { row: { original: any } }) => new Date(row.original.lastUpdated).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }),
    },
    {
      id: "actions",
      header: "Ações",
      cell: () => (
        <Button variant="ghost" size="sm">
          Detalhes
        </Button>
      ),
    },
  ];

  const supplyColumns = [
    {
      id: "id",
      header: "ID",
      accessorKey: "id",
    },
    {
      id: "name",
      header: "Nome",
      accessorKey: "name",
    },
    {
      id: "sku",
      header: "SKU",
      accessorKey: "sku",
    },
    {
      id: "quantity",
      header: "Quantidade",
      accessorKey: "quantity",
    },
    {
      id: "location",
      header: "Localização",
      accessorKey: "location",
    },
    {
      id: "lastUpdated",
      header: "Última Atualização",
      cell: ({ row }: { row: { original: any } }) => new Date(row.original.lastUpdated).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }),
    },
    {
      id: "actions",
      header: "Ações",
      cell: () => (
        <Button variant="ghost" size="sm">
          Detalhes
        </Button>
      ),
    },
  ];

  // Get unique locations for filter
  const locations = [...new Set([...machinesData, ...suppliesData].map(item => item.location))];

  return (
    <>
      <PageHeader 
        title="Inventário" 
        description="Gerenciamento de máquinas e suprimentos em estoque"
        actionLabel="Adicionar Item"
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
                  placeholder="Buscar por nome, código ou ID"
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              {activeTab === "machines" && (
                <div className="w-full sm:w-48">
                  <Select defaultValue={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="available">Disponível</SelectItem>
                      <SelectItem value="reserved">Reservado</SelectItem>
                      <SelectItem value="in_maintenance">Em Manutenção</SelectItem>
                      <SelectItem value="in_transit">Em Trânsito</SelectItem>
                      <SelectItem value="operating">Operando</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="w-full sm:w-48">
                <Select defaultValue={locationFilter} onValueChange={setLocationFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Localização" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    {locations.map(location => (
                      <SelectItem key={location} value={location}>{location}</SelectItem>
                    ))}
                    <SelectItem value="Estabelecimento Cliente">Estabelecimentos</SelectItem>
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

        <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="machines">
              <Package2 className="h-4 w-4 mr-2" />
              Máquinas em Estoque
            </TabsTrigger>
            <TabsTrigger value="client-machines">
              <Store className="h-4 w-4 mr-2" />
              Máquinas em Clientes
            </TabsTrigger>
            <TabsTrigger value="supplies">
              <Tag className="h-4 w-4 mr-2" />
              Suprimentos
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="machines">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Inventário de Máquinas</CardTitle>
                  <Button variant="outline" size="sm" onClick={() => toast({
                    title: "Funcionalidade em desenvolvimento",
                    description: "Esta funcionalidade estará disponível em breve."
                  })}>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Nova Máquina
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <DataTable 
                  columns={machineColumns} 
                  data={filteredMachines}
                  isLoading={isLoading}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="client-machines">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Máquinas em Clientes</CardTitle>
                  <Button variant="outline" size="sm" onClick={() => toast({
                    title: "Funcionalidade em desenvolvimento",
                    description: "Esta funcionalidade estará disponível em breve."
                  })}>
                    <Users className="h-4 w-4 mr-2" />
                    Vincular a Cliente
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <DataTable 
                  columns={clientMachineColumns} 
                  data={filteredClientMachines}
                  isLoading={isLoading}
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="supplies">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Inventário de Suprimentos</CardTitle>
                  <Button variant="outline" size="sm" onClick={() => toast({
                    title: "Funcionalidade em desenvolvimento",
                    description: "Esta funcionalidade estará disponível em breve."
                  })}>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Novo Suprimento
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <DataTable 
                  columns={supplyColumns} 
                  data={filteredSupplies}
                  isLoading={isLoading}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </PageWrapper>
    </>
  );
};

export default Inventory;
