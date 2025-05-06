
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
  PlusCircle 
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

const Inventory = () => {
  const [activeTab, setActiveTab] = useState("machines");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(false);

  // Mock inventory data
  const machinesData = [
    {
      id: "M001",
      name: "Terminal POS-X1",
      serial: "SER293847",
      status: "available",
      location: "Depósito Central",
      lastUpdated: "2025-04-30T14:30:00"
    },
    {
      id: "M002",
      name: "Terminal POS-X1",
      serial: "SER293848",
      status: "reserved",
      location: "Depósito Central",
      lastUpdated: "2025-05-01T10:15:00"
    },
    {
      id: "M003",
      name: "Terminal POS-X2",
      serial: "SER345678",
      status: "in_maintenance",
      location: "Centro de Manutenção",
      lastUpdated: "2025-04-25T09:20:00"
    },
    {
      id: "M004",
      name: "Terminal POS-X3",
      serial: "SER456789",
      status: "available",
      location: "Depósito Sul",
      lastUpdated: "2025-05-02T16:40:00"
    },
    {
      id: "M005",
      name: "Terminal POS-X2",
      serial: "SER345679",
      status: "reserved",
      location: "Depósito Norte",
      lastUpdated: "2025-05-01T11:30:00"
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
    
    return matchesSearch && matchesStatus;
  });

  const filteredSupplies = suppliesData.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
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
    }, 1000);
  };

  return (
    <>
      <PageHeader 
        title="Inventário" 
        description="Gerenciamento de máquinas e suprimentos em estoque"
        actionLabel="Adicionar Item"
        onActionClick={() => alert("Funcionalidade em desenvolvimento")}
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
                    </SelectContent>
                  </Select>
                </div>
              )}
              
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
            <TabsTrigger value="machines">Máquinas</TabsTrigger>
            <TabsTrigger value="supplies">Suprimentos</TabsTrigger>
          </TabsList>
          
          <TabsContent value="machines">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Inventário de Máquinas</CardTitle>
                  <Button variant="outline" size="sm">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Nova Máquina
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">ID</TableHead>
                      <TableHead>
                        <div className="flex items-center">
                          Máquina
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead>Número Serial</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Localização</TableHead>
                      <TableHead>Última Atualização</TableHead>
                      <TableHead className="w-[100px]">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMachines.length > 0 ? (
                      filteredMachines.map((machine) => (
                        <TableRow key={machine.id}>
                          <TableCell className="font-medium">{machine.id}</TableCell>
                          <TableCell>{machine.name}</TableCell>
                          <TableCell>{machine.serial}</TableCell>
                          <TableCell>{getStatusBadge(machine.status)}</TableCell>
                          <TableCell>{machine.location}</TableCell>
                          <TableCell>{new Date(machine.lastUpdated).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })}</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm">
                              Detalhes
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-4">
                          <div className="flex flex-col items-center gap-2">
                            <Package2 className="h-8 w-8 text-muted-foreground" />
                            <p className="text-muted-foreground">Nenhuma máquina encontrada</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="supplies">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Inventário de Suprimentos</CardTitle>
                  <Button variant="outline" size="sm">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Novo Suprimento
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">ID</TableHead>
                      <TableHead>
                        <div className="flex items-center">
                          Nome
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead>Quantidade</TableHead>
                      <TableHead>Localização</TableHead>
                      <TableHead>Última Atualização</TableHead>
                      <TableHead className="w-[100px]">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSupplies.length > 0 ? (
                      filteredSupplies.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.id}</TableCell>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{item.sku}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>{item.location}</TableCell>
                          <TableCell>{new Date(item.lastUpdated).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })}</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm">
                              Detalhes
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-4">
                          <div className="flex flex-col items-center gap-2">
                            <Package2 className="h-8 w-8 text-muted-foreground" />
                            <p className="text-muted-foreground">Nenhum suprimento encontrado</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </PageWrapper>
    </>
  );
};

export default Inventory;
