
import { useState } from "react";
import { PageHeader } from "@/components/page/PageHeader";
import { PageWrapper } from "@/components/page/PageWrapper";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, BarChart, Box, CheckCircle2, PlusCircle, Search } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

// Define inventory item type
interface InventoryItem {
  id: string;
  name: string;
  model: string;
  category: string;
  status: "available" | "reserved" | "maintenance" | "broken";
  serialNumber: string;
  location: string;
  lastUpdated: string;
}

// Define inventory stats
interface InventoryStats {
  totalItems: number;
  availableItems: number;
  reservedItems: number;
  maintenanceItems: number;
  brokenItems: number;
}

const Inventory = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [newItemDialogOpen, setNewItemDialogOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState("inventory");

  // Mock inventory data
  const inventoryData: InventoryItem[] = [
    {
      id: "INV001",
      name: "Terminal de Pagamento A10",
      model: "A10",
      category: "terminal",
      status: "available",
      serialNumber: "SN-A10-001",
      location: "Estoque Central",
      lastUpdated: "2025-04-30"
    },
    {
      id: "INV002",
      name: "Terminal de Pagamento A10",
      model: "A10",
      category: "terminal",
      status: "reserved",
      serialNumber: "SN-A10-002",
      location: "Estoque Central",
      lastUpdated: "2025-05-01"
    },
    {
      id: "INV003",
      name: "Terminal de Pagamento B20",
      model: "B20",
      category: "terminal",
      status: "maintenance",
      serialNumber: "SN-B20-001",
      location: "Manutenção",
      lastUpdated: "2025-04-28"
    },
    {
      id: "INV004",
      name: "Bobina Térmica 80mm",
      model: "80mm",
      category: "supplies",
      status: "available",
      serialNumber: "N/A",
      location: "Estoque Central",
      lastUpdated: "2025-05-02"
    },
    {
      id: "INV005",
      name: "Terminal de Pagamento C30",
      model: "C30",
      category: "terminal",
      status: "broken",
      serialNumber: "SN-C30-001",
      location: "Descarte",
      lastUpdated: "2025-04-25"
    },
    {
      id: "INV006",
      name: "Bobina Térmica 57mm",
      model: "57mm",
      category: "supplies",
      status: "available",
      serialNumber: "N/A",
      location: "Estoque Central",
      lastUpdated: "2025-05-03"
    }
  ];

  // Calculate inventory stats
  const inventoryStats: InventoryStats = {
    totalItems: inventoryData.length,
    availableItems: inventoryData.filter(item => item.status === "available").length,
    reservedItems: inventoryData.filter(item => item.status === "reserved").length,
    maintenanceItems: inventoryData.filter(item => item.status === "maintenance").length,
    brokenItems: inventoryData.filter(item => item.status === "broken").length
  };

  // Filter inventory data based on search and filters
  const filteredInventory = inventoryData.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.model.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Format status for display
  const formatStatus = (status: string) => {
    switch (status) {
      case "available":
        return <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">Disponível</span>;
      case "reserved":
        return <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">Reservado</span>;
      case "maintenance":
        return <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">Manutenção</span>;
      case "broken":
        return <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">Danificado</span>;
      default:
        return <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">Desconhecido</span>;
    }
  };

  // Data for pie chart
  const chartData = [
    { name: "Disponível", value: inventoryStats.availableItems, color: "#10B981" },
    { name: "Reservado", value: inventoryStats.reservedItems, color: "#3B82F6" },
    { name: "Manutenção", value: inventoryStats.maintenanceItems, color: "#F59E0B" },
    { name: "Danificado", value: inventoryStats.brokenItems, color: "#EF4444" }
  ];

  return (
    <>
      <PageHeader 
        title="Inventário" 
        description="Gerencie o estoque de equipamentos e suprimentos"
        actionLabel="Adicionar Item"
        onActionClick={() => setNewItemDialogOpen(true)}
      />
      
      <PageWrapper>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{inventoryStats.totalItems}</div>
              <p className="text-muted-foreground text-sm">Itens no inventário</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium text-green-600">Disponíveis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{inventoryStats.availableItems}</div>
              <p className="text-muted-foreground text-sm">Prontos para uso</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium text-blue-600">Reservados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{inventoryStats.reservedItems}</div>
              <p className="text-muted-foreground text-sm">Em processo de entrega</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium text-yellow-600">Manutenção</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{inventoryStats.maintenanceItems}</div>
              <p className="text-muted-foreground text-sm">Em reparo ou manutenção</p>
            </CardContent>
          </Card>
        </div>
        
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="inventory">Inventário</TabsTrigger>
            <TabsTrigger value="stats">Estatísticas</TabsTrigger>
          </TabsList>
          
          <TabsContent value="inventory">
            <Card>
              <CardHeader>
                <CardTitle>Itens do Inventário</CardTitle>
                <CardDescription>Gerencie todos os equipamentos e suprimentos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar por nome, modelo ou número de série"
                      className="pl-9"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="w-full sm:w-48">
                    <Select defaultValue={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="available">Disponível</SelectItem>
                        <SelectItem value="reserved">Reservado</SelectItem>
                        <SelectItem value="maintenance">Manutenção</SelectItem>
                        <SelectItem value="broken">Danificado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-full sm:w-48">
                    <Select defaultValue={categoryFilter} onValueChange={setCategoryFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas</SelectItem>
                        <SelectItem value="terminal">Terminais</SelectItem>
                        <SelectItem value="supplies">Suprimentos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {filteredInventory.length > 0 ? (
                  <div className="border rounded-md">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Nome</TableHead>
                          <TableHead>Modelo</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Nº de Série</TableHead>
                          <TableHead>Localização</TableHead>
                          <TableHead>Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredInventory.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.id}</TableCell>
                            <TableCell>{item.name}</TableCell>
                            <TableCell>{item.model}</TableCell>
                            <TableCell>{formatStatus(item.status)}</TableCell>
                            <TableCell>{item.serialNumber}</TableCell>
                            <TableCell>{item.location}</TableCell>
                            <TableCell>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => toast({
                                  title: "Informação",
                                  description: `Os detalhes do item ${item.id} serão mostrados aqui.`
                                })}
                              >
                                Detalhes
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 border rounded-md">
                    <AlertCircle className="h-10 w-10 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-1">Nenhum item encontrado</h3>
                    <p className="text-sm text-muted-foreground mb-4">Tente ajustar os filtros ou a busca</p>
                    <Button onClick={() => {
                      setSearchTerm("");
                      setStatusFilter("all");
                      setCategoryFilter("all");
                    }}>
                      Limpar filtros
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="stats">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Distribuição por Status</CardTitle>
                  <CardDescription>Visão geral do status do inventário</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={chartData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Resumo de Inventário</CardTitle>
                  <CardDescription>Detalhes por categoria e status</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-base font-medium mb-4">Terminais</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center justify-between border rounded-md p-4">
                          <div>
                            <div className="text-muted-foreground text-xs">Disponíveis</div>
                            <div className="text-xl font-semibold">
                              {inventoryData.filter(item => item.category === "terminal" && item.status === "available").length}
                            </div>
                          </div>
                          <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                          </div>
                        </div>
                        <div className="flex items-center justify-between border rounded-md p-4">
                          <div>
                            <div className="text-muted-foreground text-xs">Em Manutenção</div>
                            <div className="text-xl font-semibold">
                              {inventoryData.filter(item => item.category === "terminal" && item.status === "maintenance").length}
                            </div>
                          </div>
                          <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center">
                            <AlertCircle className="h-4 w-4 text-yellow-600" />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-base font-medium mb-4">Suprimentos</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center justify-between border rounded-md p-4">
                          <div>
                            <div className="text-muted-foreground text-xs">Estoque Atual</div>
                            <div className="text-xl font-semibold">
                              {inventoryData.filter(item => item.category === "supplies").length}
                            </div>
                          </div>
                          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <Box className="h-4 w-4 text-blue-600" />
                          </div>
                        </div>
                        <div className="flex items-center justify-between border rounded-md p-4">
                          <div>
                            <div className="text-muted-foreground text-xs">Status</div>
                            <div className="text-sm font-semibold text-green-600">Adequado</div>
                          </div>
                          <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </PageWrapper>
      
      {/* Dialog for adding a new inventory item */}
      <Dialog open={newItemDialogOpen} onOpenChange={setNewItemDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Item ao Inventário</DialogTitle>
            <DialogDescription>
              Preencha os detalhes do novo item a ser adicionado ao inventário.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nome do Item</Label>
              <Input id="name" placeholder="Ex: Terminal de Pagamento A10" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="model">Modelo</Label>
                <Input id="model" placeholder="Ex: A10" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Categoria</Label>
                <Select defaultValue="terminal">
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="terminal">Terminal</SelectItem>
                    <SelectItem value="supplies">Suprimento</SelectItem>
                    <SelectItem value="accessory">Acessório</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="serial">Número de Série</Label>
                <Input id="serial" placeholder="Ex: SN-A10-003" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select defaultValue="available">
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Disponível</SelectItem>
                    <SelectItem value="reserved">Reservado</SelectItem>
                    <SelectItem value="maintenance">Manutenção</SelectItem>
                    <SelectItem value="broken">Danificado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="location">Localização</Label>
              <Input id="location" placeholder="Ex: Estoque Central" />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewItemDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={() => {
              toast({
                title: "Item adicionado",
                description: "O item foi adicionado ao inventário com sucesso."
              });
              setNewItemDialogOpen(false);
            }}>
              Adicionar Item
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Inventory;
