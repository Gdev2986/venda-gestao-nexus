
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
  PlusCircle,
  Filter,
  ArrowUpDown,
  History,
  Truck
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const MachineStock = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [modelFilter, setModelFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Mock machine stock data
  const machineStockData = [
    {
      id: "MS001",
      model: "POS-X1",
      serial: "SER293847",
      status: "available",
      location: "Depósito Central",
      arrivalDate: "2025-03-30T14:30:00",
      lastChecked: "2025-04-30T14:30:00"
    },
    {
      id: "MS002",
      model: "POS-X1",
      serial: "SER293848",
      status: "reserved",
      location: "Depósito Central",
      arrivalDate: "2025-03-30T14:30:00",
      lastChecked: "2025-05-01T10:15:00"
    },
    {
      id: "MS003",
      model: "POS-X2",
      serial: "SER345678",
      status: "in_maintenance",
      location: "Centro de Manutenção",
      arrivalDate: "2025-02-15T09:30:00",
      lastChecked: "2025-04-25T09:20:00"
    },
    {
      id: "MS004",
      model: "POS-X3",
      serial: "SER456789",
      status: "available",
      location: "Depósito Sul",
      arrivalDate: "2025-04-15T11:30:00",
      lastChecked: "2025-05-02T16:40:00"
    },
    {
      id: "MS005",
      model: "POS-X2",
      serial: "SER345679",
      status: "reserved",
      location: "Depósito Norte",
      arrivalDate: "2025-03-20T10:15:00",
      lastChecked: "2025-05-01T11:30:00"
    },
    {
      id: "MS006",
      model: "POS-X1",
      serial: "SER293849",
      status: "available",
      location: "Depósito Central",
      arrivalDate: "2025-04-02T09:45:00",
      lastChecked: "2025-05-02T14:30:00"
    },
    {
      id: "MS007",
      model: "POS-X3",
      serial: "SER456790",
      status: "in_transit",
      location: "Em Trânsito",
      arrivalDate: "2025-04-25T14:30:00",
      lastChecked: "2025-05-03T10:15:00"
    },
    {
      id: "MS008",
      model: "POS-X2",
      serial: "SER345680",
      status: "available",
      location: "Depósito Central",
      arrivalDate: "2025-03-10T11:45:00",
      lastChecked: "2025-04-28T09:30:00"
    }
  ];

  // Get unique models and locations for filters
  const models = [...new Set(machineStockData.map(item => item.model))];
  const locations = [...new Set(machineStockData.map(item => item.location))];

  // Filter data based on search term and filters
  const filteredMachines = machineStockData.filter(machine => {
    const matchesSearch = 
      machine.model.toLowerCase().includes(searchTerm.toLowerCase()) || 
      machine.serial.toLowerCase().includes(searchTerm.toLowerCase()) ||
      machine.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesModel = modelFilter === "all" || machine.model === modelFilter;
    const matchesStatus = statusFilter === "all" || machine.status === statusFilter;
    const matchesLocation = locationFilter === "all" || machine.location === locationFilter;
    
    return matchesSearch && matchesModel && matchesStatus && matchesLocation;
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
        description: "Os dados de estoque foram atualizados com sucesso.",
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
      id: "location",
      header: "Localização",
      accessorKey: "location",
    },
    {
      id: "arrivalDate",
      header: "Data de Chegada",
      cell: ({ row }: { row: { original: any } }) => new Date(row.original.arrivalDate).toLocaleDateString('pt-BR'),
    },
    {
      id: "lastChecked",
      header: "Última Verificação",
      cell: ({ row }: { row: { original: any } }) => new Date(row.original.lastChecked).toLocaleDateString('pt-BR'),
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
            title: "Transferir",
            description: "Funcionalidade em desenvolvimento",
          })}>
            <Truck className="h-3.5 w-3.5 mr-1" />
            Transferir
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <PageHeader 
        title="Estoque de Máquinas" 
        description="Gerenciamento do estoque de máquinas disponíveis"
        actionLabel="Adicionar Máquina"
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
                  placeholder="Buscar por modelo, serial ou ID"
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
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
                    <SelectItem value="available">Disponível</SelectItem>
                    <SelectItem value="reserved">Reservado</SelectItem>
                    <SelectItem value="in_maintenance">Em Manutenção</SelectItem>
                    <SelectItem value="in_transit">Em Trânsito</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="w-full sm:w-52">
                <Select defaultValue={locationFilter} onValueChange={setLocationFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Localização" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    {locations.map(location => (
                      <SelectItem key={location} value={location}>{location}</SelectItem>
                    ))}
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
              <CardTitle>Máquinas em Estoque</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => toast({
                  title: "Funcionalidade em desenvolvimento",
                  description: "Esta funcionalidade estará disponível em breve."
                })}>
                  <History className="h-4 w-4 mr-2" />
                  Histórico
                </Button>
                <Button variant="outline" size="sm" onClick={() => toast({
                  title: "Funcionalidade em desenvolvimento",
                  description: "Esta funcionalidade estará disponível em breve."
                })}>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Nova Máquina
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

export default MachineStock;
